// Função para alternar entre abas
function openTab(tabId) {
    // Ocultar todo o conteúdo da guia
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active'); // Remove a classe active de todas as abas
    }
    
    // Remove a classe active de todos os botões da guia
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active'); // Remove a classe active de todos os botões
    }
    
    // Mostrar o conteúdo da aba selecionada e definir o botão como ativo
    document.getElementById(tabId).classList.add('active'); // Adiciona a classe active à aba selecionada
    event.currentTarget.classList.add('active'); // Adiciona a classe active ao botão clicado
    
    // Atualizar informações da aeronave ao mudar de aba
    updateAircraftInfo(tabId); // Chama a função para atualizar as informações
}

// Definir data atual no footer
document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR'); 
// Obtém a data atual e formata no padrão brasileiro (dd/mm/aaaa)

// Dados dos períodos de manutenção de cada aeronave
const aircraftData = {
    'pp-fcf': { // Identificador único para a aeronave PP-FCF
        prefix: 'PP-FCF', // Prefixo da aeronave
        entrada: new Date('2025-07-21'), // Data de entrada em manutenção
        saida: new Date('2025-09-13'), // Data de saída da manutenção
        info: "Manutenção programada para revisão geral" // Informações adicionais
    },
    'pr-msz': { // Identificador único para a aeronave PR-MSZ
        prefix: 'PR-MSZ',
        entrada: new Date('2025-08-08'),
        saida: new Date('2025-08-30'),
        info: "Manutenção de sistemas hidráulicos"
    },
    'pp-emo': { // Identificador único para a aeronave PP-EMO
        prefix: 'PP-EMO',
        entrada: new Date('2025-08-15'),
        saida: new Date('2025-08-30'),
        info: "Substituição de componentes da asa direita"
    },
    'ps-ece': { // Identificador único para a aeronave PS-ECE
        prefix: 'PS-ECE',
        entrada: new Date('2025-08-15'),
        saida: new Date('2025-08-28'),
        info: "Atualização de sistemas de navegação"
    }
};

// Atualizar informações da aeronave
function updateAircraftInfo(aircraftId) {
    const data = aircraftData[aircraftId]; // Obtém os dados da aeronave específica
    const infoElement = document.getElementById(`${aircraftId}-info`); // Obtém o elemento onde as informações serão exibidas
    
    if (data && infoElement) { // Verifica se os dados e o elemento existem
        const entradaFormatada = data.entrada.toLocaleDateString('pt-BR'); // Formata a data de entrada
        const saidaFormatada = data.saida.toLocaleDateString('pt-BR'); // Formata a data de saída
        
        // Insere as informações formatadas no elemento HTML
        infoElement.innerHTML = `
            <strong>Entrada:</strong> ${entradaFormatada} | 
            <strong>Saída:</strong> ${saidaFormatada} | 
            <strong>Duração:</strong> ${getDiasUteisFixos(aircraftId)} dias úteis
            <br><em>${data.info}</em>
        `;
    }
}

// Calcular diferença de dias úteis entre duas datas
function calculateDaysDifference(startDate, endDate) {
    let count = 0; // Inicializa o contador de dias úteis
    const curDate = new Date(startDate.getTime()); // Cria uma cópia da data de início
    
    // Itera por cada dia entre as datas
    while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay(); // Obtém o dia da semana (0=domingo, 6=sábado)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) count++; // Incrementa se for dia útil
        curDate.setDate(curDate.getDate() + 1); // Avança para o próximo dia
    }
    
    return count; // Retorna o total de dias úteis
}

// Adicionar eventos de mouse para as abas
document.querySelectorAll('.tab-button').forEach(button => {
    const aircraftId = button.getAttribute('data-aircraft'); // Obtém o ID da aeronave do atributo data
    const data = aircraftData[aircraftId]; // Obtém os dados da aeronave
    
    if (data) {
        // Adicionar tooltip com informações da aeronave
        const tooltip = button.querySelector('.tab-tooltip'); // Seleciona o elemento do tooltip
        const entradaFormatada = data.entrada.toLocaleDateString('pt-BR'); // Formata a data de entrada
        const saidaFormatada = data.saida.toLocaleDateString('pt-BR'); // Formata a data de saída
        
        tooltip.textContent = `Entrada: ${entradaFormatada} | Saída: ${saidaFormatada}`; // Define o texto do tooltip
        
        // Atualizar informações ao passar o mouse
        button.addEventListener('mouseenter', () => {
            updateAircraftInfo(aircraftId); // Chama a função para atualizar as informações
        });
    }
});

// Gerar calendário para cada aeronave
Object.keys(aircraftData).forEach(aircraft => {
    generateCalendar(aircraft, aircraftData[aircraft]); // Chama a função para gerar o calendário
});

