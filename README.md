# 🎬 Velum — Plataforma de Streaming

**Velum** é uma plataforma de streaming de vídeos construída com Next.js 15, com autenticação JWT, painel administrativo e reprodução de episódios via Google Drive.

---

## ✨ Funcionalidades

- **Autenticação segura** — login com JWT (jose) e senhas com bcrypt
- **Catálogo de títulos** — listagem e busca de séries/filmes
- **Player de episódios** — reprodução integrada via Google Drive
- **Seleção de temporadas** — navegação entre temporadas e episódios
- **Pesquisa** — busca de títulos no catálogo
- **Painel admin** — gerenciamento de títulos e episódios
- **Perfil de usuário** — configurações de conta
- **Tema claro/escuro** — toggle de tema persistido

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 + React 19 |
| Linguagem | TypeScript |
| Banco de dados | Supabase (PostgreSQL) |
| Autenticação | JWT (jose) + bcryptjs |
| Estilização | Tailwind CSS v4 |
| Player | Google Drive Embed |
| Hospedagem | Vercel |

---

## 📁 Estrutura do Projeto

```
app/
├── home/             # Página inicial com destaques
├── catalogo/         # Catálogo completo de títulos
├── titulo/[id]/      # Página de um título (temporadas + episódios)
├── episodio/[id]/    # Player do episódio
├── pesquisar/        # Busca no catálogo
├── perfil/           # Perfil do usuário
├── configuracoes/    # Configurações de conta
├── admin/            # Painel administrativo
└── login/            # Autenticação
components/
├── Navbar / Sidebar  # Navegação
├── TitleCard / TitleRow  # Cards de título
├── EpisodeCard       # Card de episódio
├── SeasonSelect      # Seletor de temporada
├── VideoPlayerr      # Player de vídeo
└── DrivePlayer       # Integração Google Drive
lib/
├── auth.ts           # Lógica de autenticação JWT
└── supabase.ts       # Cliente Supabase
```

---

## 📚 Aprendizados

- Implementar autenticação stateless do zero com **JWT (jose)** e **bcryptjs**, sem depender de bibliotecas como NextAuth — gerenciando cookies HttpOnly e verificação de token em middleware
- Integrar o **Google Drive como CDN de vídeo**, descobrindo como construir a URL de embed correta e lidar com restrições de iframe
- Trabalhar com **Supabase** para armazenar catálogo, episódios e usuários, aproveitando as Row Level Security policies para proteger dados por usuário
- Construir um painel admin funcional que permite gerenciar títulos e episódios sem ferramentas externas de CMS

---

## 👤 Autor

**Paulo Otávio Câmara Rojas**  
[GitHub](https://github.com/PauloRojas18) • [LinkedIn](https://linkedin.com/in/paulo-rojas-b7b77a3a1/) • paulootaviogalala@gmail.com
