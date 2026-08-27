# Projeto Ambar

E-commerce estatico com recurso discreto de contato com a Central de Atendimento a Mulher.

## Cloudflare Pages

- Comando de build: deixe vazio
- Diretorio de saida: `public`
- Diretorio raiz: `/`

Para publicar com Wrangler:

```sh
npx wrangler pages deploy public --project-name projeto-ambar
```

## Pedidos de ajuda

O envio de localizacao usa uma Cloudflare Pages Function e um banco D1.

1. Crie um banco D1 no Cloudflare.
2. Aplique `migrations/0001_help_requests.sql` no banco.
3. Vincule o banco ao projeto Pages usando o nome de binding `DB`.
4. Crie o secret `ADMIN_TOKEN` com um valor longo e aleatorio.
5. Acesse `/admin.html` e informe esse token para gerenciar os pedidos.
