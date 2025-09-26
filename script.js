// Dados dos períodos de manutenção de cada aeronave
// Objeto que armazena todas as informações de manutenção das aeronaves
const aircraftData = {
    'pp-fcf': {  // Chave única para identificar a aeronave
        prefix: 'PP-FCF',  // Prefixo de identificação da aeronave
        entrada: new Date('2025-07-21'),  // Data de entrada para manutenção
        saida: new Date('2025-09-17'), // ATUALIZADO: de 13/09 para 17/09 - Data de saída atualizada
        info: "Manutenção programada para revisão geral - Concluída com atraso"  // Descrição detalhada
    },
    // Estrutura repetida para as outras 6 aeronaves
    'pr-msz': {
        prefix: 'PR-MSZ',
        entrada: new Date('2025-08-08'),
        saida: new Date('2025-08-30'),
        info: "Manutenção de sistemas hidráulicos"
    },
    'pp-emo': {
        prefix: 'PP-EMO',
        entrada: new Date('2025-08-15'),
        saida: new Date('2025-08-30'),
        info: "Substituição de componentes da asa direita"
    },
    'ps-ece': {
        prefix: 'PS-ECE',
        entrada: new Date('2025-08-15'),
        saida: new Date('2025-08-28'),
        info: "Atualização de sistemas de navegação"
    },
     'pr-rex': {
        prefix: 'PR-REX',
        entrada: new Date('2025-04-10'),  // Data de entrada
        saida: new Date('2025-08-15'),    // Data de saída
        info: "Manutenção programada para revisão de motores"
    },
    'pr-arb': {
        prefix: 'PR-ARB',
        entrada: new Date('2025-02-08'),  // Data de entrada
        saida: new Date('2025-10-08'),    // Data de saída
          info: "Substituição de sistema de combustível - Nova data de saída"
    },
     'pr-day': {  
        prefix: 'PR-DAY',
        entrada: new Date('2025-09-19'),
        saida: new Date('2025-09-31'),  // Nota: Setembro tem apenas 30 dias
        info: "Manutenção CVA"
    }
};

// Função para alternar entre abas - controla a navegação entre aeronaves
function openTab(tabId) {
    // Ocultar todo o conteúdo da guia - remove classe active de todas as abas
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // Remove active class de todos os botões da guia
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    // Mostrar o conteúdo da aba selecionada e definir o botão como ativo
    document.getElementById(tabId).classList.add('active');  // Mostra conteúdo
    event.currentTarget.classList.add('active');  // Destaca botão clicado
    
    // Atualizar informações da aeronave ao mudar de aba
    updateAircraftInfo(tabId);
}

// Definir data atual no footer - atualiza automaticamente
document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR');

// Atualizar informações da aeronave - exibe dados no topo de cada aba
function updateAircraftInfo(aircraftId) {
    const data = aircraftData[aircraftId];  // Busca dados da aeronave específica
    const infoElement = document.getElementById(`${aircraftId}-info`);  // Elemento onde info será exibida
    
    if (data && infoElement) {
        // Formata datas para o padrão brasileiro
        const entradaFormatada = data.entrada.toLocaleDateString('pt-BR');
        const saidaFormatada = data.saida.toLocaleDateString('pt-BR');
        
        // Monta HTML com informações formatadas
        infoElement.innerHTML = `
            <strong>Entrada:</strong> ${entradaFormatada} | 
            <strong>Saída:</strong> ${saidaFormatada} | 
            <strong>Duração:</strong> ${getDiasUteisFixos(aircraftId)} dias úteis
            <br><em>${data.info}</em>  <!-- Descrição em itálico -->
        `;
    }
}

// Calcular diferença de dias úteis entre duas datas (função não utilizada atualmente)
function calculateDaysDifference(startDate, endDate) {
    let count = 0;  // Contador de dias úteis
    const curDate = new Date(startDate.getTime());  // Cria cópia da data inicial
    
    // Loop por cada dia entre as datas
    while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();  // 0=Domingo, 6=Sábado
        if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;  // Incrementa se for dia útil
        curDate.setDate(curDate.getDate() + 1);  // Avança para próximo dia
    }
    
    return count;
}

// Adicionar eventos de mouse para as abas - melhora interatividade
document.querySelectorAll('.tab-button').forEach(button => {
    const aircraftId = button.getAttribute('data-aircraft');  // Obtém ID da aeronave
    const data = aircraftData[aircraftId];  // Busca dados correspondentes
    
    if (data) {
        // Adicionar tooltip com informações da aeronave
        const tooltip = button.querySelector('.tab-tooltip');
        const entradaFormatada = data.entrada.toLocaleDateString('pt-BR');
        const saidaFormatada = data.saida.toLocaleDateString('pt-BR');
        
        tooltip.textContent = `Entrada: ${entradaFormatada} | Saída: ${saidaFormatada}`;
        
        // Atualizar informações ao passar o mouse
        button.addEventListener('mouseenter', () => {
            updateAircraftInfo(aircraftId);
        });
    }
});

// Gerar calendário para cada aeronave - executa ao carregar a página
Object.keys(aircraftData).forEach(aircraft => {
    generateCalendar(aircraft, aircraftData[aircraft]);
});

