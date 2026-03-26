"use client";

import { useState } from "react";
import PortalHeader from "@/components/PortalHeader";
import Footer from "@/components/Footer";
import { useDemoWallet } from "@/components/DemoWalletProvider";
import { CreditCard, Zap, TrendingUp, AlertCircle, Lock, Copy, Check } from "lucide-react";
import exactaPay from "@/lib/exacta-pay";
import { formatBRL } from "@/lib/currency";

function formatarMoedas(valor: number) {
  return formatBRL(valor);
}

function formatarReal(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

// Gera QR Code ASCII art simples para demo
function gerarQRCodeASCII() {
  return `
    █████████████████████████████
    ██ ▄▄▄▄▄ █▀█▄█▀ ▀▀▀▀█░█░█ ▀███
    ██ █   █ █▀██  █▄█▄█ ░ █ █ ███
    ██ █▄▄▄█ ██▀▀█  █ ██░██ █▀███
    ██▄▄▄▄▄▄▄█ ▀ █ █▄▀ ▀ █▄█▀███
    ██ ▄▀█▀ █▄▀  ▄█   ▀  █ ▀ ▄███
    █████████████████████████████
  `;
}

export default function CarteiraPage() {
  const { saldo, setSaldo, saldoReal, setSaldoReal, sacar } = useDemoWallet();

  const [activeTab, setActiveTab] = useState<"depositar" | "sacar">("depositar");
  const [valorDeposito, setValorDeposito] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("cartao");
  const [valorSaque, setValorSaque] = useState("");
  const [messageDeposito, setMessageDeposito] = useState("");
  const [messageSaque, setMessageSaque] = useState("");
  const [carregandoDeposito, setCarregandoDeposito] = useState(false);
  const [carregandoSaque, setCarregandoSaque] = useState(false);
  const [copiouPix, setCopiouPix] = useState(false);
  const [mostraQRCode, setMostraQRCode] = useState(false);
  const [transacaoPix, setTransacaoPix] = useState<{
    id: string;
    qr_code: string;
    qr_code_base64?: string;
    amount: number;
    status: "pending" | "paid" | "expired";
    expires_at: string;
    pix_key: string;
  } | null>(null);
  const [transacaoCripto, setTransacaoCripto] = useState<{
    id: string;
    address: string;
    amount: number;
    crypto_amount: number;
    crypto_currency: string;
    status: "pending" | "received" | "expired";
    expires_at: string;
    qr_code?: string;
  } | null>(null);

  const metodos = [
    { id: "pix", nome: "⚡ Pix (Recomendado)", icon: Zap },
    { id: "cripto", nome: "🪙 Criptomoedas (Bitcoin/Ethereum)", icon: TrendingUp },
  ];

  // Formata validade
  function formatarValidade(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 4);
    if (numeros.length >= 2) {
      return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    }
    return numeros;
  }

  // Criar transação Pix via Exacta Pay
  async function criarTransacaoPix(valor: number) {
    const referenceId = `PIX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    try {
      const response = await exactaPay.createPixTransaction({
        amount: valor,
        currency: 'BRL',
        description: 'Depósito BetClean',
        reference_id: referenceId,
      });

      return response;
    } catch (error) {
      console.error('Erro ao criar transação Pix:', error);
      throw error;
    }
  }

  // Criar transação Cripto via Exacta Pay
  async function criarTransacaoCripto(valor: number, moeda: "BTC" | "ETH" | "USDT") {
    const referenceId = `CRYPTO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    try {
      const response = await exactaPay.createCryptoTransaction({
        amount: valor,
        currency: 'BRL',
        crypto_currency: moeda,
        description: 'Depósito BetClean',
        reference_id: referenceId,
      });

      return response;
    } catch (error) {
      console.error('Erro ao criar transação cripto:', error);
      throw error;
    }
  }

  function validarCartao() {
    return true;
  }

  async function handleDepositar(e: React.FormEvent) {
    e.preventDefault();
    const valor = parseFloat(valorDeposito);

    if (!valor || valor <= 0) {
      setMessageDeposito("Por favor, digite um valor válido");
      return;
    }

    if (valor < 10) {
      setMessageDeposito("Valor mínimo de depósito é R$ 10");
      return;
    }

    if (valor > 100000) {
      setMessageDeposito("Valor máximo de depósito é R$ 100.000");
      return;
    }

    setCarregandoDeposito(true);
    setMessageDeposito("");
    setTransacaoPix(null);
    setTransacaoCripto(null);

    // Criar transação via Exacta Pay
    setTimeout(async () => {
      try {
        if (metodoPagamento === "pix") {
          const transacao = await criarTransacaoPix(valor);
          setTransacaoPix(transacao);
          setMessageDeposito(`⏳ Transação Pix criada. Escaneie o QR Code para pagar.`);

          // Simular webhook de confirmação (em produção seria automático)
          setTimeout(async () => {
            try {
              const status = await exactaPay.getTransactionStatus(transacao.id, 'pix');
              if (status.status === 'paid') {
                setSaldoReal((prev) => prev + valor);
                setSaldo((prev) => prev + valor);
                setTransacaoPix({ ...transacao, status: "paid" });
                setMessageDeposito(`✅ Depósito de ${formatarReal(valor)} confirmado!`);
                setValorDeposito("");
                setTimeout(() => {
                  setMessageDeposito("");
                  setTransacaoPix(null);
                }, 3000);
              }
            } catch (error) {
              console.error('Erro ao verificar status:', error);
            }
          }, 5000);
        } else if (metodoPagamento === "cripto") {
          const moeda = (Math.random() > 0.5 ? "BTC" : "ETH") as "BTC" | "ETH" | "USDT";
          const transacao = await criarTransacaoCripto(valor, moeda);
          setTransacaoCripto(transacao);
          setMessageDeposito(`⏳ Endereço ${moeda} gerado. Envie a quantidade exata.`);

          // Simular monitoramento blockchain
          setTimeout(async () => {
            try {
              const status = await exactaPay.getTransactionStatus(transacao.id, 'crypto');
              if (status.status === 'received') {
                setSaldoReal((prev) => prev + valor);
                setSaldo((prev) => prev + valor);
                setTransacaoCripto({ ...transacao, status: "received" });
                setMessageDeposito(`✅ Depósito de ${formatarReal(valor)} confirmado na blockchain!`);
                setValorDeposito("");
                setTimeout(() => {
                  setMessageDeposito("");
                  setTransacaoCripto(null);
                }, 3000);
              }
            } catch (error) {
              console.error('Erro ao verificar status cripto:', error);
            }
          }, 10000);
        }

        setCarregandoDeposito(false);
      } catch (error) {
        setMessageDeposito("❌ Erro ao conectar ao PSP. Tente novamente.");
        setCarregandoDeposito(false);
      }
    }, 1500);
  }

  function handleSacar(e: React.FormEvent) {
    e.preventDefault();
    const valor = parseFloat(valorSaque);

    if (!valor || valor <= 0) {
      setMessageSaque("Por favor, digite um valor válido");
      return;
    }

    if (valor < 50) {
      setMessageSaque("Valor mínimo de saque é R$ 50");
      return;
    }

    if (valor > saldoReal) {
      setMessageSaque(`Saldo insuficiente. Você tem ${formatarReal(saldoReal)}`);
      return;
    }

    setCarregandoSaque(true);
    setMessageSaque("");

    // Simula processamento de saque
    setTimeout(() => {
      try {
        const saqueConfirmado = sacar(valor);

        if (!saqueConfirmado) {
          setMessageSaque("❌ Saldo insuficiente para concluir o saque.");
          setCarregandoSaque(false);
          return;
        }

        setSaldo((prev) => prev - valor);
        setMessageSaque(`✅ Saque de ${formatarReal(valor)} solicitado! Você receberá em até 2 dias úteis.`);
        setValorSaque("");
        setCarregandoSaque(false);

        // Limpa mensagem após 3 segundos
        setTimeout(() => setMessageSaque(""), 3000);
      } catch (error) {
        setMessageSaque("❌ Erro ao processar saque. Tente novamente.");
        setCarregandoSaque(false);
      }
    }, 1500);
  }

  function copiarPix() {
    const pixKey = "betclean@pix.com.br";
    navigator.clipboard.writeText(pixKey);
    setCopiouPix(true);
    setTimeout(() => setCopiouPix(false), 2000);
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <PortalHeader />

      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <a
            href="/"
            className="inline-flex rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 mb-6"
          >
            ← Voltar
          </a>

          <h1 className="text-4xl font-bold mb-2">Minha Carteira</h1>
          <p className="text-white/60">Gerencie seus depósitos e saques de dinheiro real com segurança SSL</p>
        </div>

        {/* Aviso de Segurança */}
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 flex gap-3 mb-8">
          <Lock size={20} className="text-emerald-300 flex-shrink-0" />
          <div className="text-sm text-emerald-300">
            <p className="font-semibold">🔐 Conexão Segura</p>
            <p>Seus dados são criptografados com SSL 256-bit. Nunca armazenamos dados completos de cartão.</p>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {/* Saldo Prática */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-amber-400/20 to-orange-500/10 p-6">
            <p className="text-sm text-white/60 mb-2">💰 Saldo Prática</p>
            <p className="text-3xl font-bold text-amber-300">{formatarMoedas(saldo)}</p>
            <p className="text-xs text-white/40 mt-2">Modo de aprendizado</p>
          </div>

          {/* Saldo Real */}
          <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/20 to-teal-500/10 p-6">
            <p className="text-sm text-white/60 mb-2">💵 Saldo Real</p>
            <p className="text-3xl font-bold text-emerald-300">{formatarReal(saldoReal)}</p>
            <p className="text-xs text-white/40 mt-2">Dinheiro disponível para apostas</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          {/* Tab Buttons */}
          <div className="flex gap-2 mb-8 border-b border-white/10">
            <button
              onClick={() => setActiveTab("depositar")}
              className={`px-4 py-3 font-semibold transition border-b-2 ${
                activeTab === "depositar"
                  ? "border-amber-400 text-amber-300"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              💳 Depositar
            </button>
            <button
              onClick={() => setActiveTab("sacar")}
              className={`px-4 py-3 font-semibold transition border-b-2 ${
                activeTab === "sacar"
                  ? "border-emerald-400 text-emerald-300"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              💸 Sacar
            </button>
          </div>

          {/* Depositar Tab */}
          {activeTab === "depositar" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Adicionar Fundos</h2>

              {/* Método de Pagamento */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Selecione o método de pagamento:</label>
                <div className="grid gap-3 md:grid-cols-3">
                  {metodos.map((metodo) => (
                    <button
                      key={metodo.id}
                      onClick={() => setMetodoPagamento(metodo.id)}
                      className={`rounded-2xl border-2 p-4 text-left transition ${
                        metodoPagamento === metodo.id
                          ? "border-amber-400 bg-amber-400/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <p className="font-semibold">{metodo.nome}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Valor */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Valor do Depósito (R$)</label>
                <input
                  type="number"
                  value={valorDeposito}
                  onChange={(e) => setValorDeposito(e.target.value)}
                  placeholder="0,00"
                  step="0.01"
                  min="10"
                  max="100000"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20"
                />
                <p className="text-xs text-white/50 mt-1">Mínimo: R$ 10 | Máximo: R$ 100.000</p>
              </div>

              {/* Pix - QR Code Dinâmico */}
              {metodoPagamento === "pix" && (
                <div className="mb-6 space-y-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <h3 className="font-semibold flex items-center gap-2 text-sm">
                    <Zap size={16} className="text-yellow-300" />
                    Depósito via Pix (PSP)
                  </h3>

                  {!transacaoPix ? (
                    <p className="text-xs text-white/60">
                      ✓ PSP Exacta Pay integrado • ✓ Transação rastreada • ✓ Confirmação automática
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-white/50 mb-1">ID Transação (Exacta Pay):</p>
                        <p className="text-xs font-mono text-amber-300">{transacaoPix?.id}</p>
                      </div>

                      {transacaoPix?.status === "pending" && (
                        <div>
                          <button
                            onClick={() => setMostraQRCode(!mostraQRCode)}
                            className="w-full rounded-lg bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 py-2 text-sm font-semibold hover:bg-yellow-500/30 transition"
                          >
                            {mostraQRCode ? "🔒 Esconder QR Code" : "📱 Mostrar QR Code"}
                          </button>

                          {mostraQRCode && (
                            <div className="bg-white/5 rounded-lg p-4 text-center mt-2">
                              <p className="text-xs text-white/50 mb-2">Escaneie com seu app bancário:</p>
                              <div className="bg-white rounded-lg p-3 inline-block">
                                <pre className="text-[9px] leading-none text-black font-bold">
                                  {gerarQRCodeASCII()}
                                </pre>
                              </div>
                              <p className="text-xs text-white/40 mt-3">Valor: {formatarReal(transacaoPix?.amount ?? 0)}</p>
                              <p className="text-xs text-white/40">⏳ Aguardando pagamento...</p>
                            </div>
                          )}
                        </div>
                      )}

                      {transacaoPix?.status === "paid" && (
                        <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-lg p-3 text-center">
                          <p className="text-sm font-semibold text-emerald-300">✅ Pagamento Confirmado!</p>
                          <p className="text-xs text-emerald-300/80 mt-1">{formatarReal(transacaoPix?.amount ?? 0)} creditado em sua conta</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Cripto - Endereço Único */}
              {metodoPagamento === "cripto" && (
                <div className="mb-6 space-y-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <h3 className="font-semibold flex items-center gap-2 text-sm">
                    <TrendingUp size={16} className="text-purple-300" />
                    Depósito via Criptomoeda (Blockchain)
                  </h3>

                  {!transacaoCripto ? (
                    <p className="text-xs text-white/60">
                      ✓ Endereço único por transação • ✓ Monitoramento blockchain • ✓ Múltiplas moedas
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-white/50 mb-1">Rede / Moeda:</p>
                        <p className="text-sm font-semibold text-purple-300">{transacaoCripto?.crypto_currency}</p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-3">
                        <p className="text-xs text-white/50 mb-1">Endereço para depósito:</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={transacaoCripto?.address || ""}
                            readOnly
                            className="flex-1 rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-white text-xs outline-none font-mono"
                          />
                          <button
                            onClick={() => {
                              if (transacaoCripto?.address) {
                                navigator.clipboard.writeText(transacaoCripto.address);
                                setCopiouPix(true);
                                setTimeout(() => setCopiouPix(false), 2000);
                              }
                            }}
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white hover:bg-white/10 transition"
                          >
                            {copiouPix ? <Check size={16} className="text-emerald-300" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
                        <p className="text-xs text-blue-300">
                          <strong>Valor esperado:</strong> {formatarReal(transacaoCripto?.amount ?? 0)}
                        </p>
                        <p className="text-xs text-blue-300 mt-1">
                          <strong>{transacaoCripto?.crypto_currency}:</strong> {transacaoCripto?.crypto_amount?.toFixed(8)}
                        </p>
                        {transacaoCripto?.status === "pending" && (
                          <p className="text-xs text-blue-300/80 mt-1">⏳ Monitorando blockchain...</p>
                        )}
                        {transacaoCripto?.status === "received" && (
                          <p className="text-xs text-emerald-300 mt-1">✅ Recebimento confirmado!</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {messageDeposito && (
                <div className={`rounded-2xl border p-3 text-sm mb-4 ${
                  messageDeposito.includes("✅")
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                    : messageDeposito.includes("⏳")
                    ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
                    : "border-rose-400/30 bg-rose-400/10 text-rose-300"
                }`}>
                  {messageDeposito}
                </div>
              )}

              <form onSubmit={handleDepositar}>
                <button
                  type="submit"
                  disabled={carregandoDeposito || transacaoPix !== null || transacaoCripto !== null}
                  className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 font-semibold text-black transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {carregandoDeposito ? "Gerando..." : transacaoPix || transacaoCripto ? "Aguardando confirmação..." : "Gerar Transação"}
                </button>
              </form>
            </div>
          )}

          {/* Sacar Tab */}
          {activeTab === "sacar" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Solicitar Saque</h2>

              <form onSubmit={handleSacar} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Valor do Saque (R$)</label>
                  <input
                    type="number"
                    value={valorSaque}
                    onChange={(e) => setValorSaque(e.target.value)}
                    placeholder="0,00"
                    step="0.01"
                    min="50"
                    max={saldoReal}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20"
                  />
                  <p className="text-xs text-white/50 mt-1">
                    Mínimo: R$ 50 | Disponível: {formatarReal(saldoReal)}
                  </p>
                </div>

                {messageSaque && (
                  <div className={`rounded-2xl border p-3 text-sm ${
                    messageSaque.includes("✅")
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      : "border-rose-400/30 bg-rose-400/10 text-rose-300"
                  }`}>
                    {messageSaque}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={carregandoSaque || saldoReal === 0}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 px-6 py-3 font-semibold text-black transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {carregandoSaque ? "Processando..." : "Solicitar Saque"}
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-blue-400/30 bg-blue-400/10 p-4 flex gap-3">
                <AlertCircle size={20} className="text-blue-300 flex-shrink-0" />
                <div className="text-sm text-blue-300">
                  <p className="font-semibold mb-1">Prazo de processamento:</p>
                  <p>Saques são processados em até 2 dias úteis. Sem taxas adicionais!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
