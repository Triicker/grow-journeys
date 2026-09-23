# P1 — English Check e agendamento público

## Resultado da fase

A P1 adiciona um diagnóstico anônimo de inglês, qualifica os leads públicos e prepara um fluxo de
agendamento sem conta. O produto continua visitante-first: nenhuma etapa exige login, cadastro,
crédito, matrícula ou acesso à área do aluno.

## English Check

- Rota pública `/nivel`, com SEO próprio, canonical e entrada no sitemap.
- Doze etapas: objetivo, autoavaliação e dez questões objetivas de vocabulário, gramática, leitura e contexto.
- Estimativa CEFR de A1 a C1 em 3–6 minutos, com aviso claro de que não é certificação oficial.
- Resultado imediato, sem e-mail: nível, descrição, pontos fortes, pontos a desenvolver e recomendação ligada ao objetivo.
- Envio do resultado por e-mail é opcional e aparece somente depois do resultado.
- O estado fica em `sessionStorage`, sobrevive ao refresh da aba e não cria banco nem perfil.
- Questões ficam em `src/features/assessment/questions.ts`; cálculo puro e determinístico em `scoring.ts`.
- A pontuação combina 85% de desempenho objetivo e 15% de autoavaliação. Faixas: A1 `0–24`, A2 `25–44`, B1 `45–64`, B2 `65–82`, C1 `83–100`.

## Leads e WhatsApp

O formulário agora coleta nome, e-mail, WhatsApp, objetivo, nível percebido e mensagem opcional. Os
valores de objetivo são Conversação, Trabalho, Entrevista, Viagem, Inglês geral,
Provas/certificações, Tecnologia e Outro. O nível percebido aceita Nunca estudei, Básico,
Intermediário, Avançado e Não sei.

Quando há uma sessão do English Check, objetivo, nível percebido e nível estimado são preenchidos ou
anexados ao lead. Esses campos percorrem frontend, serviço, API e e-mails. A mensagem preparada para
WhatsApp inclui a qualificação de forma compacta. Respostas individuais nunca são enviadas.

Após o envio de uma solicitação de aula, o visitante escolhe entre consultar horários ou continuar
pelo WhatsApp. O envio duplo é bloqueado e erros de campo, rede e provedor têm estados visíveis.

## Agendamento público

`src/features/booking/provider.ts` define `BookingProvider`, independente do calendário interno da
área do aluno. O adaptador padrão declara indisponibilidade e retorna zero datas: não há slots nem
confirmações simuladas. Nesse estado, `/agendar/horario` explica a limitação e oferece o fallback de
WhatsApp. O fuso explícito é `America/Bahia`.

O contrato suporta datas, horários e confirmação quando um provedor real for registrado. Somente
uma confirmação real leva a `/agendar/confirmado`, que oferece link para Google Calendar e arquivo
`.ics`, sem login. As rotas transacionais têm `noindex`.

## Analytics e privacidade

Eventos adicionados:

- `english_check_view`, `assessment_start`, `assessment_answer`, `assessment_complete`, `assessment_result_view`, `assessment_trial_click`, `assessment_email_result_click`;
- `booking_start`, `booking_date_select`, `booking_time_select`, `booking_submit`, `booking_success`, `booking_error`, `booking_whatsapp_fallback`.

As propriedades contêm apenas dados de funil, categoria, objetivo ou nível. Não enviam nome, e-mail,
WhatsApp, texto livre nem resposta marcada. A Política de Privacidade documenta o armazenamento da
sessão e a persistência apenas na conversão em lead.

## UX, acessibilidade e mobile

- Progresso, navegação anterior/próxima e controles de rádio com `fieldset`/`legend`.
- Foco nativo, rótulos, mensagens com `role=status`/`role=alert`, botões com estado de carregamento e prevenção de reenvio.
- Grids responsivos e alvos de toque adequados para o fluxo em telas pequenas.
- Rotas file-based são divididas pelo mecanismo do TanStack Router; os módulos de domínio ficam isolados da home.

## Testes e validação

Testes automatizados cobrem limites A1–C1, determinismo, recomendações, validação do lead, geração
de link de calendário, serviço de leads, backend, analytics e regras de agenda existentes.

Comandos de verificação:

```bash
npm test -- --run
npm run typecheck
npm run build
```

## Pendências e riscos

- Registrar um `BookingProvider` real e validar disponibilidade, concorrência, cancelamento e confirmação no servidor.
- Configurar `VITE_PUBLIC_WHATSAPP_NUMBER` para habilitar o fallback de WhatsApp.
- Configurar Resend no ambiente para entrega real de leads e resultados por e-mail.
- Submeter questões, pesos e faixas a revisão pedagógica; o MVP é orientativo.
- Escolher um provedor de analytics e revisar consentimento antes de ativá-lo.
- Testar o fluxo visual em navegadores reais e tecnologias assistivas antes do deploy.

## Critérios de aceite atendidos

1. Fluxo integral sem autenticação.
2. Formulário qualificado com mensagem opcional.
3. Dez questões objetivas e duas etapas de contexto, dentro do intervalo pedido.
4. Resultado A1–C1 antes de qualquer solicitação de e-mail.
5. Banco de questões separado da UI.
6. Cálculo determinístico e testável.
7. Resultado com forças, melhorias, objetivo e recomendação.
8. CTA para aula experimental.
9. Reuso da sessão no lead sem query string.
10. Envio opcional do resultado por e-mail.
11. Escolha entre agenda e WhatsApp depois do formulário.
12. Abstração pública de provedor de agenda.
13. Ausência de reserva simulada quando não há integração.
14. Fuso `America/Bahia` explícito.
15. Confirmação sem login, Google Calendar e `.ics` preparados.
16. WhatsApp com nível e objetivo.
17. Analytics sem PII, texto livre ou respostas individuais.
18. CTA e seção do English Check na home.
19. SEO, sitemap, acessibilidade e responsividade contemplados.
20. Documentação de operação, limitações e próximos passos.
