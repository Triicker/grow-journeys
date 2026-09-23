# Nerya Visual System — Nerya Night

## Conceito

Nerya Night evolui a identidade existente sem redesenhá-la. A base continua dark editorial, com a
tipografia, o azul institucional, o conteúdo e a hierarquia originais. A camada nova acrescenta
profundidade atmosférica, resposta às interações e dois acentos frios discretos.

Princípios:

- premium, noturno, tecnológico e educacional;
- conteúdo e conversão sempre acima da decoração;
- luz localizada, nunca neon em toda a borda;
- movimento curto e funcional;
- experiência completa sem hover e com movimento reduzido;
- nenhuma dependência de animação, canvas, WebGL ou imagem pesada.

## Paleta

Os tokens ficam em `src/styles.css` e são a única fonte para a linguagem visual.

| Token               | Valor     | Uso                         |
| ------------------- | --------- | --------------------------- |
| `--background`      | `#0B1018` | fundo principal             |
| `--background-soft` | `#111827` | seções alternadas           |
| `--surface`         | `#161E2D` | cards e superfícies         |
| `--surface-2`       | `#1B2438` | superfícies elevadas        |
| `--brand`           | `#536184` | azul institucional          |
| `--brand-light`     | `#7C89AA` | texto e detalhes da marca   |
| `--neon-blue`       | `#6B8CFF` | luz elétrica localizada     |
| `--neon-violet`     | `#8B75D6` | contraponto frio localizado |

Azul elétrico e violeta frio são acentos, não substitutos da marca. Verde permanece restrito ao
WhatsApp por reconhecimento funcional.

## Superfícies, glows e sombras

- `--glow-blue-soft` e `--glow-violet-soft`: iluminação ambiente de baixa opacidade.
- `--glow-blue-medium`: feedback de hover, foco e CTA.
- `--shadow-surface`: separação neutra entre planos.
- `--shadow-glow`: profundidade colorida discreta.
- `.surface-premium`: superfície translúcida com highlight localizado e blur moderado.
- `.glow-card`: elevação curta, borda refinada e sombra suave.
- `.spotlight-card`: adiciona um radial gradient interno controlado por CSS variables.

Não aplicar blur ou box-shadow animado em grandes listas. Cards densos de formulário devem priorizar
contraste e foco.

## Background e gradients

`.nerya-night` delimita o sistema às páginas públicas. O `main` combina duas luzes radiais e um grid
de 56 px com opacidade quase imperceptível. No mobile, o grid fica mais espaçado e os halos perdem
intensidade.

`.hero-night` posiciona luz azul atrás da mensagem principal e luz violeta atrás do card. As classes
`.hero-word` e `.hero-word-violet` destacam somente “conecta” e “transforma”, sem aplicar glow ao
título inteiro.

## Bordas

A borda padrão continua sendo `--border`. Cards premium recebem um gradiente de 1 px apenas como
reflexo localizado. Não utilizar RGB border, borda pulsante ou neon fechado ao redor de todos os
componentes.

## Motion

| Token             |                          Duração | Uso                           |
| ----------------- | -------------------------------: | ----------------------------- |
| `--motion-fast`   |                          `150ms` | ícones e feedback imediato    |
| `--motion-normal` |                          `250ms` | botões, links, cards e bordas |
| `--motion-slow`   |                          `450ms` | entrada discreta de seções    |
| `--ease-nerya`    | `cubic-bezier(0.22, 1, 0.36, 1)` | easing compartilhado          |

`ScrollRevealObserver` usa um único `IntersectionObserver`. A entrada é limitada a `12px`, acontece
uma vez e não exige biblioteca. Não usar animações infinitas decorativas.

## Hover e foco

- `.cta-primary`: sobe 2 px, aumenta o brilho e move o ícone 3 px.
- `.cta-secondary`: clareia borda e superfície sem competir com o CTA principal.
- `.glow-card` e `.spotlight-card`: sobem no máximo 3 px.
- `.nav-link-night`: underline animado por `scaleX`, com glow mínimo.
- `.neon-badge`: pequena mudança de borda e sombra.
- inputs, textareas e selects: ring azul visível e sombra localizada.

Todo feedback de hover fica dentro de `@media (hover: hover) and (pointer: fine)` quando envolve
movimento decorativo. O estado `focus-visible` permanece explícito e com contraste.

## Spotlight

`SpotlightCard` atualiza `--spotlight-x` e `--spotlight-y` diretamente no elemento, sem provocar
renderizações React a cada movimento. O efeito responde apenas a mouse, fica restrito ao card e é
ignorado em `prefers-reduced-motion`.

## Acessibilidade

- `prefers-reduced-motion: reduce` reduz transições para quase zero e remove deslocamentos e spotlight.
- foco nunca depende apenas de glow; há outline/ring visível.
- texto pequeno não recebe text-shadow.
- os acentos mantêm contraste sobre as superfícies escuras.
- touch não depende de hover para comunicar hierarquia ou estado.

## Performance

- efeitos feitos com CSS, pseudo-elementos, opacity e transform;
- um único observer para entradas de seção;
- nenhuma biblioteca, imagem ou listener global novo;
- spotlight escreve CSS variables no próprio elemento e não usa estado React;
- blur fica limitado a poucas superfícies e é reduzido no mobile;
- propriedades animadas priorizam transform e opacity.

## Regras para futuras alterações

1. Reutilizar tokens antes de criar uma nova cor ou duração.
2. Reservar azul elétrico e violeta para hierarquia e resposta.
3. Não combinar mais cores neon.
4. Não adicionar glow em parágrafos, labels ou texto auxiliar.
5. Não aplicar spotlight em listas extensas.
6. Manter elevação máxima de 3 px nos cards e 2 px nos botões.
7. Validar desktop, touch e movimento reduzido antes de publicar.
