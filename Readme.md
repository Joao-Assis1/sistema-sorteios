# 🎟️ Sistema de Sorteios & Assinaturas (SaaS)

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Vue.js](https://img.shields.io/badge/vue-3.x-green.svg)
![Tailwind](https://img.shields.io/badge/style-tailwind-38bdf8.svg)
![Node.js](https://img.shields.io/badge/node-18.x-green.svg)

> **Plataforma Full Stack para gestão de assinaturas e sorteios automatizados.**

Este projeto é um Monorepo containerizado que gerencia um clube de assinaturas. Usuários ativos concorrem automaticamente a prêmios diários. O sistema conta com integração via Webhooks de pagamento, painel administrativo seguro e interface pública responsiva.

---

## 📸 Showcase

|             Landing Page Pública             |                   Painel Administrativo                    |
| :------------------------------------------: | :--------------------------------------------------------: |
| ![Home Screen](.github\screenshots\Home.png) | ![Admin Dashboard](.github\screenshots\AdminDashboard.png) |
|      _Consulta de Status e Ganhadores_       |              _Gestão de Sorteios e Auditoria_              |

---

## 🏗️ Arquitetura

O sistema opera em containers Docker, garantindo isolamento e fácil deploy.

```mermaid
graph TD
    subgraph External [Mundo Externo]
        UserClient((👤 Cliente))
        AdminUser((🛡️ Admin))
        PaymentGateway((💰 Lastlink/Make))
    end

    subgraph Docker [Infraestrutura Docker]
        Frontend[📱 Vue 3 + Tailwind (Vite)]
        Backend[⚙️ Node.js API]
        DB[(🗄️ PostgreSQL)]
    end

    UserClient -->|Consulta Status| Frontend
    AdminUser -->|Realiza Sorteio| Frontend
    PaymentGateway -->|Webhook de Pagamento| Backend
    Frontend -->|HTTP Requests| Backend
    Backend -->|Persistência| DB

⚡ Tech Stack
Frontend (Client)
Framework: Vue.js 3 (Composition API + Script Setup)

Estilização: Tailwind CSS (Design System "Forest Green")

Build Tool: Vite

Feedback: SweetAlert2

HTTP Client: Axios

Backend (Server)
Runtime: Node.js

Framework: Express.js

Banco de Dados: PostgreSQL

Segurança: JWT Auth & Webhook Signature Verification (crypto)

Integração: Webhook Receiver (Lastlink/Hotmart compatible)

🚀 Como Rodar Localmente

Pré-requisitos
Docker & Docker Compose instalados.

1. Clonar e Configurar

git clone [https://github.com/seu-usuario/sistema-sorteios.git](https://github.com/seu-usuario/sistema-sorteios.git)
cd sistema-sorteios

2. Acessar

   Frontend (Público & Admin): http://localhost:5173

   API (Backend): http://localhost:3000

🌟 Funcionalidades Principais

🔓 Área Pública

Verificação de Status: Usuário digita o e-mail e verifica se a assinatura está ativa (Integrado ao DB).

Galeria de Ganhadores: Exibição automática dos últimos sorteados.

CTA de Vendas: Link direto para o checkout da assinatura.

🔒 Painel Administrativo

Login Seguro: Autenticação via Token JWT.

Sorteio Manual Auditável: Algoritmo que seleciona aleatoriamente um assinante active do banco de dados.

Auditoria: Histórico completo de sorteios com opção de mascarar dados sensíveis (LGPD Friendly).

Gestão de Participantes: Adição manual de participantes para testes ou cortesias.

🤖 Automação (Webhooks)

O sistema possui um endpoint /webhooks/lastlink preparado para receber notificações de pagamento.

Lógica: Pagamento Aprovado (paid) -> Cria usuário ou Renova assinatura por 365 dias automaticamente.
```
