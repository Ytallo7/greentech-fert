# Documentação de API e Integrações - GreenTech Fert

## 1. Padrões Gerais e Segurança

A API Core do GreenTech Fert segue os padrões RESTful, utilizando JSON como formato de troca de dados. Todas as requisições, exceto as de *login*, exigem autenticação via **JWT (JSON Web Token)**.

### Autenticação e Autorização (IAM)
*   **Cabeçalho HTTP:** O token JWT deve ser enviado no cabeçalho de todas as requisições:
    `Authorization: Bearer <seu_token_aqui>`
*   **Payload do Token:** O token gerado no *login* carrega informações vitais para a arquitetura *multi-tenant* sem precisar consultar o banco a cada requisição:
    ```json
    {
      "sub": "id-do-usuario",
      "tenant_id": "id-da-fazenda",
      "role": "OPERADOR",
      "exp": 1712345678
    }
    ```
*   A API extrai automaticamente o `tenant_id` do token para aplicar o filtro em todas as consultas ao banco de dados.

## 2. Endpoints Principais (v1)

### 2.1. Autenticação
**`POST /api/v1/auth/login`**
*   **Descrição:** Autentica um usuário e retorna o token JWT.
*   **Acesso:** Público
*   **Body (Request):**
    ```json
    {
      "email": "tratorista@fazendaboa.com",
      "senha": "password123"
    }
    ```
*   **Response (200 OK):** Retorna o token JWT e os dados básicos do usuário.

### 2.2. Sincronização Mobile (Offline-First)
**`POST /api/v1/sync/aplicacoes`**
*   **Descrição:** Recebe o lote de apontamentos feitos no campo sem internet. A API não salva diretamente; ela posta no Kafka para processamento assíncrono.
*   **Acesso:** `OPERADOR`, `AGRONOMO`, `ADMIN`
*   **Body (Request):**
    ```json
    {
      "aplicacoes": [
        {
          "talhao_id": 15,
          "insumo_id": 42,
          "quantidade_aplicada": 50.5,
          "data_hora_aplicacao": "2024-03-10T14:30:00Z"
        }
      ]
    }
    ```
*   **Response (202 Accepted):** Indica que o pacote foi recebido e entrou na fila de processamento.
    ```json
    {
      "mensagem": "Sincronização enfileirada com sucesso.",
      "protocolo_lote": "uuid-do-lote-aqui"
    }
    ```

### 2.3. Gestão de Insumos
**`GET /api/v1/insumos`**
*   **Descrição:** Lista o estoque de todos os insumos da fazenda ativa.
*   **Acesso:** `AGRONOMO`, `ADMIN`
*   **Response (200 OK):**
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

### 2.4. Inteligência e Previsão (Comunicação com Python)
**`GET /api/v1/inteligencia/previsao-estoque/{insumo_id}`**
*   **Descrição:** Retorna a previsão de quantos dias o estoque atual durará, baseado no histórico de uso. A API Java consulta internamente o microsserviço Python para devolver esse dado ao front-end.
*   **Acesso:** `ADMIN`, `AGRONOMO`

## 3. Tratamento de Erros

A API possui um *Global Exception Handler* (usando `@ControllerAdvice` no Spring Boot) para garantir que os erros tenham sempre o mesmo formato padronizado.

**Exemplo de Erro (400 Bad Request):**
```json
{
  "timestamp": "2024-03-10T15:00:00Z",
  "status": 400,
  "erro": "Saldo Insuficiente",
  "mensagem": "O insumo 'Ureia Agrícola' possui apenas 100KG em estoque. Tentativa de aplicar 150KG falhou.",
  "path": "/api/v1/sync/aplicacoes"
}