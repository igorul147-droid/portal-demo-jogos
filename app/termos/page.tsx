'use client';

import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';
import { useState } from 'react';
import Link from 'next/link';

type Section = 'termos' | 'politica' | 'kyc' | 'responsavel';

export default function TermosPage() {
  const [openSection, setOpenSection] = useState<Section>('termos');

  const sections: Record<Section, { title: string; content: string }> = {
    termos: {
      title: 'Termos de Serviço',
      content: `
# Termos de Serviço - BetClean

**Última atualização: 24 de Março, 2026**

## 1. Aceitação dos Termos

Ao acessar e usar a plataforma BetClean, você concorda em estar vinculado por estes Termos de Serviço. Se não concorda com qualquer parte destes termos, não use o serviço.

## 2. Descrição do Serviço

BetClean é uma plataforma digital de jogos e entretenimento com recursos de carteira, autenticação e controles de segurança. O uso da plataforma está sujeito às leis locais e às regras de compliance aplicáveis.

## 3. Elegibilidade

- Você deve ter pelo menos 18 anos para usar este serviço
- Você é responsável por garantir que seu uso não viole qualquer lei local aplicável
- Este serviço é proibido em jurisdições onde jogos de azar são ilegais

## 4. Direitos de Propriedade Intelectual

Todo o conteúdo, incluindo design, gráficos, logos, é propriedade intelectual de BetClean. Você não pode reproduzir, distribuir ou transmitir o conteúdo sem permissão explícita.

## 5. Limitação de Responsabilidade

BetClean não é responsável por danos diretos ou indiretos resultantes do uso ou incapacidade de usar o serviço, incluindo perda de dados, lucros cessantes ou danos especiais, mesmo que informado da possibilidade de tais danos.

## 6. Modificações dos Termos

Reservamos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas via email ou mediante áudio na plataforma.

## 7. Rescisão

Podemos rescindir sua conta imediatamente se violar estes termos ou se detectarmos atividades fraudulentas.

## 8. Lei Aplicável

Estes termos estão sujeitos às leis aplicáveis. Qualquer disputa será resolvida em tribunal competente.
      `,
    },
    politica: {
      title: 'Política de Privacidade',
      content: `
# Política de Privacidade

**Última atualização: 24 de Março, 2026**

## 1. Informações que Coletamos

Coletamos as seguintes informações:
- **Dados de Cadastro**: Nome, email, data de nascimento
- **Dados de Navegação**: IP, cookies, tipo de navegador
- **Dados de Jogo**: Histórico de apostas, resultados, preferências
- **Informações de Contato**: Para suporte ao cliente

## 2. Como Usamos Seus Dados

Seus dados são usados para:
- Fornecer e melhorar nossos serviços
- Comunicação com você (suporte, atualizações)
- Análise de segurança e prevenção de fraudes
- Conformidade regulatória

## 3. Compartilhamento de Dados

**Não vendemos seus dados para terceiros.** Podemos compartilhar dados apenas com:
- Provedores de serviço necessários para operação
- Autoridades legais quando obrigado por lei
- Partners de segurança e anti-fraude

## 4. Proteção de Dados

Implementamos medidas de segurança de padrão industrial, incluindo:
- Criptografia SSL/TLS
- Autenticação segura
- Backups regulares
- Monitoramento 24/7

## 5. Seus Direitos

Você tem o direito de:
- Acessar seus dados pessoais
- Solicitar correção de dados imprecisos
- Solicitar exclusão de dados (direito ao esquecimento)
- Portar seus dados para outro serviço

## 6. Cookies

Usamos cookies para melhorar sua experiência. Você pode controlar cookies nas configurações do seu navegador.

## 7. Mudanças na Política

Qualquer mudança significativa será comunicada com 30 dias de antecedência.
      `,
    },
    kyc: {
      title: 'Verificação de Identidade (KYC)',
      content: `
# Verificação de Identidade - Know Your Customer (KYC)

**Última atualização: 24 de Março, 2026**

## 1. O que é KYC?

Know Your Customer (KYC) é um processo de verificação de identidade para garantir a legitimidade e segurança de todos os usuários.

## 2. Informações Necessárias

Para uma conta completa, você precisará fornecer:
- **Identidade**: RG, CNH ou Passaporte
- **Comprovante de Residência**: Fatura de utilidade, extrato bancário
- **Selfie com Documento**: Para verificação facial

## 3. Privacidade dos Dados KYC

- Seus dados KYC são armazenados separadamente com criptografia de ponta a ponta
- Apenas nossa equipe de compliance tem acesso
- Dados são deletados após 5 anos (conforme regulação)
- Nunca compartilhamos com terceiros sem consentimento

## 4. Tempo de Verificação

- **Automática**: 5-10 minutos (em 95% dos casos)
- **Manual**: até 24 horas para casos excepciais
- **Rejeição**: Você será notificado e poderá reenviar

## 5. Rejeição de KYC

Se sua verificação for rejeitada, você pode:
- Entrar em contato com suporte investigativo
- Reenviar documentos corrigidos
- Solicitar revisão manual

## 6. PLD/FT (Prevenção de Lavagem de Dinheiro)

Monitoramos transações para detecção de atividades suspeitas. Isso faz parte do nosso compromisso com conformidade regulatória.

## 7. Fale Conosco

Para dúvidas sobre KYC:
📧 Email: kyc@betclean.com
📞 Chat: 24 horas
      `,
    },
    responsavel: {
      title: 'Jogo Responsável',
      content: `
# Programa de Jogo Responsável

**Última atualização: 24 de Março, 2026**

## 1. Nosso Compromisso

BetClean se compromete a promover enttretenimento seguro e responsável. Oferecemos ferramentas e recursos para ajudar você a jogar dentro de seus limites.

## 2. Sinais de Alerta

Procure ajuda se você:
- Joga mais horas do que planejava
- Esconde seu jogo de amigos e familiares
- Usa jogo para escapar de problemas
- "Persegue" perdas tentando recuperá-las
- Precisa jogar quantias maiores para manter a diversão

## 3. Ferramentas Disponíveis

### Limites de Depósito
Você pode definir um limite máximo de depósito diário/semanal/mensal:
- **Diário**: até R$ 2.000
- **Semanal**: até R$ 7.000
- **Mensal**: até R$ 20.000

*(Nota: limites operacionais podem variar conforme regras regulatórias e perfil de conta.)*

### Auto-Exclusão
Você pode se auto-excluir por:
- 24 horas
- 7 dias
- 30 dias
- Permanente

Durante a exclusão, não pode criar novas contas.

### Bloqueio de Transações
Você pode bloquear temporariamente movimentações de fundos.

### Pausa de Cooling Off
Espera obrigatória de 60 segundos entre apostas.

## 4. Recursos Externos de Ajuda

### Brasil
- **Associação Lifecirculo**: Apoio psicológico especializado
- **Alcoólicos Anônimos (AA)**: Comunidade de suporte
- **CVV (Centro de Valorização da Vida)**: 188 - Disponível 24/7

### Internacional
- **Gamblers Anonymous**: gamblers-anonymous.org
- **International Helplines**: gamblinghelp.org

## 5. Informações para Familiares

Se está preocupado com um ente querido:
- Procure entender o problema (não é fraqueza moral)
- Busque ajuda profissional junto
- Estabeleça limites financeiros firmes
- Não empreste dinheiro

## 6. Educação Financeira

Jogos de azar não são:
- Método para ganhar dinheiro
- Solução para problemas financeiros
- Investimento

Sempre jogue apenas o que pode perder.

## 7. Contato Direto

Para suporte imediato:
- 📧 Email: responsavel@betclean.com
- 📞 Telefone: 0800-AJUDA-JG (0800-25832-54)
- 💬 Chat 24/7 na plataforma
      `,
    },
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <PortalHeader />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <Link
          href="/"
          className="mb-6 inline-flex rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
        >
          ← Voltar ao portal
        </Link>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          {/* Sidebar */}
          <div className="space-y-2">
            <p className="px-4 text-xs font-semibold uppercase text-white/50">Navegação</p>
            {(Object.keys(sections) as Section[]).map((section) => (
              <button
                key={section}
                onClick={() => setOpenSection(section)}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  openSection === section
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'text-white/70 hover:bg-white/5 border border-transparent'
                }`}
              >
                {sections[section].title}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="prose prose-invert max-w-none">
              <h1 className="mb-6 text-3xl font-bold text-white">
                {sections[openSection].title}
              </h1>

              <div className="space-y-4 text-white/80">
                {sections[openSection].content.split('\n\n').map((paragraph, i) => {
                  if (paragraph.startsWith('#')) {
                    const level = paragraph.match(/#/g)?.length || 1;
                    const text = paragraph.replace(/^#+\s/, '');
                    const sizes = ['text-3xl', 'text-2xl', 'text-xl', 'text-lg'];
                    return (
                      <h2 key={i} className={`${sizes[level - 1] || 'text-lg'} font-bold text-white mt-6 mb-3`}>
                        {text}
                      </h2>
                    );
                  }

                  if (paragraph.startsWith('-')) {
                    const items = paragraph.split('\n').filter(l => l.startsWith('-'));
                    return (
                      <ul key={i} className="space-y-2 list-disc list-inside">
                        {items.map((item, j) => (
                          <li key={j}>{item.replace('- ', '')}</li>
                        ))}
                      </ul>
                    );
                  }

                  return (
                    <p key={i} className="leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Last Updated */}
            <div className="mt-12 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/60">
              <p>Esta página foi atualizada em 24 de Março de 2026.</p>
              <p className="mt-2">Se tiver dúvidas, entre em contato: contato@betclean.com</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
