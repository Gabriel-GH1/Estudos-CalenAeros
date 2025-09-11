// Função para alternar entre abas
function openTab(tabId, event) {
    // Ocultar todo o conteúdo da guia
    const tabContents = document.getElementsByClassName('tab-content');
    // Obtém todos os elementos com a classe 'tab-content'
    for (let i = 0; i < tabContents.length; i++) {
        // Loop através de todos os conteúdos de abas
        tabContents[i].classList.remove('active');
        // Remove a classe 'active' de cada conteúdo de aba
    }
    
    // Remove active class de todos os botões da guia
    const tabButtons = document.getElementsByClassName('tab-button');
    // Obtém todos os elementos com a classe 'tab-button'
    for (let i = 0; i < tabButtons.length; i++) {
        // Loop através de todos os botões de abas
        tabButtons[i].classList.remove('active');
        // Remove a classe 'active' de cada botão de aba
    }
    
    // Mostrar o conteúdo da aba selecionada e definir o botão como ativo
    document.getElementById(tabId).classList.add('active');
    // Adiciona a classe 'active' ao conteúdo da aba com o ID especificado
    event.currentTarget.classList.add('active');
    // Adiciona a classe 'active' ao botão que foi clicado
}

// Definir data atual no footer
document.getElementById('current-date').textContent = new Date().toLocaleDateString('pt-BR');
// Obtém o elemento com ID 'current-date' e define seu conteúdo como a data atual formatada em português brasileiro

// Dados dos períodos de manutenção de cada aeronave (do arquivo Excel, com um dia a mais para garantir a cobertura completa no calendário)
const aircraftData = {
    // Objeto que armazena os dados de manutenção de cada aeronave
    'pp-fcf': {
        prefix: 'PP-FCF',
        entrada: new Date('2025-07-21'),
        // Data de entrada para manutenção
        saida: new Date('2025-09-13')
        // Data de saída da manutenção
    },
    'pr-msz': {
        prefix: 'PR-MSZ',
        entrada: new Date('2025-08-08'),
        saida: new Date('2025-08-30')
    },
    'pp-emo': {
        prefix: 'PP-EMO',
        entrada: new Date('2025-08-15'),
        saida: new Date('2025-08-30')
    },
    'ps-ece': {
        prefix: 'PS-ECE',
        entrada: new Date('2025-08-15'),
        saida: new Date('2025-08-28')
    }
};

// Gerar calendário para cada aeronave
Object.keys(aircraftData).forEach(aircraft => {
    // Obtém as chaves do objeto aircraftData (nomes das aeronaves) e itera sobre cada uma
    generateCalendar(aircraft, aircraftData[aircraft]);
    // Chama a função generateCalendar para cada aeronave, passando o ID e os dados
});

function generateCalendar(aircraftId, data) {
    // Função para gerar o calendário para uma aeronave específica
    const calendarContainer = document.getElementById(`${aircraftId}-calendar`);
    // Obtém o elemento onde o calendário será inserido
    const year = data.entrada.getFullYear();
    // Obtém o ano a partir da data de entrada
    
    for (let month = 0; month < 12; month++) {
        // Loop através de todos os meses (0 a 11, onde 0 = Janeiro, 11 = Dezembro)
        const monthElement = document.createElement('div');
        // Cria um elemento div para o mês
        monthElement.className = 'month';
        // Define a classe como 'month'
        
        const monthName = document.createElement('div');
        // Cria um elemento div para o nome do mês
        monthName.className = 'month-name';
        // Define a classe como 'month-name'
        monthName.textContent = new Date(year, month, 1).toLocaleDateString('pt-BR', { month: 'long' });
        // Define o texto como o nome do mês por extenso em português
        monthElement.appendChild(monthName);
        // Adiciona o nome do mês ao elemento do mês
        
        const weekdays = document.createElement('div');
        // Cria um elemento div para os dias da semana
        weekdays.className = 'weekdays';
        // Define a classe como 'weekdays'
        ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].forEach(day => {
            // Array com abreviações dos dias da semana e loop através dele
            const dayElement = document.createElement('div');
            // Cria um elemento div para cada dia da semana
            dayElement.textContent = day;
            // Define o texto como a abreviação do dia
            weekdays.appendChild(dayElement);
            // Adiciona o dia da semana ao container de dias da semana
        });
        monthElement.appendChild(weekdays);
        // Adiciona os dias da semana ao elemento do mês
        
        const daysContainer = document.createElement('div');
        // Cria um elemento div para os dias do mês
        daysContainer.className = 'days';
        // Define a classe como 'days'
        
        const firstDay = new Date(year, month, 1);
        // Obtém o primeiro dia do mês
        const lastDay = new Date(year, month + 1, 0);
        // Obtém o último dia do mês (dia 0 do próximo mês)
        
        // Dias vazios antes do primeiro dia do mês
        for (let i = 0; i < firstDay.getDay(); i++) {
            // Loop para criar células vazias até o primeiro dia do mês
            const emptyDay = document.createElement('div');
            // Cria um elemento div vazio
            emptyDay.className = 'day empty';
            // Define a classe como 'day empty'
            daysContainer.appendChild(emptyDay);
            // Adiciona o dia vazio ao container de dias
        }
        
        // Dias do mês
        for (let day = 1; day <= lastDay.getDate(); day++) {
            // Loop através de todos os dias do mês
            const dayElement = document.createElement('div');
            // Cria um elemento div para o dia
            dayElement.className = 'day';
            // Define a classe como 'day'
            dayElement.textContent = day;
            // Define o texto como o número do dia
            
            const currentDate = new Date(year, month, day);
            // Cria uma data para o dia atual no loop
            const dayOfWeek = currentDate.getDay();
            // Obtém o dia da semana (0 = Domingo, 6 = Sábado)
            
            // Verifique se este dia está dentro do período de manutenção E é um dia útil (não sábado ou domingo)
            if (currentDate >= data.entrada && currentDate <= data.saida && dayOfWeek !== 0 && dayOfWeek !== 6) {
                // Se a data está entre entrada e saída E não é fim de semana
                dayElement.classList.add('maintenance');
                // Adiciona a classe 'maintenance' para destacar visualmente
            }
            
            daysContainer.appendChild(dayElement);
            // Adiciona o dia ao container de dias
        }
        
        monthElement.appendChild(daysContainer);
        // Adiciona o container de dias ao elemento do mês
        calendarContainer.appendChild(monthElement);  
    } 
} // <-- Fechamento da função generateCalendar 