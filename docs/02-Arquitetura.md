# Desenho de Arquitetura - GreenTech Fert SaaS

## 1. Visão Geral da Arquitetura
O GreenTech Fert opera em uma arquitetura de microsserviços e computação distribuída. Para suportar o modelo SaaS, o sistema utiliza um banco de dados relacional com isolamento lógico de clientes (*multi-tenancy*) e um barramento de eventos para absorver picos de sincronização originados de dispositivos móveis em áreas rurais.

## 2. Topologia de Sistemas

A plataforma é dividida nos seguintes componentes principais:

1.  **Frontend Web (Painel de Gestão):** Aplicação SPA (Single Page Application) focada em relatórios, cadastros e visualização de inteligência.
2.  **App Mobile (Operação de Campo):** Aplicação *offline-first* com banco de dados local (ex: SQLite). Armazena as operações diárias sem necessidade de internet.
3.  **API Core (Java / Spring Boot):** O coração transacional do sistema. Gerencia a autenticação (IAM), o cadastro de fazendas, o estoque de insumos e as regras de negócio.
4.  **Serviço de Inteligência (Python):** Microsserviço focado em *Data Science* (Pandas/Scikit-learn). Consome dados históricos para gerar previsões de consumo de insumos e análise de produtividade.
5.  **Barramento de Mensagens (Apache Kafka):** Fila de eventos que recebe os pacotes de dados sincronizados pelos aplicativos móveis e entrega à API Core de forma assíncrona.
6.  **Banco de Dados (PostgreSQL):** Banco de dados relacional central que armazena os dados transacionais de todas as fazendas.

## 3. Diagramas Arquiteturais (C4 Model)

### Nível 1: Diagrama de Contexto
```mermaid
C4Context
  title C4 Model Nível 1: Diagrama de Contexto - GreenTech Fert SaaS

  Person(gestor, "Gestor Agrícola", "Acessa relatórios e gerencia cadastros.")
  Person(operador, "Operador de Campo", "Registra aplicações de insumos via app, mesmo offline.")
  
  System(greentech, "GreenTech Fert SaaS", "Plataforma de gestão de fazendas, controle de estoque e inteligência de dados.")

  Rel(gestor, greentech, "Analisa dados e gerencia operação", "HTTPS")
  Rel(operador, greentech, "Sincroniza operações diárias", "HTTPS/Wi-Fi")
  ```

### Nível 2: Diagrama de Contêiners

```mermaid
  C4Container
  title C4 Model Nível 2: Diagrama de Contêineres - GreenTech Fert SaaS

  Person(gestor, "Gestor Agrícola", "Usuário do painel web.")
  Person(operador, "Operador de Campo", "Usuário do aplicativo móvel.")

  System_Boundary(greentech_boundary, "GreenTech Fert SaaS") {
    Container(spa, "Frontend Web", "SPA, React/Angular", "Painel de gestão e relatórios.")
    Container(app, "App Mobile", "React Native/Flutter, SQLite", "Aplicação offline-first para operação em campo.")
    
    Container(api_core, "API Core", "Java, Spring Boot", "Gerencia IAM, multi-tenancy, regras de negócio e consumo de eventos.")
    Container(api_python, "Serviço de Inteligência", "Python, Pandas", "Gera previsões e análise de produtividade.")
    
    ContainerDb(db_sql, "Banco de Dados Central", "PostgreSQL", "Armazena dados transacionais (Multi-tenant).")
    ContainerQueue(kafka, "Barramento de Mensagens", "Apache Kafka", "Fila de eventos de sincronização (aplicacoes-sync).")
  }

  Rel(gestor, spa, "Acessa painel", "HTTPS")
  Rel(operador, app, "Registra dados localmente", "SQLite DB")
  Rel(operador, app, "Sincroniza pacotes (202 Accepted)", "JSON/HTTPS")
  
  Rel(spa, api_core, "Consome API", "JSON/HTTPS")
  Rel(app, api_core, "Envia payload de sincronização", "JSON/HTTPS")
  
  Rel(api_core, kafka, "Posta payload bruto no tópico", "TCP")
  Rel(kafka, api_core, "Worker consome e processa fila", "TCP")
  
  Rel(api_core, api_python, "Solicita previsões de consumo", "REST/gRPC")
  Rel(api_core, db_sql, "Grava aplicação (com Filtro tenant_id)", "JDBC")
  ```