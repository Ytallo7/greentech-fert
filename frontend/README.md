GreenTech Fert - Gestão de Insumos Agrícolas
Este projeto é o Trabalho 2 da disciplina de Desenvolvimento de Software WEB.

O GreenTech Fert é uma plataforma focada na gestão de estoque e monitoramento de vendas de fertilizantes em tempo real, utilizando tecnologias modernas de desenvolvimento front-end.

Justificativa da Arquitetura e Escolhas Técnicas
A arquitetura foi planejada para demonstrar domínio sobre a separação de responsabilidades e organização profissional de código.

1. Componentização e Reutilização
O sistema foi decomposto em componentes independentes para garantir a manutenção e escalabilidade:

NavbarGreen: Isolado para gerenciar a identidade visual e navegação de forma global.

SidebarDashboard: Componente de alta reatividade que centraliza os contadores de estoque através de Props.

CardFertilizante: Unidade atômica que encapsula a lógica de exibição e o gatilho de eventos de venda.

FooterAddress: Implementado com a tag semântica <address> para identificação obrigatória do aluno e dados da disciplina.

2. Tipagem Estruturada (TypeScript)
Para atender aos requisitos de segurança de dados e prevenção de erros:

Utilização da interface IFertilizante para definir o contrato dos dados de insumos (NPK, preço, estoque).

Tipagem rigorosa de Props e States, garantindo que a comunicação entre o componente pai (App.tsx) e os filhos seja íntegra e sem falhas de execução.

3. Layout Assimétrico e Responsivo
Grid System: Implementado via Bootstrap com uma proporção 3/9 no Desktop (Dashboard lateral e Lista principal).

Adaptabilidade: Configurado com sistema de colunas dinâmicas que se empilham em 12 unidades no Mobile, priorizando a experiência do usuário (Mobile-First).

Semântica HTML5: Uso obrigatório das tags <header>, <main>, <aside>, <section>, <footer> e <address>.