# BetClean - Plataforma de Jogos

Plataforma profissional de jogos autorais com integração PSP (Exacta Pay) para pagamentos reais.

## 🚀 Funcionalidades

- 🎮 **3 Jogos Autorais**: Fortuna Neon (Slot), Turbo Rise (Aviator), Orbit Wheel (Roleta)
- 💰 **Carteira Dupla**: Saldo demo para prática + Saldo real para apostas
- 💳 **Pagamentos Reais**: Integração com Exacta Pay (Pix + Criptomoedas)
- 📊 **Sistema de Ranking**: Competição entre jogadores
- 🔐 **PSP Seguro**: Transações rastreadas e conformidade regulatória

## 🛠️ Configuração

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Exacta Pay

1. Acesse: https://dashboard.exactapay.com
2. Crie sua conta de merchant
3. Obtenha suas credenciais:
   - `EXACTA_API_KEY`
   - `EXACTA_SECRET_KEY`
   - `EXACTA_MERCHANT_ID`

### 3. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

Preencha com suas credenciais:
```env
# Exacta Pay Configuration
EXACTA_API_URL=https://api.exactapay.com/v1
EXACTA_API_KEY=sua_api_key_aqui
EXACTA_SECRET_KEY=sua_secret_key_aqui
EXACTA_MERCHANT_ID=seu_merchant_id_aqui

# Webhook (opcional)
EXACTA_WEBHOOK_SECRET=seu_webhook_secret_aqui

NODE_ENV=production
```

### 4. Executar o Projeto
```bash
npm run dev
```

## 💰 Sistema de Pagamentos

### Modo Desenvolvimento (Mock)
Quando as credenciais não estão configuradas, o sistema funciona em modo mock:
- ✅ Gera transações simuladas
- ✅ Mostra QR codes de exemplo
- ✅ Simula confirmações automáticas
- ✅ Perfeito para testes

### Modo Produção (Real)
Com credenciais configuradas:
- ✅ Integração real com Exacta Pay
- ✅ Pix instantâneo
- ✅ Criptomoedas (BTC, ETH, USDT)
- ✅ Webhooks para confirmações automáticas
- ✅ Anti-fraude e conformidade

## 🎯 Fluxo de Pagamentos

### Depósito Pix
1. Usuário clica "Depositar"
2. Sistema gera transação via Exacta Pay
3. QR Code exibido na tela
4. Usuário escaneia e paga
5. PSP confirma automaticamente
6. Saldo creditado instantaneamente

### Depósito Cripto
1. Sistema gera endereço único
2. Usuário envia cripto para o endereço
3. PSP monitora blockchain
4. Confirmação automática
5. Saldo creditado

### Saques
- Transferência direta para conta bancária
- Processamento em até 2 dias úteis
- Sem taxas adicionais

## 🔒 Segurança

- ✅ **SSL 256-bit** em todas as conexões
- ✅ **PCI DSS Compliant** (quando usar cartões)
- ✅ **Dados criptografados** em trânsito e repouso
- ✅ **Anti-fraude** integrado no PSP
- ✅ **KYC/AML** pronto para implementação

## 📋 Próximos Passos

1. **Obter Licença**: Regularize com órgãos competentes
2. **KYC Integration**: Implemente verificação de identidade
3. **Webhook Setup**: Configure notificações automáticas
4. **Monitoramento**: Adicione analytics e alertas
5. **Suporte**: Implemente chat ao vivo

## 🏗️ Arquitetura

```
├── lib/exacta-pay.ts          # Cliente PSP
├── app/carteira/              # Interface de pagamentos
├── components/DemoWalletProvider.tsx  # Gerenciamento de saldos
├── app/jogos/                 # Jogos autorais
└── .env.local                 # Credenciais (não commitar)
```

## 📞 Suporte

Para dúvidas sobre integração:
- Exacta Pay: https://exactapay.com/support
- Documentação: https://docs.exactapay.com

---

**⚠️ Importante**: Esta plataforma é para uso profissional. Certifique-se de cumprir todas as regulamentações locais antes de aceitar pagamentos reais.
