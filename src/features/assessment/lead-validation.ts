import { z } from "zod";

export const leadFormSchema = z.object({
  fullName: z.string().trim().min(2, "Informe seu nome."),
  email: z.string().trim().email("Informe um e-mail válido."),
  whatsapp: z.string().trim().min(10, "Informe seu WhatsApp com DDD."),
  goal: z.string().min(1, "Escolha seu objetivo com o inglês."),
  perceivedLevel: z.string().min(1, "Escolha como você percebe seu nível."),
  message: z.string().max(2000, "A mensagem deve ter até 2.000 caracteres.").optional(),
});
