"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";

type RankingItem = {
  nome: string;
  moedas: number;
};

type DemoWalletContextType = {
  saldo: number;
  setSaldo: React.Dispatch<React.SetStateAction<number>>;
  saldoReal: number;
  setSaldoReal: React.Dispatch<React.SetStateAction<number>>;
  nomeUsuario: string;
  setNomeUsuario: React.Dispatch<React.SetStateAction<string>>;
  ranking: RankingItem[];
  totalApostadoGlobal: number;
  totalGanhoGlobal: number;
  totalRodadasGlobal: number;
  registrarResultado: (aposta: number, premio: number) => void;
  resetarTudoGlobal: () => void;
  depositar: (valor: number, metodo: string) => void;
  sacar: (valor: number) => boolean;
};

const SALDO_INICIAL = 10000;

const rankingBase: RankingItem[] = [
  { nome: "Luna", moedas: 24500 },
  { nome: "Rafa", moedas: 19800 },
  { nome: "Kaio", moedas: 17350 },
  { nome: "Maya", moedas: 16100 },
];

const DemoWalletContext = createContext<DemoWalletContextType | undefined>(
  undefined
);

function getStoredNumber(key: string, fallback: number) {
  if (typeof window === "undefined") return fallback;

  const storedValue = window.localStorage.getItem(key);
  if (storedValue === null) return fallback;

  const value = Number(storedValue);
  return Number.isFinite(value) ? value : fallback;
}

function getStoredString(key: string, fallback: string) {
  if (typeof window === "undefined") return fallback;

  return window.localStorage.getItem(key) ?? fallback;
}

export function DemoWalletProvider({ children }: { children: ReactNode }) {
  const [saldo, setSaldo] = useState(SALDO_INICIAL);
  const [saldoReal, setSaldoReal] = useState(0);
  const [nomeUsuario, setNomeUsuario] = useState("Jogador");
  const [totalApostadoGlobal, setTotalApostadoGlobal] = useState(0);
  const [totalGanhoGlobal, setTotalGanhoGlobal] = useState(0);
  const [totalRodadasGlobal, setTotalRodadasGlobal] = useState(0);
  const carregadoRef = useRef(false);

  useEffect(() => {
    let cancelado = false;

    queueMicrotask(() => {
      if (cancelado) return;

      setSaldo(getStoredNumber("demo-wallet-saldo", SALDO_INICIAL));
      setSaldoReal(getStoredNumber("demo-wallet-saldo-real", 0));
      setNomeUsuario(getStoredString("demo-wallet-nome", "Jogador"));
      setTotalApostadoGlobal(getStoredNumber("demo-global-apostado", 0));
      setTotalGanhoGlobal(getStoredNumber("demo-global-ganho", 0));
      setTotalRodadasGlobal(getStoredNumber("demo-global-rodadas", 0));
      carregadoRef.current = true;
    });

    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    if (!carregadoRef.current) return;

    window.localStorage.setItem("demo-wallet-saldo", String(saldo));
    window.localStorage.setItem("demo-wallet-saldo-real", String(saldoReal));
    window.localStorage.setItem("demo-wallet-nome", nomeUsuario);
    window.localStorage.setItem(
      "demo-global-apostado",
      String(totalApostadoGlobal)
    );
    window.localStorage.setItem("demo-global-ganho", String(totalGanhoGlobal));
    window.localStorage.setItem(
      "demo-global-rodadas",
      String(totalRodadasGlobal)
    );
  }, [
    saldo,
    saldoReal,
    nomeUsuario,
    totalApostadoGlobal,
    totalGanhoGlobal,
    totalRodadasGlobal,
  ]);

  const registrarResultado = useCallback((aposta: number, premio: number) => {
    setTotalApostadoGlobal((valor) => valor + aposta);
    setTotalGanhoGlobal((valor) => valor + premio);
    setTotalRodadasGlobal((valor) => valor + 1);
  }, []);

  const resetarTudoGlobal = useCallback(() => {
    setSaldo(SALDO_INICIAL);
    setSaldoReal(0);
    setTotalApostadoGlobal(0);
    setTotalGanhoGlobal(0);
    setTotalRodadasGlobal(0);

    window.localStorage.setItem("demo-wallet-saldo", String(SALDO_INICIAL));
    window.localStorage.setItem("demo-wallet-saldo-real", "0");
    window.localStorage.setItem("demo-global-apostado", "0");
    window.localStorage.setItem("demo-global-ganho", "0");
    window.localStorage.setItem("demo-global-rodadas", "0");
  }, []);

  const depositar = useCallback((valor: number) => {
    setSaldoReal((prev) => prev + valor);
  }, []);

  const sacar = useCallback((valor: number) => {
    if (valor <= saldoReal) {
      setSaldoReal((prev) => prev - valor);
      return true;
    }
    return false;
  }, [saldoReal]);

  const ranking = useMemo(() => {
    const lista = [
      ...rankingBase,
      { nome: nomeUsuario || "Jogador", moedas: saldo },
    ];

    return lista.sort((a, b) => b.moedas - a.moedas).slice(0, 5);
  }, [nomeUsuario, saldo]);

  const value = useMemo(
    () => ({
      saldo,
      setSaldo,
      saldoReal,
      setSaldoReal,
      nomeUsuario,
      setNomeUsuario,
      ranking,
      totalApostadoGlobal,
      totalGanhoGlobal,
      totalRodadasGlobal,
      registrarResultado,
      resetarTudoGlobal,
      depositar,
      sacar,
    }),
    [
      saldo,
      saldoReal,
      nomeUsuario,
      ranking,
      totalApostadoGlobal,
      totalGanhoGlobal,
      totalRodadasGlobal,
      registrarResultado,
      resetarTudoGlobal,
      depositar,
      sacar,
    ]
  );

  return (
    <DemoWalletContext.Provider value={value}>
      {children}
    </DemoWalletContext.Provider>
  );
}

export function useDemoWallet() {
  const context = useContext(DemoWalletContext);

  if (!context) {
    throw new Error(
      "useDemoWallet precisa ser usado dentro de DemoWalletProvider"
    );
  }

  return context;
}
