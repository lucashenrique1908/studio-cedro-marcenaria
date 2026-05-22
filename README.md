# Studio Cedro Marcenaria

Projeto React + Vite do site institucional da Studio Cedro Marcenaria.

## Scripts

```bash
npm run dev
npm run build
npm run build:pages
npm run verify
npm run verify:pages
```

`npm run build` gera `dist/` com base `/`, pronto para Vercel.

`npm run build:pages` gera `dist/` em modo GitHub Pages, com base calculada pelo Vite.

## Deploy

Vercel:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

GitHub Pages:

- O workflow `.github/workflows/deploy.yml` usa `npm run build`; o Vite detecta o GitHub Actions e aplica a base do repositório.
- As rotas internas usam fallback SPA para evitar erro 404 ao recarregar `/projetos` ou `/servicos`.