// Função para gerar o calendário
function generateCalendar(aircraftId, data) {
    const calendarContainer = document.getElementById(`${aircraftId}-calendar`); // Obtém o container do calendário
    const year = data.entrada.getFullYear(); // Obtém o ano da data de entrada
    const today = new Date(); // Obtém a data atual
    today.setHours(0, 0, 0, 0); // Define a hora para meia-noite para comparação precisa
    
    // Gera os 12 meses do ano
    for (let month = 0; month < 12; month++) {
        const monthElement = document.createElement('div'); // Cria um elemento para o mês
        monthElement.className = 'month'; // Adiciona a classe month
        
        const monthName = document.createElement('div'); // Cria um elemento para o nome do mês
        monthName.className = 'month-name'; // Adiciona a classe month-name
        monthName.textContent = new Date(year, month, 1).toLocaleDateString('pt-BR', { month: 'long' }); // Define o nome do mês
        monthElement.appendChild(monthName); // Adiciona o nome do mês ao elemento do mês
        
        const weekdays = document.createElement('div'); // Cria um elemento para os dias da semana
        weekdays.className = 'weekdays'; // Adiciona a classe weekdays
        // Adiciona os dias da semana (Dom, Seg, Ter, etc.)
        ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(day => {
            const dayElement = document.createElement('div'); // Cria um elemento para cada dia da semana
            dayElement.textContent = day; // Define o texto do dia
            weekdays.appendChild(dayElement); // Adiciona ao container de dias da semana
        });
        monthElement.appendChild(weekdays); // Adiciona os dias da semana ao elemento do mês
        
        const daysContainer = document.createElement('div'); // Cria um container para os dias do mês
        daysContainer.className = 'days'; // Adiciona a classe days
        
        const firstDay = new Date(year, month, 1); // Primeiro dia do mês
        const lastDay = new Date(year, month + 1, 0); // Último dia do mês
        
        // Dias vazios antes do primeiro dia do mês
        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyDay = document.createElement('div'); // Cria um elemento vazio
            emptyDay.className = 'day empty'; // Adiciona as classes day e empty
            daysContainer.appendChild(emptyDay); // Adiciona ao container de dias
        }
        
        // Dias do mês
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div'); // Cria um elemento para o dia
            dayElement.className = 'day'; // Adiciona a classe day
            dayElement.textContent = day; // Define o número do dia
            
            const currentDate = new Date(year, month, day); // Cria uma data para o dia atual
            const dayOfWeek = currentDate.getDay(); // 0 = Domingo, 6 = Sábado
            
            // Verificar se é hoje E NÃO é 15 de setembro (mês 8, pois janeiro = 0)
            if (currentDate.getTime() === today.getTime() && 
            !(currentDate.getDate() === 15 && currentDate.getMonth() === 8)) {
               dayElement.classList.add('today'); // Adiciona a classe today
            }
            
            // Verifica se este dia está dentro do período de manutenção E é um dia útil
            if (currentDate >= data.entrada && currentDate <= data.saida && dayOfWeek !== 0 && dayOfWeek !== 6) {
                dayElement.classList.add('maintenance'); // Adiciona a classe maintenance
                
                // Adicionar tooltip para dias de manutenção
                const tooltip = document.createElement('div'); // Cria um elemento para o tooltip
                tooltip.className = 'day-tooltip'; // Adiciona a classe day-tooltip
                tooltip.textContent = `${data.prefix} em manutenção`; // Define o texto do tooltip
                dayElement.appendChild(tooltip); // Adiciona o tooltip ao dia
            }
            
            daysContainer.appendChild(dayElement); // Adiciona o dia ao container de dias
        }
        
        monthElement.appendChild(daysContainer); // Adiciona os dias ao elemento do mês
        calendarContainer.appendChild(monthElement); // Adiciona o mês ao container do calendário
    }
    
    // Atualizar informações da aeronave ativa inicialmente
    if (document.getElementById(aircraftId).classList.contains('active')) {
        updateAircraftInfo(aircraftId); // Chama a função para atualizar as informações
    }
}

// Função para retornar os dias úteis fixos que você quer
function getDiasUteisFixos(aircraftId) {
    if (aircraftId === 'pp-fcf') return 40; // Dias úteis para PP-FCF
    if (aircraftId === 'pr-msz') return 16;  // Dias úteis para PR-MSZ
    if (aircraftId === 'pp-emo') return 11;  // Dias úteis para PP-EMO
    if (aircraftId === 'ps-ece') return 9;   // Dias úteis para PS-ECE
    return 0; // Retorno padrão
}