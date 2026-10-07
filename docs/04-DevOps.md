# Guia de Operações e DevOps - GreenTech Fert SaaS

## 1. Visão Geral
A infraestrutura do GreenTech Fert é baseada em contêineres para garantir paridade entre os ambientes de desenvolvimento, homologação e produção. O fluxo de deploy é automatizado através de pipelines de Integração e Entrega Contínuas (CI/CD).

## 2. Orquestração Local (Docker Compose)
Para rodar todo o ecossistema na máquina do desenvolvedor com um único comando (`docker-compose up -d`), a infraestrutura mínima inclui os seguintes serviços:

*   **`db`:** Banco de dados PostgreSQL (com mapeamento de volume para não perder dados ao reiniciar).
*   **`zookeeper` & `kafka`:** O barramento de mensagens para simular a fila de sincronização offline.
*   **`api-core`:** A aplicação Spring Boot rodando na porta 8080, conectada ao Postgres e ao Kafka.
*   **`api-inteligencia`:** O microsserviço Python rodando na porta 5000.

**Exemplo base do `docker-compose.yml` (raiz do projeto):**
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: green_user
      POSTGRES_PASSWORD: green_password
      POSTGRES_DB: green_fert_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  kafka:
    image: confluentinc/cp-kafka:latest
    ports:
      - "9092:9092"
    environment:
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    depends_on:
      - zookeeper

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      
volumes:
  pgdata: