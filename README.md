# PlayLivre

Catálogo de jogos gratuitos que traduz os dados públicos da FreeToGame API em uma interface simples para pesquisa e descoberta.

## Tecnologias

- HTML, CSS e JavaScript
- [FreeToGame API](https://www.freetogame.com/api-doc), consumida com Fetch API
- [Chart.js](https://www.chartjs.org/) (MIT), para o gráfico de gêneros
- Vite, para desenvolvimento e empacotamento

## Executar localmente

```bash
npm install
npm run dev
```

## Publicação no GitHub Pages

O workflow em `.github/workflows/deploy-pages.yml` publica automaticamente a pasta gerada em `dist` após cada envio à branch `main`.

No GitHub, abra **Settings → Pages**, em **Build and deployment**, selecione **GitHub Actions** como fonte. Em seguida, envie o projeto para a branch `main` e acompanhe a execução na aba **Actions**. Ao concluir, o GitHub exibirá o endereço público do site.

## Créditos

- Dados, capas e links dos jogos: FreeToGame API. Consulte os termos de uso do provedor.
- Fonte DM Sans: SIL Open Font License 1.1, servida pelo Google Fonts.
- Chart.js: licença MIT.
- Ícones: caracteres Unicode, sem arquivos de mídia externos.
