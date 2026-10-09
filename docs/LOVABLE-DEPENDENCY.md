# Dependência de build do Lovable

## Estado atual

O projeto ainda usa `@lovable.dev/vite-tanstack-config` como dependência de desenvolvimento. Ela
compõe a configuração do Vite, TanStack Start, React, Tailwind, aliases TypeScript e o preset do
Nitro. Os pacotes `vite-plugin-dev-server-bridge` e `vite-plugin-hmr-gate` aparecem nos lockfiles
como dependências transitivas desse pacote.

Essas referências são internas ao toolchain e não fazem parte dos metadados, ícones ou imagens
públicas da Nerya. A dependência foi mantida para não comprometer o build SSR, as rotas de API nem a
sincronização do projeto conectado.

## Migração necessária para desvinculação total

Uma remoção segura exige substituir explicitamente a configuração agregada por plugins compatíveis
para TanStack Start, React, Tailwind, resolução de caminhos, injeção de variáveis e Nitro. Depois da
troca, é necessário validar pelo menos:

- build com preset `node-server`;
- inicialização pelo arquivo `.output/server/index.mjs` no Render;
- SSR de todas as rotas públicas;
- endpoints `/api/health` e `/api/leads`;
- HMR e ambiente de desenvolvimento;
- suíte de tipos e testes.

Até essa migração ser feita e validada separadamente, `@lovable.dev/vite-tanstack-config`, suas
dependências transitivas, as entradas correspondentes dos lockfiles e as exceções de instalação do
`bunfig.toml` devem permanecer.
