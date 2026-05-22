# Studio Cedro Marcenaria

Projeto React + Vite do site institucional da Studio Cedro Marcenaria.

## Scripts

```bash
npm run dev
npm run build
npm run build:vercel
npm run build:pages
npm run build:docs
npm run verify
npm run verify:pages
npm run verify:docs
```

`npm run build` gera `dist/` com base `/`, pronto para Vercel.

`npm run build:pages` gera `dist/` em modo GitHub Pages, com base calculada pelo Vite.

## Deploy

Vercel:

- Framework: Vite
- Build command: `npm run build:vercel`
- Output directory: `dist`

GitHub Pages:

- O workflow `.github/workflows/deploy.yml` publica a branch `main` ou `master`.
- O workflow usa `npm run build:pages` e publica o diretorio `dist`.
- Se usar "Deploy from a branch", selecione `main` + `/docs`.
- Nao selecione `main` + `/root`, porque isso publica o HTML fonte do Vite e causa erro 404 em `/src/main.jsx`.
- As rotas internas usam fallback SPA para evitar erro 404 ao recarregar `/projetos` ou `/servicos`.

## Favicon

O favicon usa `public/favicon.png` e `public/favicon.ico`.
Os links no HTML incluem `?v=4` para forcar navegadores, Vercel e GitHub Pages a buscarem o arquivo atualizado apos deploy.

```bash
npm run build:vercel
npm run build:pages
npm run build:docs
npm run verify:pages
git add -A
git commit -m "Fix GitHub Pages build and favicon paths"
git push origin main
```
