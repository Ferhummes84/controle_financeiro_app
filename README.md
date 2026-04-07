# 📊 Controle Financeiro App

Um painel de inteligência financeira automatizado. Este projeto substitui o preenchimento manual de planilhas por uma arquitetura moderna onde lançamentos de gastos e entradas são feitos enviando mensagens simples via Telegram, processados por uma automação (n8n) e exibidos em um Dashboard responsivo em tempo real.

---

## 🚀 Arquitetura do Sistema

O projeto é dividido em uma arquitetura moderna e escalável, preparando o terreno para conteinerização total em VPS:

1. **Mensageria & Automação:** O usuário envia comandos curtos no Telegram (ex: `Mercado 120,50 Compras do mês`). O **n8n** captura, usa expressões regulares (Regex) para classificar os dados e dispara um Webhook.
2. **Backend (API REST):** Uma API em **Node.js/Express** recebe o Webhook, valida os dados e persiste as informações.
3. **Banco de Dados:** **PostgreSQL** rodando isoladamente em um contêiner Docker.
4. **Frontend (Dashboard):** Uma interface em **React (Vite)** com design em *Glassmorphism* consome a API e renderiza gráficos, comparativos mensais e limites de gastos de forma dinâmica.

---

## 🛠️ Tecnologias Utilizadas

**Frontend:**
* React (Vite)
* TypeScript
* Tailwind CSS v3
* Recharts (Gráficos analíticos)
* Lucide React (Ícones)

**Backend & Infraestrutura:**
* Node.js & Express
* PostgreSQL (Banco de Dados Relacional)
* Docker & Docker Compose
* n8n (Orquestração e Integração de Webhooks)

---

## ⚙️ Como Executar Localmente

### 1. Pré-requisitos
* Node.js (v18+)
* Docker e Docker Compose instalados.

### 2. Subindo o Banco de Dados
Acesse a pasta do backend e inicie o contêiner do PostgreSQL:
```bash
cd backend-financeiro
docker compose up -d
