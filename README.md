# Bio Factor - Fitness Web App 💪🍎

> Projeto desenvolvido para a disciplina de Programação Orientada a Objetos 2 (POO2).

O **Bio Factor** é uma aplicação web completa voltada para o acompanhamento de saúde, dieta e treinos. O sistema funciona como um "coach virtual", permitindo que o usuário registre sua evolução, controle sua alimentação (macros) e gerencie suas rotinas de exercícios.

## 📋 Sobre o Projeto

O objetivo principal do sistema é auxiliar o usuário a alcançar metas de estética ou saúde através do monitoramento de dados. A aplicação permite:
- Cálculo automático de métricas corporais (IMC, TMB, GET).
- Registro diário de refeições e contagem de calorias/macros.
- Gerenciamento de rotinas de treino (aeróbico e musculação).
- Definição de metas e acompanhamento de progresso.

## 🚀 Tecnologias Utilizadas

### Backend (API REST)
- **Linguagem:** Java 17+
- **Framework:** Spring Boot 4
- **Banco de Dados:** PostgreSQL
- **ORM:** Spring Data JPA
- **Gerenciador de Dependências:** Maven
- **Arquitetura:** MVC (Model-View-Controller) / Camadas

### Frontend (SPA)
- **Framework:** React
- **Linguagem:** TypeScript
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS
- **Componentes:** Shadcn/ui
- **Gerenciador de Pacotes:** NPM / Bun

## ⚙️ Funcionalidades

- **Autenticação de Usuário:** Cadastro e login.
- **Perfil Biométrico:** Registro de peso, altura, idade e nível de atividade.
- **Diário Alimentar:** Adição de refeições (café, almoço, janta) e alimentos com cálculo automático de Proteínas, Carbos e Gorduras.
- **Gestão de Treinos:** Criação de rotinas personalizadas com exercícios específicos (séries, repetições, carga).
- **Dashboard:** Visualização rápida do resumo do dia e evolução.
- **Histórico de Peso:** Gráfico de evolução corporal.

## 🔧 Como Rodar o Projeto

### Pré-requisitos
Certifique-se de ter instalado:
- Java JDK 17 ou superior
- Node.js (v18+) ou Bun
- PostgreSQL
- Maven (opcional, pois o projeto inclui o wrapper `mvnw`)
