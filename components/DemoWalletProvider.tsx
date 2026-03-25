"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
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
  sacar: (valor: number) => void;
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

export function DemoWalletProvider({ children }: { children: ReactNode }) {
  const [saldo, setSaldo] = useState(SALDO_INICIAL);
  const [saldoReal, setSaldoReal] = useState(0);
  const [nomeUsuario, setNomeUsuario] = useState("Jogador Demo");
  const [totalApostadoGlobal, setTotalApostadoGlobal] = useState(0);
  const [totalGanhoGlobal, setTotalGanhoGlobal] = useState(0);
  const [totalRodadasGlobal, setTotalRodadasGlobal] = useState(0);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    const saldoSalvo = window.localStorage.getItem("demo-wallet-saldo");
    const saldoRealSalvo = window.localStorage.getItem("demo-wallet-saldo-real");
    const nomeSalvo = window.localStorage.getItem("demo-wallet-nome");
    const apostadoSalvo = window.localStorage.getItem("demo-global-apostado");
    const ganhoSalvo = window.localStorage.getItem("demo-global-ganho");
    const rodadasSalvas = window.localStorage.getItem("demo-global-rodadas");

    if (saldoSalvo) setSaldo(Number(saldoSalvo));
    if (saldoRealSalvo) setSaldoReal(Number(saldoRealSalvo));
    if (nomeSalvo) setNomeUsuario(nomeSalvo);
    if (apostadoSalvo) setTotalApostadoGlobal(Number(apostadoSalvo));
    if (ganhoSalvo) setTotalGanhoGlobal(Number(ganhoSalvo));
    if (rodadasSalvas) setTotalRodadasGlobal(Number(rodadasSalvas));

    setCarregado(true);
  }, []);

  useEffect(() => {
    if (!carregado) return;

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
    carregado,
  ]);

  function registrarResultado(aposta: number, premio: number) {
    setTotalApostadoGlobal((valor) => valor + aposta);
    setTotalGanhoGlobal((valor) => valor + premio);
    setTotalRodadasGlobal((valor) => valor + 1);
  }

  function resetarTudoGlobal() {
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
  }

  function depositar(valor: number, metodo: string) {
    setSaldoReal((prev) => prev + valor);
  }

  function sacar(valor: number) {
    if (valor <= saldoReal) {
      setSaldoReal((prev) => prev - valor);
      return true;
    }
    return false;
  }

  const ranking = useMemo(() => {
    const lista = [
      ...rankingBase,
      { nome: nomeUsuario || "Jogador Demo", moedas: saldo },
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