import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { trackEvent } from "@/lib/analytics";

const FAQ_ITEMS = [
  {
    question: "Como funcionam as aulas?",
    answer:
      "As aulas são individuais, ao vivo e online. O professor combina o foco de cada encontro com você e ajusta a prática conforme seus objetivos e sua evolução.",
  },
  {
    question: "Preciso saber inglês antes de começar?",
    answer:
      "Não. A Nerya atende iniciantes e adapta a linguagem, o ritmo e os exercícios ao ponto de partida de cada aluno.",
  },
  {
    question: "As aulas são individuais?",
    answer:
      "Sim. O formato atual é de aula particular, com atenção integral ao seu objetivo, dúvidas e tempo de prática.",
  },
  {
    question: "Quem será meu professor?",
    answer:
      "Você é acompanhado pelo professor qualificado ao longo do processo, o que ajuda a manter continuidade nos objetivos, no feedback e na evolução das aulas.",
  },
  {
    question: "Como funciona a aula experimental?",
    answer:
      "Você envia seus dados e objetivo pelo formulário. A Nerya entra em contato para combinar o horário e explicar como a aula individual funciona. A aula experimental é gratuita.",
  },
  {
    question: "Quanto tempo dura cada aula?",
    answer:
      "A duração é confirmada no atendimento antes da contratação, de acordo com o formato disponível para o plano escolhido.",
  },
  {
    question: "Posso remarcar?",
    answer:
      "As condições e a antecedência necessária para remarcação são informadas no atendimento e na contratação do plano.",
  },
  {
    question: "As aulas acontecem por onde?",
    answer:
      "As aulas são online. A plataforma de videochamada utilizada é confirmada diretamente com o aluno.",
  },
  {
    question: "Existe material de apoio?",
    answer:
      "O professor pode indicar materiais e atividades de acordo com o objetivo da aula. O formato exato é alinhado durante o acompanhamento.",
  },
  {
    question: "Como funcionam os planos?",
    answer:
      "Os planos organizam a frequência semanal e a quantidade mensal de aulas. Valores e condições atuais aparecem na página de planos e são confirmados no atendimento.",
  },
  {
    question: "Posso cancelar?",
    answer:
      "As condições de cancelamento são apresentadas antes da contratação. Tire suas dúvidas no atendimento para confirmar a regra aplicável ao plano.",
  },
  {
    question: "A Nerya atende iniciantes?",
    answer:
      "Sim. O plano de aula pode começar do nível básico, com explicações e prática progressiva para construir segurança.",
  },
  {
    question: "Posso estudar para entrevistas ou viagens?",
    answer:
      "Sim. Entrevistas, reuniões, viagens e outras situações específicas podem orientar vocabulário, simulações e prática de conversação.",
  },
] as const;

export function FaqSection() {
  return (
    <section id="faq" className="night-section border-y border-border" data-reveal>
      <div className="container-page grid gap-10 py-20 md:grid-cols-[0.7fr_1.3fr] md:gap-16 md:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">
            Perguntas frequentes
          </p>
          <h2 className="mt-3 text-foreground">Tudo o que você precisa saber antes de começar.</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Se sua dúvida não estiver aqui, fale diretamente com a Nerya.
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          className="surface-premium rounded-xl border border-border px-5"
          onValueChange={(value) => {
            if (value) trackEvent("faq_open", { question_id: value });
          }}
        >
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index + 1}`}>
              <AccordionTrigger className="py-5 text-left text-base text-foreground hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="max-w-2xl pb-5 leading-relaxed text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
