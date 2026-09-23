import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Nerya" },
      {
        name: "description",
        content:
          "Entenda quais dados a Nerya coleta, para que são usados e como exercer seus direitos de privacidade.",
      },
      { property: "og:title", content: "Política de Privacidade — Nerya" },
      { property: "og:url", content: `${siteConfig.url}/privacidade` },
    ],
    links: [{ rel: "canonical", href: `${siteConfig.url}/privacidade` }],
  }),
  component: PrivacyPolicy,
});

const sections = [
  {
    title: "1. Quais dados são coletados",
    content: (
      <>
        <p>
          Nos formulários de contato e aula experimental, podemos receber nome, e-mail, número de
          WhatsApp, mensagem, objetivo informado, página de origem e data do envio. O servidor usa o
          endereço IP temporariamente para limitar tentativas repetidas e reduzir spam.
        </p>
        <p>
          A área demonstrativa do site também pode guardar sessão, preferências e dados simulados no
          armazenamento local do navegador. Esses dados não representam uma matrícula real.
        </p>
        <p>
          O English Check guarda temporariamente, na sessão do navegador, o objetivo, a percepção de
          nível, as respostas e o resultado. As respostas individuais não são enviadas para
          analytics nem persistidas no servidor. Se você solicitar contato ou envio do resultado,
          apenas objetivo, níveis e dados informados no formulário acompanham o lead.
        </p>
      </>
    ),
  },
  {
    title: "2. Para que os dados são usados",
    content: (
      <p>
        As informações dos formulários são usadas para responder dúvidas, organizar o contato sobre
        aulas, enviar uma confirmação do pedido e proteger o formulário contra abuso. Não usamos os
        dados para criar estatísticas públicas ou promessas comerciais sem base real.
      </p>
    ),
  },
  {
    title: "3. Envio, armazenamento e fornecedores",
    content: (
      <>
        <p>
          Quando o envio real está habilitado, os dados são transmitidos ao servidor da Nerya e ao
          serviço de e-mail Resend para entregar a mensagem à equipe e a confirmação ao visitante.
          Se você escolher continuar pelo WhatsApp, a mensagem preparada é aberta nesse serviço, e o
          envio final depende da sua ação.
        </p>
        <p>
          Em modo de demonstração, o pedido pode ficar somente no armazenamento local do dispositivo
          até que os dados do site sejam apagados no navegador. Mensagens recebidas por e-mail são
          mantidas pelo período necessário ao atendimento e às obrigações aplicáveis. Você pode
          pedir informações ou exclusão pelo canal abaixo; a possibilidade de exclusão será avaliada
          conforme as hipóteses legais de conservação.
        </p>
      </>
    ),
  },
  {
    title: "4. Analytics e cookies",
    content: (
      <p>
        O site possui uma camada interna de eventos para medir visualizações e etapas do funil, mas
        nenhum provedor externo de analytics está configurado nesta versão. A Nerya não instala
        cookies próprios de publicidade. Serviços de infraestrutura ou links externos podem aplicar
        suas próprias tecnologias conforme as respectivas políticas. Esta seção deve ser atualizada
        antes de ativar GA4, Plausible, PostHog ou ferramenta equivalente.
      </p>
    ),
  },
  {
    title: "5. Seus direitos",
    content: (
      <p>
        Você pode solicitar confirmação de tratamento, acesso, correção e, quando aplicável,
        anonimização, bloqueio, eliminação ou informações sobre compartilhamento. Também pode
        apresentar outras solicitações previstas na LGPD. Para entender os direitos e limites de
        cada pedido, consulte a orientação oficial da Autoridade Nacional de Proteção de Dados
        (ANPD).
      </p>
    ),
  },
  {
    title: "6. Contato e atualizações",
    content: (
      <p>
        Para dúvidas ou solicitações sobre dados pessoais, escreva para o endereço abaixo. Esta
        política pode ser atualizada quando o funcionamento do site, os fornecedores ou as práticas
        de dados mudarem. Última atualização: 23 de setembro de 2026.
      </p>
    ),
  },
] as const;

function PrivacyPolicy() {
  return (
    <PublicLayout>
      <article className="container-page max-w-4xl py-16 md:py-24">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
          Privacidade e LGPD
        </p>
        <h1 className="mt-3 text-foreground">Política de Privacidade</h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground">
          Esta página descreve, de forma transparente, o tratamento de dados realizado pela versão
          atual do site da Nerya. Ela evita afirmar práticas ou garantias que o sistema não possui.
        </p>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {sections.map((section) => (
            <section key={section.title} className="py-8">
              <h2 className="text-2xl text-foreground">{section.title}</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-3 text-sm">
          <a
            href={`mailto:${siteConfig.contact.email}?subject=Privacidade%20e%20dados%20pessoais`}
            onClick={() => trackEvent("contact_click", { location: "privacy_page" })}
            className="font-medium text-brand-light hover:underline"
          >
            {siteConfig.contact.email}
          </a>
          <a
            href="https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados-1/direito-dos-titulares"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Direitos dos titulares — orientação oficial da ANPD
          </a>
        </div>
      </article>
    </PublicLayout>
  );
}
