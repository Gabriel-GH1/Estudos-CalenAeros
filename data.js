// data.js - Dados das aeronaves ATUALIZADO com plannedExit
// Arquivo que contém todos os dados das aeronaves e seus períodos de manutenção

//algumas informações de comentários desnecessárias kkkkkk

// plannedExit é somente quando ocorrer atraso em alguma aeronave
// Variável global que armazena todos os dados das aeronaves
const AIRCRAFT_DATA = {
    // AERONAVE 1: PP-FCF
    "pp-fcf": { // Chave única para identificar a aeronave (usada como ID no HTML)
        prefix: "PP-FCF", // Prefixo de identificação da aeronave
        name: "Embraer Citation CJ3+", // Nome completo/modelo da aeronave
        description: "Aeronave comercial de corredor único", // Descrição do tipo de aeronave
        year: 2025, // Ano de referência para o calendário
        plannedExit: "2025-09-12", // Data planejada de saída da manutenção (formato ISO: YYYY-MM-DD)
        maintenances: [ // Array de objetos contendo os períodos de manutenção
            {
                entrada: "2025-07-21", // Data de entrada na manutenção
                saida: "2025-09-16", // Data real de saída da manutenção
                descricao: "CVA + DOC44" // Descrição do tipo de manutenção realizada
            }
        ]
    },
    
    // AERONAVE 2: PR-MSZ
    "pr-msz": { // Segunda aeronave no sistema
        prefix: "PR-MSZ", // Prefixo de identificação
        name: "Embraer Citation CJ2", // Modelo da aeronave
        description: "Jato regional", // Categoria da aeronave
        year: 2025, // Ano do calendário
        plannedExit: "2025-08-29", // Data planejada de saída
        maintenances: [ // Períodos de manutenção
            {
                entrada: "2025-08-08", // Data de início da manutenção
                saida: "2025-08-29", // Data de término
                descricao: "Pane Precooler + CVA" // Tipo de manutenção + CVA
            }
        ]
    },
    
    // AERONAVE 3: PP-EMO
    "pp-emo": { // Terceira aeronave
        prefix: "PP-EMO", // Prefixo
        name: "EMB-505 - Phenom 300", // Modelo completo
        description: "Jato regional menor", // Descrição
        year: 2025, // Ano de referência
        plannedExit: "2025-08-29", // Data planejada
        maintenances: [ // Array de manutenções
            {
                entrada: "2025-08-15", // Data de entrada
                saida: "2025-08-29", // Data de saída
                descricao: "Manutenção CVA" // Descrição da manutenção
            }
        ]
    },
    
    // AERONAVE 4: PS-ECE
    "ps-ece": { // Quarta aeronave
        prefix: "PS-ECE", // Prefixo
        name: "EMB-505 - Phenom 300", // Modelo
        description: "Aeronave narrow-body", // Tipo de fuselagem
        year: 2025, // Ano
        plannedExit: "2025-08-27", // Data planejada de saída
        maintenances: [ // Períodos de manutenção
            {
                entrada: "2025-08-15", // Início
                saida: "2025-08-27", // Fim
                descricao: "Manutenção CVA" // Tipo de serviço
            }
        ]
    },
    
    // AERONAVE 5: PR-REX
    "pr-rex": { // Quinta aeronave
        prefix: "PR-REX", // Prefixo
        name: "EMB-500 - Phenom 100", // Modelo
        description: "Aeronave comercial", // Categoria
        year: 2025, // Ano
        plannedExit: "2025-08-14", // ← MUDE ESTA DATA para MAIS CEDO da saída pra pintar de vermelho
        // Comentário: Se a plannedExit for anterior à data real de saída, os dias excedentes aparecerão em vermelho (atraso)
        maintenances: [ // Manutenções programadas
            {
                entrada: "2025-04-09", // Data de entrada (longo período)
                saida: "2025-08-14", // Data de saída real
                descricao: "Manutenção CVA" // Descrição
            }
        ]
    },
    
    // AERONAVE 6: PR-ARB (EXEMPLO DE ATRASO)
    "pr-arb": { // Sexta aeronave - EXEMPLO COM ATRASO
        prefix: "PR-ARB", // Prefixo
        name: "525 - Citation CJ1", // Modelo
        description: "Jato regional", // Categoria
        year: 2025, // Ano
        plannedExit: "2025-09-30", // ← MUDE ESTA DATA para MAIS CEDO da saída pra pintar de vermelho
        // Data planejada ANTES da data real de saída = vai gerar atraso (dias em vermelho)
        maintenances: [ // Período de manutenção
            {
                entrada: "2025-02-10", // Data de entrada
                saida: "2025-10-21", // Data REAL (vai criar atraso) - depois da plannedExit
                descricao: "Manutenção CVA" // Descrição
            }
        ]
    },
    
    // AERONAVE 7: PR-DAY
    "pr-day": { // Sétima aeronave
        prefix: "PR-DAY", // Prefixo
        name: "EMB-500 - Phenom 100", // Modelo
        description: "Aeronave comercial", // Categoria
        year: 2025, // Ano
        plannedExit: "2025-09-30", // Data planejada
        maintenances: [ // Manutenções
            {
                entrada: "2025-09-18", // Entrada
                saida: "2025-09-30", // Saída
                descricao: "Manutenção CVA" // Descrição
            }
        ]
    },
    
    // AERONAVE 8: PR-FIL
    "pr-fil": { // Oitava aeronave
        prefix: "PR-FIL", // Prefixo
        name: "EMB-500 - Phenom 100", // Modelo
        description: "Revisão 15 anos + CVA", // Descrição detalhada da manutenção
        year: 2025, // Ano
        plannedExit: "2025-12-01", // Data planejada
        maintenances: [ // Período de manutenção
            {
                entrada: "2025-10-01", // Início
                saida: "2025-12-01", // Término
                descricao: "Manutenção 15 Anos + CVA" // Descrição completa
            }
        ]
    },
    
    // AERONAVE 9: PR-EFT
    "pr-eft": { // Nona aeronave
        prefix: "PR-EFT", // Prefixo
        name: "EMB-505 - Phenom 300", // Modelo
        description: "Manutenção intervalos e CVA", // Tipo de manutenção
        year: 2025, // Ano
        plannedExit: "2025-10-31", // Data planejada
        maintenances: [ // Manutenções
            {
                entrada: "2025-10-10", // Entrada
                saida: "2025-10-31", // Saída
                descricao: "CVA + Intervalos" // Descrição dos serviços
            }
        ]
    },
    
    // AERONAVE 10: PS-CMC
    "ps-cmc": { // Décima aeronave
        prefix: "PS-CMC", // Prefixo
        name: "EMB-505 - Phenom 300", // Modelo
        description: "Manutenção intervalos e CVA", // Descrição
        year: 2025, // Ano
        plannedExit: "2025-11-14", // Data planejada
        maintenances: [ // Período
            {
                entrada: "2025-10-24", // Início
                saida: "2025-11-14", // Fim
                descricao: "CVA + Intervalos" // Serviços
            }
        ]
    },
    
    // AERONAVE 11: PP-NLD
    "pp-nld": { // Décima primeira aeronave
        prefix: "PP-NLD", // Prefixo
        name: "Phenom 300", // Modelo
        description: "Manutenção intervalos e CVA", // Descrição
        year: 2025, // Ano
        plannedExit: "2025-12-12", // Data planejada
        maintenances: [ // Manutenções
            {
                entrada: "2025-10-24", // Entrada
                saida: "2025-12-12", // Saída
                descricao: "CVA + Intervalos" // Descrição
            }
        ]
    },
    
    // AERONAVE 12: PP-LJA
    "pp-lja": { // Décima segunda aeronave
        prefix: "PP-LJA", // Prefixo
        name: "Phenom 300", // Modelo
        description: "CVA", // Tipo de manutenção (apenas CVA)
        year: 2025, // Ano
        plannedExit: "2025-12-20", // Data planejada
        maintenances: [ // Período
            {
                entrada: "2025-12-05", // Início
                saida: "2025-12-20", // Término
                descricao: "CVA" // Descrição
            }
        ]
    },
    
    // ===========================================================================
    // AERONAVES PLACEHOLDER PARA EDIÇÃO FUTURA
    // ===========================================================================
    
    // Placeholders adicionadas para edição futura
    "pr-cmq": {
        prefix: "PR-CMQ",
        name: "EMB-500 - Phenom 100",
        description: "CVA + 48 MO",
        year: 2025,
        // plannedExit opcional
        maintenances: [
            {

                entrada: "2025-10-27",
                saida: "2025-11-14",
                descricao: "CVA + 48 MO"
            }
        ]
    },
    
    "zz-placeholder2": { // Aeronave placeholder 2
        prefix: "ZZ-PL2", // Prefixo temporário
        name: "Placeholder 2 (editar)", // Nome temporário
        description: "Preencha nome, datas e manutenções posteriormente", // Instruções
        year: 2025, // Ano
        maintenances: [] // Array vazio - sem manutenções
    },
    
    // Estrutura para adicionar mais aeronaves:
    // "novo-id": {
    //     prefix: "NOVO-PREFIXO",
    //     name: "Nome do Modelo",
    //     description: "Descrição da aeronave",
    //     year: 2025,
    //     plannedExit: "2025-00-00", // opcional - apenas se houver atraso
    //     maintenances: [
    //         {
    //             entrada: "2025-00-00",
    //             saida: "2025-00-00", 
    //             descricao: "Tipo de manutenção"
    //         }
    //     ]
    // }
};