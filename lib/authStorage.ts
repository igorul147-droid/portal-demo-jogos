export type DemoAccount = {
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  senha: string;
  criadoEm: string;
};

export type RecoveryLogItem = {
  email: string;
  enviadoEm: string;
  template: string;
};

const ACCOUNTS_KEY = "demo-wallet-accounts";
const RECOVERY_LOG_KEY = "demo-wallet-recovery-log";

function parseJsonArray<T>(raw: string | null): T[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

export function getAccounts(): DemoAccount[] {
  return parseJsonArray<DemoAccount>(window.localStorage.getItem(ACCOUNTS_KEY));
}

export function saveAccounts(accounts: DemoAccount[]) {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function upsertAccount(account: DemoAccount) {
  const accounts = getAccounts();
  const index = accounts.findIndex((item) => item.email === account.email);

  if (index >= 0) {
    accounts[index] = account;
  } else {
    accounts.push(account);
  }

  saveAccounts(accounts);
}

export function findAccountByEmail(email: string): DemoAccount | null {
  const emailNormalized = normalizeEmail(email);
  const account = getAccounts().find((item) => item.email === emailNormalized);
  return account ?? null;
}

export function emailJaCadastrado(email: string): boolean {
  return !!findAccountByEmail(email);
}

export function cpfJaCadastrado(cpf: string): boolean {
  const cpfNormalized = normalizeCpf(cpf);
  return getAccounts().some((item) => item.cpf === cpfNormalized);
}

export function getRecoveryLog(): RecoveryLogItem[] {
  return parseJsonArray<RecoveryLogItem>(window.localStorage.getItem(RECOVERY_LOG_KEY));
}

export function registrarEmailRecuperacao(email: string) {
  const template =
    "Assunto: Recuperacao de conta BetClean | Corpo: Recebemos sua solicitacao. Use o link seguro para redefinir sua senha em ate 15 minutos.";

  const item: RecoveryLogItem = {
    email: normalizeEmail(email),
    enviadoEm: new Date().toISOString(),
    template,
  };

  const atual = getRecoveryLog();
  atual.unshift(item);

  window.localStorage.setItem(RECOVERY_LOG_KEY, JSON.stringify(atual.slice(0, 30)));

  return item;
}