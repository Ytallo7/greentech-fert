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

## 3. Modelo Multi-Tenant (Isolamento de Dados)

O sistema adota o padrão **"Shared Database, Shared Schema"** (Banco e Esquema compartilhados). Para garantir que os dados de uma fazenda não se misturem com os de outra, a arquitetura exige o seguinte:

*   **Coluna `tenant_id`:** Todas as tabelas de negócio (`insumos`, `talhoes`, `aplicacoes`, `estoque`) possuem uma coluna `tenant_id` (UUID ou Long).
*   **Filtro Global:** A API Spring Boot intercepta todas as requisições ao banco de dados e adiciona automaticamente um filtro `WHERE tenant_id = ?` baseado no token de autenticação do usuário logado.

## 4. Fluxo de Sincronização Assíncrona (Modo Offline)

O grande desafio do sistema é lidar com vários tratores chegando na sede no fim do dia e sincronizando os dados simultaneamente via Wi-Fi.

**O Fluxo:**
1. O app detecta conexão com a internet.
2. O app envia um *payload* JSON com todas as aplicações do dia para o endpoint de sincronização da API.
3. A API recebe o *payload* e, em vez de salvar diretamente no banco de dados, ela posta uma mensagem no **Tópico Kafka** `aplicacoes-sync`.
4. A API responde rapidamente ao celular com um status `202 Accepted` (Dados em processamento).
5. Um *Worker* (consumidor) dentro da API Spring Boot consome as mensagens do Kafka uma a uma, valida as regras de negócio (ex: saldo de estoque) e efetiva a gravação no PostgreSQL. Isso evita sobrecarga de *lock* no banco de dados.

## 5. Modelagem Lógica Essencial (Entidade-Relacionamento)

As entidades principais do domínio transacional são:

*   **`tenant` (Fazenda):** id, nome, cnpj, data_cadastro.
*   **`usuario`:** id, tenant_id, nome, email, senha_hash, role (ADMIN, AGRONOMO, OPERADOR).
*   **`talhao` (Área de Plantio):** id, tenant_id, identificacao, tamanho_hectares, cultura_atual.
*   **`insumo`:** id, tenant_id, nome, tipo (FERTILIZANTE, DEFENSIVO, SEMENTE), unidade_medida, quantidade_estoque.
*   **`aplicacao`:** id, tenant_id, talhao_id, insumo_id, usuario_id (operador), quantidade_aplicada, data_hora_aplicacao, data_hora_sincronizacao.