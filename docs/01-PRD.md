# Documento de Requisitos do Produto (PRD) - GreenTech Fert SaaS

## 1. Visão Geral do Produto
O GreenTech Fert é uma plataforma SaaS (Software as a Service) voltada para o agronegócio, focada na gestão de insumos, rastreabilidade agrícola e cálculo de custos de produção. O sistema resolve a dor da falta de conectividade no campo através de um aplicativo *offline-first* para o registro de operações e centraliza a inteligência de negócios em um painel web para a gestão financeira e de sustentabilidade (ESG).

## 2. Perfis de Usuário (Personas)
O sistema opera em uma arquitetura *multi-tenant* (múltiplas fazendas no mesmo banco de dados). Cada fazenda terá os seguintes perfis:

*   **Administrador (Dono/Gestor):** Acesso total ao painel web. Visualiza dashboards de custos, aprova compras de insumos e emite o Passaporte Digital (QR Code) da colheita.
*   **Responsável Técnico (Agrônomo):** Acesso web. Cria as prescrições de adubação e defensivos e analisa os dados de inteligência/histórico de safras.
*   **Operador (Tratorista/Trabalhador):** Acesso mobile. Utiliza o aplicativo de campo para registrar o que foi aplicado, onde e quando. Não tem acesso a dados financeiros.

## 3. Épicos e Histórias de Usuário (User Stories)

### Épico 1: Gestão de Aplicação no Campo (Offline-First)
*   **US01:** Como Operador, quero registrar a aplicação de um fertilizante selecionando o talhão (área) e o insumo, mesmo sem internet, para não perder o apontamento diário.
*   **US02:** Como Operador, quero que o aplicativo sincronize automaticamente os dados salvos localmente assim que o celular conectar a uma rede Wi-Fi/4G, para atualizar o sistema central.

### Épico 2: Gestão de Estoque e Insumos
*   **US03:** Como Administrador, quero receber alertas visuais quando o estoque de um defensivo estiver abaixo do limite configurado, para evitar paralisações no plantio.
*   **US04:** Como Agrônomo, quero registrar a entrada de novos insumos com número de lote e data de validade, para garantir a rastreabilidade da origem.

### Épico 3: Rastreabilidade (Passaporte Digital)
*   **US05:** Como Administrador, quero gerar um QR Code após a colheita de um lote, para que compradores possam escanear e ver a lista de insumos aplicados e as datas.

### Épico 4: Inteligência e Custos
*   **US06:** Como Administrador, quero visualizar o custo exato por hectare de um talhão, para entender a rentabilidade daquela área específica.

## 4. Regras de Negócio
*   **RN01 - Isolamento de Dados:** Todo registro criado deve estar obrigatoriamente vinculado ao `tenant_id` da fazenda ativa. Um usuário jamais pode consultar o estoque ou talhões de outra fazenda.
*   **RN02 - Validação de Aplicação:** O aplicativo não pode permitir o registro de uma aplicação se a quantidade informada for maior que o saldo atual do insumo no estoque da fazenda.
*   **RN03 - Timestamp Confiável:** Para os registros offline, o sistema deve considerar a data e hora do dispositivo no momento da ação, e não o horário em que a sincronização ocorreu no servidor.