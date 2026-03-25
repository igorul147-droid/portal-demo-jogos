'use client';

import { useEffect, useState, ReactNode } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

type ToastMessage = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

let toastId = 0;

// Store global para gerenciar toasts
const toastStore: { listeners: Set<(toasts: ToastMessage[]) => void> } = {
  listeners: new Set(),
};

let toasts: ToastMessage[] = [];

export function showToast(message: string, type: ToastType = 'success', duration = 3000) {
  const id = String(toastId++);
  const toast: ToastMessage = { id, message, type, duration };
  
  toasts = [...toasts, toast];
  toastStore.listeners.forEach(listener => listener([...toasts]));

  if (duration && duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }

  return id;
}

export function removeToast(id: string) {
  toasts = toasts.filter(t => t.id !== id);
  toastStore.listeners.forEach(listener => listener([...toasts]));
}

function ToastItem({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  const bgColor = {
    success: 'bg-emerald-500 text-white',
    error: 'bg-rose-500 text-white',
    info: 'bg-blue-500 text-white',
  }[toast.type];

  const Icon = {
    success: Check,
    error: AlertCircle,
    info: AlertCircle,
  }[toast.type];

  return (
    <div
      className={`rounded-xl p-4 shadow-lg flex items-center gap-3 ${bgColor} animate-slide-in-up max-w-sm`}
    >
      <Icon size={20} />
      <p className="flex-1 font-medium">{toast.message}</p>
      <button
        onClick={onClose}
        className="rounded hover:bg-white/20 p-1 transition"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const [toastList, setToastList] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (newToasts: ToastMessage[]) => {
      setToastList([...newToasts]);
    };

    toastStore.listeners.add(listener);
    return () => {
      toastStore.listeners.delete(listener);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 max-w-sm">
      {toastList.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