// Função principal que gera o calendário visual
function generateCalendar(aircraftId, data) {
    const calendarContainer = document.getElementById(`${aircraftId}-calendar`);
    const year = data.entrada.getFullYear();  // Ano base para o calendário (2025)
    const today = new Date();  // Data atual para referência
    today.setHours(0, 0, 0, 0);  // Zera horas para comparação precisa
    
    // Defina a data original de saída planejada (12/09) - APENAS PARA PP-FCF
    const saidaPlanejada = aircraftId === 'pp-fcf' ? new Date('2025-09-12') : null;
    // NOVO: Defina a data original de saída planejada (19/09) - APENAS PARA PR-ARB
    const saidaPlanejadaPRARB = aircraftId === 'pr-arb' ? new Date('2025-09-19') : null;
    
    // Loop para criar os 12 meses do ano
    for (let month = 0; month < 12; month++) {
        const monthElement = document.createElement('div');
        monthElement.className = 'month';  // Container de cada mês
        
        // Cria elemento com nome do mês
        const monthName = document.createElement('div');
        monthName.className = 'month-name';
        monthName.textContent = new Date(year, month, 1).toLocaleDateString('pt-BR', { month: 'long' });
        monthElement.appendChild(monthName);
        
        // Cria cabeçalho com dias da semana
        const weekdays = document.createElement('div');
        weekdays.className = 'weekdays';
        ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            weekdays.appendChild(dayElement);
        });
        monthElement.appendChild(weekdays);
        
        // Container para os dias do mês
        const daysContainer = document.createElement('div');
        daysContainer.className = 'days';
        
        // Calcula primeiro e último dia do mês
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Dias vazios antes do primeiro dia do mês (para alinhamento)
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            daysContainer.appendChild(emptyDay);
        }
       
       // Loop para criar cada dia do mês
       for (let day = 1; day <= lastDay.getDate(); day++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'day';  // Elemento de dia individual
    dayElement.textContent = day;  // Número do dia
    
    const currentDate = new Date(year, month, day);  // Data atual do loop
    const dayOfWeek = currentDate.getDay(); // 0 = Domingo, 6 = Sábado
    
    // Verifica se este dia está dentro do período de manutenção E é um dia útil
    if (currentDate >= data.entrada && currentDate <= data.saida && dayOfWeek !== 0 && dayOfWeek !== 6) {
        dayElement.classList.add('maintenance');  // Adiciona classe de estilo
        
        // CRIAR TOOLTIP PARA DIAS DE MANUTENÇÃO
        const tooltip = document.createElement('div');
        tooltip.className = 'day-tooltip';
        
        // DATAS ESPECÍFICAS DE SAÍDA PARA CADA AERONAVE
        const saidaDates = {
            'pp-fcf': '16/09',
            'pr-msz': '29/08', 
            'pp-emo': '29/08',
            'ps-ece': '27/08',
            'pr-rex': '14/08',
            'pr-arb': '07/10',
            'pr-day': '30/09'
        };
        
        // Formata a data atual para comparar (dd/mm)
        const currentDay = String(day).padStart(2, '0');
        const currentMonth = String(month + 1).padStart(2, '0');
        const currentDateFormatted = `${currentDay}/${currentMonth}`;
        
        // Verifica se é o dia de saída específico
        if (saidaDates[aircraftId] === currentDateFormatted) {
            tooltip.textContent = `${data.prefix} - Manutenção concluída`;
        } else {
            tooltip.textContent = `${data.prefix} - Em manutenção`;
        }
        
        dayElement.appendChild(tooltip);  // Adiciona tooltip ao dia
        
        // VERIFICAÇÃO ESPECIAL PARA PP-FCF: Dias de atraso
        if (aircraftId === 'pp-fcf' && saidaPlanejada && currentDate > saidaPlanejada) {
            dayElement.classList.add('delay');  // Adiciona classe de atraso
            
            // Atualiza o tooltip para mostrar que é atraso
            if (saidaDates[aircraftId] === currentDateFormatted) {
                tooltip.textContent = `${data.prefix} - Manutenção concluída com atraso`;
            } else {
                tooltip.textContent = `${data.prefix} - Conclusão com atraso`;
            }
        }
       
    }
    
    daysContainer.appendChild(dayElement);  // Adiciona dia ao container
}
       
        monthElement.appendChild(daysContainer);  // Adiciona dias ao mês
        calendarContainer.appendChild(monthElement);  // Adiciona mês ao calendário
    }
    
    // Atualizar informações da aeronave ativa inicialmente
    if (document.getElementById(aircraftId).classList.contains('active')) {
        updateAircraftInfo(aircraftId);
    }
}

// Função que retorna dias úteis fixos para cada aeronave (valores pré-calculados)
function getDiasUteisFixos(aircraftId) {
    if (aircraftId === 'pp-fcf') return 42;
    if (aircraftId === 'pr-msz') return 16;
    if (aircraftId === 'pp-emo') return 11;
    if (aircraftId === 'ps-ece') return 9;
    if (aircraftId === 'pr-rex') return 88;
    if (aircraftId === 'pr-arb') return 166;
    if (aircraftId === 'pr-day') return 9;  // Valor para PR-DAY
    return 0;  // Valor padrão caso não encontre
}