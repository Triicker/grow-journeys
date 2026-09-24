# P0 — Fundação pública da Nerya

## Objetivo

Esta fase melhora a credibilidade, a proposta de valor, a conversão, a privacidade, o SEO básico e a mensuração do funil público. Não inclui área de membros, teste de nível, calendário avançado, IA educacional ou dashboard novo.

## Alterações realizadas

- Hero reescrito para priorizar aulas individuais, continuidade com o professor qualificado, evolução personalizada, conversação, pronúncia, vocabulário e flexibilidade.
- Seção institucional do professor com foto opcional, apresentação, experiência, especializações, metodologia, perfis atendidos e diferenciais.
- Seção de depoimentos preparada para avatar e vídeo, sem publicar relatos ou estatísticas fictícias.
- FAQ de conversão com accordion Radix acessível.
- Contato público centralizado e compatível com o e-mail atual por variável de ambiente.
- Política de Privacidade coerente com formulário, Resend, WhatsApp, armazenamento local, anti-spam e estado atual de analytics.
- Formulário com aviso de privacidade, feedback visível e anunciado, proteção contra reenvio, honeypot oculto e fallback por e-mail quando o WhatsApp não está configurado.
- Planos pré-carregados no servidor, com timeout, loading, erro, retry e estado vazio. No modo mock padrão, o HTML inicial já contém os planos.
- Camada centralizada de analytics sem dependência externa.
- Canonical, Open Graph, Twitter Cards, schema `Organization`, `robots.txt` e `sitemap.xml`.

## Arquitetura e arquivos principais

- `src/config/site.ts`: conteúdo institucional, professor, depoimentos e contato.
- `src/config/env.ts`: configuração tipada da origem pública, e-mail e WhatsApp.
- `src/lib/analytics.ts`: contrato de eventos e registro de providers.
- `src/hooks/use-section-tracking.ts`: observação de seções sem acoplar componentes a um provider.
- `src/components/marketing/*`: professor, depoimentos e FAQ.
- `src/components/LeadCaptureForm.tsx`: formulário, estados, LGPD e eventos.
- `src/routes/index.tsx`: proposta de valor e composição da home.
- `src/routes/planos.index.tsx`: SSR, timeout e estados dos planos.
- `src/routes/privacidade.tsx`: política de privacidade.
- `src/routes/__root.tsx`: metadados globais e structured data.
- `public/robots.txt` e `public/sitemap.xml`: descoberta e indexação.

## Eventos de analytics

Todos passam por `trackEvent(name, properties)` em `src/lib/analytics.ts`:

- `page_view`
- `cta_trial_click`
- `plans_view`
- `plan_select`
- `trial_form_view`
- `trial_form_start`
- `trial_form_submit`
- `trial_form_success`
- `trial_form_error`
- `whatsapp_click`
- `contact_click`
- `faq_open`
- `teacher_section_view`
- `testimonial_view`

Sem provider, a função é segura e não bloqueia o fluxo. Para integrar GA4, Plausible, PostHog ou outro serviço, implemente `AnalyticsProvider` e registre a instância na inicialização do cliente. A Política de Privacidade deve ser revisada antes de ativar qualquer provider.

## Variáveis de ambiente

| Variável                      | Uso                                                                                                             |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `VITE_PUBLIC_SITE_URL`        | Origem usada em canonical, sitemap lógico e dados estruturados.                                                 |
| `VITE_PUBLIC_CONTACT_EMAIL`   | E-mail exibido e usado nos links públicos. O fallback atual mantém compatibilidade com a configuração anterior. |
| `VITE_PUBLIC_WHATSAPP_NUMBER` | Número com DDI/DDD para abrir a conversa; quando vazio, o formulário envia por e-mail.                          |
| `VITE_LEADS_DATA_SOURCE`      | `mock` salva o lead no navegador; `api` envia para `/api/leads`.                                                |
| `VITE_API_BASE_URL`           | Prefixo da API consumida pelo frontend.                                                                         |
| `RESEND_API_KEY`              | Credencial secreta do Resend, somente no servidor.                                                              |
| `RESEND_FROM_EMAIL`           | Remetente verificado.                                                                                           |
| `RESEND_TO_EMAIL`             | Caixa que recebe os leads.                                                                                      |

## Conteúdo pendente de validação humana

- Substituir o perfil explicitamente marcado como editável em `src/config/site.ts` por nome, foto, experiência e especializações comprováveis do professor.
- Coletar autorização e conteúdo real dos alunos antes de preencher `testimonials`.
- Manter `VITE_PUBLIC_CONTACT_EMAIL` e `RESEND_TO_EMAIL` configurados como `somosnerya@gmail.com` no ambiente de produção.
- Confirmar regras comerciais de duração, remarcação e cancelamento; o FAQ atual orienta o visitante a validar essas condições no atendimento.
- Definir prazo interno de retenção dos e-mails de leads e atualizar a política quando houver decisão operacional.

## Limitações e riscos conhecidos

- A área de aluno e os dados de planos continuam mock-first; não há banco novo nesta fase.
- A entrega real de leads depende da configuração do Resend no ambiente de produção.
- A medição do funil não sai do site até que um provider seja escolhido e configurado.
- O sitemap usa a origem oficial `https://nerya.online`; uma mudança de domínio exige atualização do arquivo estático e de `VITE_PUBLIC_SITE_URL`.
- O lint global já possuía centenas de divergências de Prettier/line endings antes da P0. Os arquivos tocados nesta fase devem permanecer formatados, mas a correção em massa do repositório não faz parte desta entrega.

## Recomendações para P1

- Publicar dados reais e autorizados do professor e dos alunos.
- Escolher um provider de analytics, mapear consentimento quando necessário e validar os eventos em produção.
- Definir termos comerciais completos e processo de cancelamento/remarcação.
- Evoluir os repositórios mock para APIs persistentes somente quando houver requisitos de produto e segurança definidos.
- Avaliar teste de nível, calendário e área de membros como iniciativas separadas, sem misturá-las à fundação pública.
