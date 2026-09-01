# 🎬 CineInfo - React Frontend

> Uma aplicação moderna de catálogo de filmes e séries, desenvolvida para explorar e gerenciar os títulos favoritos do universo cinematográfico, com dados providos em tempo real pela API do TMDB.

## 📌 Sobre o Projeto

O **CineInfo** é um projeto front-end desenvolvido com o objetivo de demonstrar proficiência no ecossistema moderno do React. O foco principal foi criar uma interface rica, responsiva e performática, aplicando as melhores práticas de desenvolvimento web, componentização e gerenciamento de estado.

A aplicação consome a [The Movie Database (TMDB) API](https://www.themoviedb.org/) para buscar dados atualizados de filmes, séries e pessoas, além de apresentar destaques e resultados de busca com uma experiência de usuário (UX) fluida e atraente.

## ✨ Principais Funcionalidades

- **Busca em Tempo Real:** Pesquisa inteligente e debounced por filmes, séries ou personalidades.
- **Destaque (Hero Section):** Exibição dinâmica de um filme/série em destaque com informações detalhadas e integração visual (backdrop).
- **Gerenciamento de Favoritos:** Sistema de favoritar títulos integrado à aplicação, utilizando `Context API` para gerenciar estado globalmente e permitir acesso fácil em qualquer página.
- **Área Restrita (Admin):** Painel administrativo que permite visualizar o catálogo e realizar edições personalizadas nos dados dos filmes (título, sinopse, avaliação e adição de resenha da equipe), simulando um CMS (Content Management System) com persistência local.
- **Painel de Sugestões de Resenhas:** Interface interativa para os usuários sugerirem análises e críticas.
- **Navegação Dinâmica:** Roteamento de páginas fluido utilizando o `react-router-dom`.
- **Feedback Visual Avançado:** Micro-interações, efeitos de *hover*, esqueletos de carregamento (Skeleton Loaders) e tratamento de erros de API elegantes.

## 🛠️ Tecnologias e Ferramentas Utilizadas

Este projeto foi construído utilizando as ferramentas mais modernas do mercado:

- **React 19:** Biblioteca principal, utilizando hooks (`useState`, `useEffect`, `useContext`) para lógica e ciclo de vida.
- **Vite:** Build tool ultrarrápido para desenvolvimento e empacotamento da aplicação.
- **Tailwind CSS v4:** Framework utilitário para estilização rápida, responsiva e consistente. Configurado com variáveis CSS nativas.
- **React Router v7:** Gerenciamento de rotas e navegação client-side.
- **Lucide React:** Biblioteca de ícones elegantes e personalizáveis.
- **ESLint:** Linter para garantir a qualidade e a padronização do código.

## 🧠 Arquitetura e Conceitos Aplicados

Durante o desenvolvimento deste projeto, foquei em aplicar conceitos de engenharia de software para Front-End que garantem manutenibilidade e escalabilidade:

1. **Componentização Reutilizável:** Criação de componentes UI modulares (como `MovieCard`, `SearchBar`, `Layout`) que possuem responsabilidade única.
2. **Gerenciamento de Estado Global:** Utilização nativa da `Context API` (ex: `AuthContext`, `FavoritesContext`) para evitar o *prop drilling* excessivo e centralizar as lógicas de negócio cruciais.
3. **Consumo de APIs Externas:** Integração robusta com `fetch`, utilizando técnicas de tratamento de erros, estados de `loading` (exibição de esqueletos) e gerenciamento de variáveis de ambiente.
4. **Design Responsivo e Acessibilidade:** Uso do poder do Tailwind para criar um layout que se adapta perfeitamente a dispositivos móveis, tablets e telas grandes.
5. **Clean Code e Organização de Pastas:** Estrutura clara separando `components`, `pages`, `context` e `utils`, facilitando a navegação de qualquer desenvolvedor pelo repositório.

## 🚀 Como Executar o Projeto

Siga as instruções abaixo para rodar o projeto localmente na sua máquina:

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/cineinfo-react-frontend.git
cd cineinfo-react-frontend
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto (baseando-se no `.env.example`) com suas credenciais do TMDB (elas são protegidas via Backend Proxy e não vazam no cliente):
```env
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_ACCESS_TOKEN=seu_token_de_leitura_aqui
```

### 4. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

Desenvolvido com dedicação por Brenda Jacques. Sinta-se à vontade para explorar o código, avaliar a arquitetura e entrar em contato!
