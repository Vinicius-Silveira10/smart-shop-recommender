[README.md.md](https://github.com/user-attachments/files/24653431/README.md.md)
# **Projeto Recomendação: Sistema de E-commerce & IA**

## **📖 1\. A Jornada de Desenvolvimento**

Nesta seção, detalhamos a evolução do projeto, desde a sua concepção até os marcos de engenharia superados para garantir um sistema profissional.

### **📜 Trajetória e Evolução**

O projeto nasceu de uma fase inicial de prototipagem focada em lógica de recomendação simples. Com o tempo, evoluiu para uma **arquitetura de microsserviços robusta**, priorizando a escalabilidade e a integridade de dados histórica.

### **🌌 O Ecossistema Antigravity**

Um marco fundamental foi a transição do ambiente de desenvolvimento (IntelliJ) para o **Antigravity**.

* **Centralização:** O Antigravity atua como o núcleo de orquestração de agentes.  
* **Gestão Global:** Permite gerenciar a raiz Projeto\_Recomendacao de forma holística, facilitando a edição de arquivos críticos como o .gitignore e a execução simultânea das camadas do sistema.

### **🧠 Desafios de Engenharia Superados**

1. **Integridade de Dados e Persistência (PostgreSQL):**  
   * **Problema:** A tabela order\_items salvava campos como product\_id e price\_at\_purchase como \<null\>.  
   * **Solução:** Refatoração para buscar o objeto Product completo antes da persistência e uso da anotação @JsonProperty.  
2. **Comunicação e Tipagem (Erro 400 Bad Request):**  
   * **Problema:** Falhas na "tradução" entre React e Java ao registrar interações.  
   * **Solução:** Conversão explícita no React usando Number() e flexibilização do InteractionDTO com @JsonFormat.  
3. **Sincronização de Build (Maven Cache):**  
   * **Problema:** Mudanças no código não eram refletidas na execução ("Nothing to compile").  
   * **Solução:** Adoção da rotina de limpeza (clean) para garantir que novas classes sejam compiladas corretamente.  
4. **Experiência do Usuário (Modal de Pedidos):**  
   * **Problema:** Modal exibia "Produto não identificado" e preços zerados.  
   * **Solução:** Limpeza física do banco (TRUNCATE) e implementação de uma lógica de "hidratação" em tempo real no Frontend.

## **🛠️ 2\. Documentação Técnica**

Informações necessárias para instalação, execução e manutenção do sistema.

### **🏗️ Stack Tecnológica**

| Camada | Tecnologias Principais |
| :---- | :---- |
| **API Gateway** | Java 21, Spring Boot, Maven |
| **Smart Recommender** | Java 21, Spring Boot, Maven |
| **Frontend** | React, Vite, TypeScript, Prisma, **Node.js** |
| **ML Service** | Python, FastAPI, Uvicorn |
| **Banco de Dados** | PostgreSQL (Admin via DataGrip) |

### **🚀 Guia de Inicialização**

Siga os caminhos de diretório abaixo para iniciar os serviços corretamente:

#### **A. API Gateway (Porta 8083\)**

Localize a pasta do gateway para gerenciar as rotas principais:

* **Caminho:** Projeto\_Recomendacao\\api-gateway\>  
* **Comando:**  
  .\\mvnw.cmd spring-boot:run

#### **B. Smart Recommender (Core)**

Inicie o núcleo de processamento do microsserviço:

* **Caminho:** Projeto\_Recomendacao\\smart-recommender\>  
* **Comando:**  
  .\\mvnw.cmd spring-boot:run

#### **C. Frontend React**

Antes de iniciar o servidor de desenvolvimento, certifique-se de gerar o cliente Prisma na raiz do projeto, caso necessário:

* **Caminho Raiz:** Projeto\_Recomendacao\>  
* **Comando Prisma:** npx prisma generate  
* **Caminho Frontend:** Projeto\_Recomendacao\\frontend-react\>  
* **Comando:**  
  npm run dev

#### **D. Serviço de IA (ML Service)**

O motor de inteligência artificial deve estar ativo para evitar erros 503:

* **Caminho:** Projeto\_Recomendacao\\smart-recommender\\ml-service\\app\>  
* **Comando:**  
  uvicorn main:app \--host 0.0.0.0 \--port 8000 \--reload

### **🧹 Manutenção e Auditoria**

* Limpeza do Banco: Para remover registros de teste antigos/nulos, execute no DataGrip:  
  TRUNCATE TABLE order\_items, orders RESTART IDENTITY CASCADE;  
* **Versionamento:** O .gitignore na raiz protege arquivos .env, node\_modules, target e ambientes virtuais .venv.

## **🤝 Contribuição e Licença**

1. **Fork** o projeto | 2\. Crie sua **Branch** | 3\. Faça o **Commit** | 4\. Abra um **Pull Request**.

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](https://www.google.com/search?q=LICENSE) para mais detalhes.
