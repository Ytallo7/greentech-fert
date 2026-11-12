# Documentação de API e Integrações - GreenTech Fert SaaS

## 1. Padrões Gerais e Segurança

A API Core do GreenTech Fert segue os padrões RESTful, utilizando JSON como formato de troca de dados. Todas as requisições, exceto as de *login*, exigem autenticação via **JWT (JSON Web Token)**.

### Autenticação e Autorização (IAM)
-   **Cabeçalho HTTP:** O token JWT deve ser enviado no cabeçalho de todas as requisições:
    `Authorization: Bearer <seu_token_aqui>`
-   **Payload do Token:** O token gerado no *login* carrega informações vitais para a arquitetura *multi-tenant* sem precisar consultar o banco a cada requisição:
    ```json
    {
      "sub": "id-do-usuario",
      "tenant_id": "id-da-fazenda",
      "role": "OPERADOR",
      "exp": 1712345678
    }
    ```
-   A API extrai automaticamente o `tenant_id` do token para aplicar o filtro em todas as consultas ao banco de dados.

---

## 2. Endpoints Principais (v1)

### 2.1. Autenticação
**`POST /api/v1/auth/login`**
-   **Descrição:** Autentica um usuário e retorna o token JWT.
-   **Acesso:** Público
-   **Body (Request):**
    ```json
    {
      "email": "tratorista@fazendaboa.com",
      "senha": "password123"
    }
    ```
-   **Response (200 OK):** Retorna o token JWT e os dados básicos do usuário.

### 2.2. Sincronização Mobile (Offline-First em Lote)
**`POST /api/v1/sync/aplicacoes`**
-   **Descrição:** Recebe um lote (batch) de aplicações de insumos registradas de forma offline pelo aplicativo móvel dos tratores. Para evitar *locks* no banco de dados e garantir alta disponibilidade no fim do expediente da fazenda, a API valida a requisição e a envia para o tópico Kafka `aplicacoes-sync`.
-   **Acesso:** `OPERADOR`, `AGRONOMO`, `ADMIN`
-   **Body (Request):**
    ```json
    {
      "dispositivo_id": "tablet-trator-04",
      "data_hora_sincronizacao": "2026-11-12T17:30:00Z",
      "aplicacoes": [
        {
          "id_local_sqlite": "550e8400-e29b-41d4-a716-446655440000",
          "talhao_id": 12,
          "insumo_id": 89,
          "usuario_id": 3,
          "quantidade_aplicada": 150.5,
          "data_hora_aplicacao": "2026-11-12T10:15:30Z"
        },
        {
          "id_local_sqlite": "660e8400-e29b-41d4-a716-446655440001",
          "talhao_id": 12,
          "insumo_id": 92,
          "usuario_id": 3,
          "quantidade_aplicada": 50.0,
          "data_hora_aplicacao": "2026-11-12T14:20:00Z"
        }
      ]
    }
    ```
-   **Response (202 Accepted):** Indica que o pacote foi recebido e entrou na fila de processamento do Kafka.
    ```json
    {
      "status": "PROCESSANDO",
      "mensagem": "Lote recebido com sucesso e enviado para a fila de sincronização.",
      "protocolo_sync": "sync-req-99887766",
      "total_registros_recebidos": 2
    }
    ```

### 2.3. Gestão de Insumos
**`GET /api/v1/insumos`**
-   **Descrição:** Lista o estoque de todos os insumos da fazenda ativa.
-   **Acesso:** `AGRONOMO`, `ADMIN`
-   **Response (200 OK):**
    ```json
    [
      {
        "id": 42,
        "nome": "Ureia Agrícola",
        "tipo": "FERTILIZANTE",
        "quantidade_estoque": 1500.0,
        "unidade_medida": "KG"
      }
    ]
    ```

### 2.4. Inteligência e Previsão (Comunicação Python)
**`GET /api/v1/inteligencia/previsao-estoque/{insumo_id}`**
-   **Descrição:** Retorna a previsão de quantos dias o estoque atual durará, baseado no histórico de uso. A API Java consulta internamente o microsserviço Python para devolver esse dado ao front-end.
-   **Acesso:** `ADMIN`, `AGRONOMO`

---

## 3. Tratamento de Erros (Global Exception Handler)

A API possui um *Global Exception Handler* (`@ControllerAdvice`) para garantir que os erros tenham sempre o mesmo formato padronizado.

**Exemplo de Erro de Regra de Negócio (400 Bad Request):**
```json
{
  "timestamp": "2026-11-12T15:00:00Z",
  "status": 400,
  "erro": "Saldo Insuficiente",
  "mensagem": "O insumo 'Ureia Agrícola' possui apenas 100KG em estoque. Tentativa de aplicar 150KG falhou.",
  "path": "/api/v1/sync/aplicacoes"
}