// script.js - gera abas e calendários dinamicamente (suporta múltiplas manutenções)
// VERSÃO 2.0 - Dinâmica e compatível com data.js atual

// Variável global para armazenar os dados das aeronaves
let aircraftData = {};

// Objeto de configuração da aplicação
const appConfig = {
    // Ano padrão para os calendários (ano atual)
    defaultYear: new Date().getFullYear(),
    // Formato de data para exibição
    dateFormat: 'pt-BR',
    // Dias da semana considerados dias úteis (Segunda a Sexta)
    businessDays: [1, 2, 3, 4, 5], // Segunda a Sexta
    // CONFIGURAÇÕES POR AERONAVE - AGORA DINÂMICAS
    aircraftSettings: {
        "pp-fcf": { 
            // Data planejada para saída da manutenção
            plannedExit: "2025-09-12",
            // Indica se é uma manutenção crítica
            critical: true,
            // Propriedades vazias (podem ser preenchidas posteriormente)
            
        },
        "pr-msz": {
            // Data planejada para saída da manutenção
            plannedExit: "2025-08-29", 
            // Indica se é uma manutenção crítica
            critical: false,
            // Propriedades vazias (podem ser preenchidas posteriormente)
            
        },
        "pp-emo": {
            // Data planejada para saída da manutenção
            plannedExit: "2025-08-29",
            // Indica se é uma manutenção crítica
            critical: false,
            // Propriedades vazias (podem ser preenchidas posteriormente)
           
        },
        "ps-ece": {
            // Data planejada para saída da manutenção
            plannedExit: "2025-08-27",
            // Indica se é uma manutenção crítica
            critical: false, 
            // Propriedades vazias (podem ser preenchidas posteriormente)
            
        },
        "pr-rex": {
            // Data planejada para saída da manutenção
            plannedExit: "2025-08-14",
            // Indica se é uma manutenção crítica
            critical: false,
            // Propriedades vazias (podem ser preenchidas posteriormente)
            
        },
        "pr-arb": {
            // Data planejada para saída da manutenção
            plannedExit: "2025-09-30",
            // Indica se é uma manutenção crítica
            critical: true,
            // Propriedades vazias (podem ser preenchidas posteriormente)
            
        },
        "pr-day": {
            // Data planejada para saída da manutenção
            plannedExit: "2025-09-30",
            // Indica se é uma manutenção crítica
            critical: false,
            // Propriedades vazias (podem ser preenchidas posteriormente)
           
        },
        "pr-fil": {
            // Data planejada para saída da manutenção
            plannedExit: "2025-12-01",
            // Indica se é uma manutenção crítica
            critical: true,
            // Propriedades vazias (podem ser preenchidas posteriormente)
            
        },
        "pr-eft": {
            // Data planejada para saída da manutenção
            plannedExit: "2025-10-31",
            // Indica se é uma manutenção crítica
            critical: false,
            // Propriedades vazias (podem ser preenchidas posteriormente)
            
        },
        "ps-cmc": {
            // Data planejada para saída da manutenção
            plannedExit: "2025-11-14",
            // Indica se é uma manutenção crítica
            critical: false,
            // Propriedades vazias (podem ser preenchidas posteriormente)
            
        }
    }
};

// FUNÇÃO ORIGINAL MANTIDA - compatibilidade total
// Converte uma string de data no formato ISO para objeto Date
function parseDateISO(dateString) {
    // Verifica se a string de data existe
    if (!dateString) return null;
    // Converte a string para objeto Date (adiciona horário meia-noite)
    return new Date(dateString + "T00:00:00");
}

// FUNÇÃO ORIGINAL MANTIDA - compatibilidade total  
// Calcula a diferença de dias úteis entre duas datas
function calculateDaysDifference(startDate, endDate) {
    // Verifica se ambas as datas são válidas
    if (!startDate || !endDate) return 0;//-------------->se alguma data for inválida, retorna 0
    // Inicializa o contador de dias úteis
    let count = 0;
    // Cria uma cópia da data de início para não modificar a original
    const curDate = new Date(startDate.getTime());
    // Loop através de cada dia entre startDate e endDate
    while (curDate <= endDate) {
        // Obtém o dia da semana (0=Domingo, 6=Sábado)
        const dayOfWeek = curDate.getDay();
        // Verifica se não é fim de semana
        if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
        // Avança para o próximo dia
        curDate.setDate(curDate.getDate() + 1);
    }
    // Retorna o total de dias úteis
    return count;
}

// FUNÇÃO ORIGINAL MANTIDA - compatibilidade total
// Soma o total de dias úteis de todas as manutenções
function sumBusinessDays(maintenances) {
    // Verifica se maintenances é um array válido
    if (!Array.isArray(maintenances)) return 0;
    // Usa reduce para somar os dias úteis de cada manutenção
    return maintenances.reduce((acc, m) => {
        // Converte as datas de entrada e saída
        const e = parseDateISO(m.entrada);
        const s = parseDateISO(m.saida);
        // Se alguma data for inválida, mantém o acumulador
        if (!e || !s) return acc;
        // Soma os dias úteis desta manutenção ao acumulador
        return acc + calculateDaysDifference(e, s);
    }, 0); // Valor inicial do acumulador é 0
}

// INICIALIZAÇÃO ORIGINAL MANTIDA - compatibilidade total
// Event listener que espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se a variável AIRCRAFT_DATA foi definida (vem do data.js)
    if (typeof AIRCRAFT_DATA !== 'undefined') {
        // Inicializa a aplicação com os dados carregados
        initializeWithData(AIRCRAFT_DATA);
    } else {
        // Exibe erro no console se os dados não foram carregados
        console.error('AIRCRAFT_DATA não foi carregado. Certifique-se de que data.js está incluído no HTML.');
    }
});

// FUNÇÃO ATUALIZADA MAS COMPATÍVEL
// Função principal de inicialização da aplicação
function initializeWithData(data) {
    // Armazena os dados na variável global
    aircraftData = data;
    // Constrói a interface do usuário com os dados
    buildUIFromData(aircraftData);
    
    // Para cada aeronave, gera seu calendário
    Object.keys(aircraftData).forEach((id) => {
        generateCalendar(id, aircraftData[id]);
    });
    
    // Abre a primeira aba automaticamente
    openFirstTab();
    // Atualiza a data atual no rodapé
    updateCurrentDate();
}

// FUNÇÃO NOVA - Abre primeira aba dinamicamente
// Encontra e abre a primeira aba disponível
function openFirstTab() {
    // Obtém o ID da primeira aeronave
    const firstId = Object.keys(aircraftData)[0];
    // Verifica se existe pelo menos uma aeronave
    if (firstId) {
        // Encontra o botão da primeira aba no DOM
        const firstButton = document.querySelector(
            `.tab-button[data-aircraft="${firstId}"]`
        );
        // Se o botão foi encontrado, abre a aba
        if (firstButton) {
            openTab(firstId, firstButton);
        }
    }
}

// FUNÇÃO NOVA - Atualiza data atual
// Atualiza o elemento que mostra a data atual
function updateCurrentDate() {
    // Encontra o elemento onde a data será exibida
    const el = document.getElementById("current-date");
    // Se o elemento existe, atualiza com a data formatada
    if (el) el.textContent = new Date().toLocaleDateString("pt-BR");
}

// FUNÇÃO ORIGINAL MANTIDA - compatibilidade total
// Constrói toda a interface do usuário baseada nos dados
function buildUIFromData(data) {
    // Encontra os containers das abas e conteúdos
    const tabsContainer = document.getElementById("tabs");
    const contents = document.getElementById("contents");

    // Para cada aeronave nos dados
    Object.keys(data).forEach((id) => {
        // Obtém os dados específicos desta aeronave
        const item = data[id];

        // botão da aba
        // Cria um botão para a aba
        const button = document.createElement("button");
        // Adiciona classe CSS para estilização
        button.className = "tab-button";
        // Define atributo data para identificar a aeronave
        button.setAttribute("data-aircraft", id);
        // Define o tipo do elemento como botão
        button.type = "button";
        // Adiciona o texto do botão (prefixo da aeronave ou ID)
        button.appendChild(document.createTextNode(item.prefix || id));

        // Cria o tooltip para o botão
        const tooltip = document.createElement("div");
        // Adiciona classe CSS para o tooltip
        tooltip.className = "tab-tooltip";
        // Inicializa o tooltip vazio
        tooltip.textContent = "";
        // Adiciona o tooltip ao botão
        button.appendChild(tooltip);

        // Adiciona evento de clique para abrir a aba
        button.addEventListener("click", () => openTab(id, button));
        
        // show basic tooltip info on hover - MELHORADO
        // Adiciona evento para mostrar tooltip ao passar o mouse
        button.addEventListener("mouseenter", () => {
            updateTabTooltip(button, item, id);
        });
        
        // Adiciona evento para esconder tooltip ao retirar o mouse
        button.addEventListener("mouseleave", () => {
            tooltip.textContent = "";
        });

        // Adiciona o botão ao container de abas
        tabsContainer.appendChild(button);

        // conteúdo da aba
        // Cria o container do conteúdo da aba
        const tabContent = document.createElement("div");
        // Adiciona classe CSS para o conteúdo
        tabContent.className = "tab-content";
        // Define o ID único baseado na aeronave
        tabContent.id = id;

        // Cria o título do ano
        const h2 = document.createElement("h2");
        // Adiciona classe CSS para o título
        h2.className = "year-title";
        // Define o texto do título
        h2.textContent = `${item.prefix || id} - Calendário ${
            item.year || new Date().getFullYear()
        }`;
        // Adiciona o título ao conteúdo
        tabContent.appendChild(h2);

        // Cria o parágrafo de informações
        const pInfo = document.createElement("p");
        // Adiciona classe CSS para informações
        pInfo.className = "aircraft-info";
        // Define ID único para este elemento
        pInfo.id = `${id}-info`;
        // Texto inicial de instrução
        pInfo.textContent = "Passe o mouse sobre os dias para mais informações";
        // Adiciona o parágrafo ao conteúdo
        tabContent.appendChild(pInfo);

        // area com lista de manutenções
        // Cria o container da lista de manutenções
        const maintList = document.createElement("div");
        // Adiciona classe CSS para a lista
        maintList.className = "maintenance-list";
        // Define ID único para a lista
        maintList.id = `${id}-maint-list`;
        // Adiciona a lista ao conteúdo
        tabContent.appendChild(maintList);

        // legend - ATUALIZADA DINAMICAMENTE
        // Cria a legenda do calendário
        const legend = document.createElement("div");
        // Adiciona classe CSS para a legenda
        legend.className = "legend";
        // Define o HTML da legenda de forma dinâmica
        legend.innerHTML = createLegendHTML(id);
        // Adiciona a legenda ao conteúdo
        tabContent.appendChild(legend);

        // Cria o container do calendário
        const calendarContainer = document.createElement("div");
        // Adiciona classe CSS para o container do calendário
        calendarContainer.className = "calendar-container";

        // Cria o grid dos meses
        const monthsGrid = document.createElement("div");
        // Adiciona classe CSS para o grid de meses
        monthsGrid.className = "months-grid";
        // Define ID único para o calendário
        monthsGrid.id = `${id}-calendar`;

        // Adiciona o grid ao container do calendário
        calendarContainer.appendChild(monthsGrid);
        // Adiciona o container do calendário ao conteúdo
        tabContent.appendChild(calendarContainer);

        // Adiciona o conteúdo da aba ao container principal
        contents.appendChild(tabContent);
    });
}

// FUNÇÃO NOVA - Tooltip dinâmico para abas
// Atualiza o tooltip da aba com informações dinâmicas
function updateTabTooltip(button, item, aircraftId) {
    // Encontra o elemento do tooltip dentro do botão
    const tooltip = button.querySelector('.tab-tooltip');
    // Obtém a primeira manutenção (se existir)
    const firstMaint = item.maintenances && item.maintenances[0];
    // Obtém as configurações específicas desta aeronave
    const settings = appConfig.aircraftSettings[aircraftId];
    
    // Se existe pelo menos uma manutenção
    if (firstMaint) {
        // Converte as datas de entrada e saída
        const e = parseDateISO(firstMaint.entrada);
        const s = parseDateISO(firstMaint.saida);
        // Se as datas são válidas
        if (e && s) {
            // Constrói o texto do tooltip com datas formatadas
            let tooltipText = `Entrada: ${e.toLocaleDateString("pt-BR")} | Saída: ${s.toLocaleDateString("pt-BR")}`;
            
            // ADICIONA INFO DINÂMICA - equipe se disponível
            // Se existe informação de equipe, adiciona ao tooltip
            if (settings && settings.maintenanceTeam) {
                tooltipText += ` | Equipe: ${settings.maintenanceTeam}`;
            }
            
            // ADICIONA INFO DINÂMICA - crítica se for
            // Se é uma manutenção crítica, adiciona indicador
            if (settings && settings.critical) {
                tooltipText += ` | ⚠ CRÍTICA`;
            }
            
            // Atualiza o texto do tooltip
            tooltip.textContent = tooltipText;
        }
    } else {
        // Tooltip para quando não há manutenções
        tooltip.textContent = "Sem manutenção registrada";
    }
}

// FUNÇÃO NOVA - Legenda dinâmica
// Cria o HTML da legenda baseado nas configurações da aeronave
function createLegendHTML(aircraftId) {
    // Obtém as configurações específicas desta aeronave
    const settings = appConfig.aircraftSettings[aircraftId];
    // HTML base da legenda (sempre mostra período de manutenção)
    let legendHTML = '<div class="legend-item"><div class="color-box maintenance-color"></div><span>Período de Manutenção</span></div>';
    
    // SÓ mostra legenda de atraso se a aeronave tiver data planejada
    // Se existe data planejada, adiciona legenda para dias de atraso
    if (settings && settings.plannedExit) {
        legendHTML += '<div class="legend-item"><div class="color-box delay-color"></div><span>Dias de Atraso</span></div>';
    }
    
    // ADICIONA indicador de equipe se disponível
    // Se existe informação de equipe, adiciona na legenda
    if (settings && settings.maintenanceTeam) {
        legendHTML += `<div class="legend-item" style="margin-left: auto; font-style: italic; color: #666;">Equipe: ${settings.maintenanceTeam}</div>`;
    }
    
    // Retorna o HTML completo da legenda
    return legendHTML;
}

// FUNÇÃO ORIGINAL MANTIDA - compatibilidade total
// Controla a abertura e fechamento das abas
function openTab(tabId, button) {
    // Remove a classe active de todos os conteúdos de aba
    document
        .querySelectorAll(".tab-content")
        .forEach((el) => el.classList.remove("active"));
    // Remove a classe active de todos os botões de aba
    document
        .querySelectorAll(".tab-button")
        .forEach((b) => b.classList.remove("active"));

    // Encontra o conteúdo da aba a ser aberta
    const content = document.getElementById(tabId);
    // Se o conteúdo existe, adiciona classe active
    if (content) content.classList.add("active");
    // Se o botão existe, adiciona classe active
    if (button) button.classList.add("active");

    // Atualiza as informações específicas da aeronave
    updateAircraftInfo(tabId);
}

// FUNÇÃO ATUALIZADA - Mais informações dinâmicas
// Atualiza as informações da aeronave na aba ativa
function updateAircraftInfo(aircraftId) {
    // Obtém os dados da aeronave específica
    const item = aircraftData[aircraftId];
    // Encontra os elementos de informação e lista no DOM
    const infoElement = document.getElementById(`${aircraftId}-info`);
    const listElement = document.getElementById(`${aircraftId}-maint-list`);
    // Se algum elemento não existe, retorna
    if (!item || !infoElement || !listElement) return;

    // Calcula o total de dias úteis em manutenção
    const totalDays = sumBusinessDays(item.maintenances || []);
    // Obtém as configurações específicas desta aeronave
    const settings = appConfig.aircraftSettings[aircraftId];
    
    // INFO DINÂMICA - adiciona status crítico se existir
    // String vazia para informação de criticidade
    let criticalInfo = "";
    // Se é crítica, formata a informação com cor e ícone
    if (settings && settings.critical) {
        criticalInfo = ` | <strong style="color: #d32f2f;">⚡ CRÍTICA</strong>`;
    }
    
    // Atualiza o HTML do elemento de informações
    infoElement.innerHTML = `<strong>Nome:</strong> ${
        item.name || "-"
    } | <strong>Ano:</strong> ${
        item.year || "-"
    } | <strong>Total (dias úteis):</strong> ${totalDays}${criticalInfo}`;

    // Preenche lista de manutenções - MANTIDO ORIGINAL
    // Limpa a lista anterior
    listElement.innerHTML = "";
    // Se existem manutenções e é um array não vazio
    if (Array.isArray(item.maintenances) && item.maintenances.length) {
        // Para cada manutenção na lista
        item.maintenances.forEach((m, idx) => {
            // Converte as datas de entrada e saída
            const e = parseDateISO(m.entrada);
            const s = parseDateISO(m.saida);
            // Cria o elemento da manutenção
            const li = document.createElement("div");
            // Adiciona classe CSS para o item
            li.className = "maintenance-item";
            // Define o HTML com informações formatadas
            li.innerHTML = `<strong>Manutenção ${idx + 1}:</strong> ${
                m.descricao || ""
            } <br> <strong>Entrada:</strong> ${
                e ? e.toLocaleDateString("pt-BR") : "-"
            } | <strong>Saída:</strong> ${
                s ? s.toLocaleDateString("pt-BR") : "-"
            } | <strong>Duração:</strong> ${calculateDaysDifference(
                e,
                s
            )} dias úteis`;
            // Adiciona o item à lista
            listElement.appendChild(li);
        });
    } else {
        // Mensagem quando não há manutenções
        listElement.textContent = "Nenhuma manutenção registrada.";
    }
}

// FUNÇÃO PRINCIPAL ATUALIZADA - Agora totalmente dinâmica
// Gera o calendário completo para uma aeronave
function generateCalendar(aircraftId, item) {
    // Encontra o container do calendário no DOM
    const calendarContainer = document.getElementById(`${aircraftId}-calendar`);
    // Se o container não existe, retorna
    if (!calendarContainer) return;

    // Limpa o conteúdo anterior do calendário
    calendarContainer.innerHTML = "";

    // Prepara períodos - COMPATÍVEL com data.js atual
    // Converte as manutenções para objetos com datas Date
    const periods = (item.maintenances || [])
        .map((m) => ({
            entrada: parseDateISO(m.entrada),
            saida: parseDateISO(m.saida),
            descricao: m.descricao || "",
        }))
        // Filtra apenas períodos com datas válidas
        .filter((p) => p.entrada && p.saida);

    // Determina qual ano usar no calendário
    const year = determineCalendarYear(item, periods);
    // Obtém as configurações específicas desta aeronave (ou objeto vazio)
    const settings = appConfig.aircraftSettings[aircraftId] || {};

    // Gera cada mês dinamicamente
    // Loop através dos 12 meses (0=Janeiro até 11=Dezembro)
    for (let month = 0; month < 12; month++) {
        // Cria o elemento HTML do mês
        const monthElement = createMonthElement(year, month);
        // Adiciona os dias ao mês com marcações
        addMonthDays(monthElement, year, month, periods, aircraftId, settings);
        // Adiciona o mês ao container do calendário
        calendarContainer.appendChild(monthElement);
    }

    // Atualiza a aba se estiver ativa no momento
    updateTabIfActive(aircraftId);
}

// FUNÇÃO NOVA - Determina ano do calendário dinamicamente
// Decide qual ano mostrar no calendário baseado em várias prioridades
function determineCalendarYear(item, periods) {
    return item.year || // PRIORIDADE 1: ano definido nos dados da aeronave
           (periods[0] && periods[0].entrada && periods[0].entrada.getFullYear()) || // PRIORIDADE 2: ano da primeira manutenção
           appConfig.defaultYear; // PRIORIDADE 3: ano atual
}

// FUNÇÃO NOVA - Cria elemento do mês
// Cria a estrutura HTML completa de um mês
function createMonthElement(year, month) {
    // Cria o container principal do mês
    const monthElement = document.createElement("div");
    // Adiciona classe CSS para estilização
    monthElement.className = "month";

    // Cria o elemento para o nome do mês
    const monthName = document.createElement("div");
    // Adiciona classe CSS para o nome do mês
    monthName.className = "month-name";
    // Define o texto com nome do mês por extenso
    monthName.textContent = new Date(year, month, 1).toLocaleDateString(
        appConfig.dateFormat,
        { month: "long" }
    );
    // Adiciona o nome do mês ao container
    monthElement.appendChild(monthName);

    // Cria o container para os dias da semana
    const weekdays = document.createElement("div");
    // Adiciona classe CSS para os dias da semana
    weekdays.className = "weekdays";
    // Para cada dia da semana (abreviado)
    ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].forEach((day) => {
        // Cria o elemento do dia da semana
        const dayElement = document.createElement("div");
        // Define o texto com a abreviação do dia
        dayElement.textContent = day;
        // Adiciona o dia ao container
        weekdays.appendChild(dayElement);
    });
    // Adiciona os dias da semana ao container do mês
    monthElement.appendChild(weekdays);

    // Cria o container para os dias do mês
    const daysContainer = document.createElement("div");
    // Adiciona classe CSS para os dias
    daysContainer.className = "days";
    // Adiciona o container de dias ao container do mês
    monthElement.appendChild(daysContainer);

    // Retorna o mês completo
    return monthElement;
}

// FUNÇÃO NOVA - Adiciona dias ao mês com marcações dinâmicas
// Preenche o mês com dias vazios e dias numerados com estilos
function addMonthDays(monthElement, year, month, periods, aircraftId, settings) {
    // Encontra o container dos dias dentro do mês
    const daysContainer = monthElement.querySelector('.days');
    // Calcula o primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    // Calcula o último dia do mês
    const lastDay = new Date(year, month + 1, 0);

    // Dias vazios para alinhamento
    // Cria dias vazios para preencher antes do primeiro dia do mês
    for (let i = 0; i < firstDay.getDay(); i++) {
        // Cria um dia vazio
        const emptyDay = document.createElement("div");
        // Adiciona classes CSS para dia vazio
        emptyDay.className = "day empty";
        // Adiciona o dia vazio ao container
        daysContainer.appendChild(emptyDay);
    }

    // Dias do mês
    // Loop através de todos os dias do mês
    for (let day = 1; day <= lastDay.getDate(); day++) {
        // Cria a data atual do loop
        const currentDate = new Date(year, month, day);
        // Cria o elemento HTML do dia
        const dayElement = createDayElement(day, currentDate);
        
        // Aplica estilos DINÂMICOS
        // Aplica cores e tooltips baseados em manutenções
        applyDynamicStyles(dayElement, currentDate, periods, aircraftId, settings);
        
        // Adiciona o dia ao container
        daysContainer.appendChild(dayElement);
    }
}

// FUNÇÃO NOVA - Cria elemento do dia
// Cria um elemento individual de dia do calendário
function createDayElement(dayNumber, currentDate) {
    // Cria o elemento do dia
    const dayElement = document.createElement("div");
    // Adiciona classe CSS base para o dia
    dayElement.className = "day";
    // Define o número do dia como texto
    dayElement.textContent = dayNumber;
    // Adiciona atributo data-date no formato ISO
    dayElement.setAttribute('data-date', currentDate.toISOString().split('T')[0]);
    // Retorna o dia criado
    return dayElement;
}

// FUNÇÃO CORRIGIDA - Aplica estilos dinamicamente
// Aplica classes CSS condicionais aos dias do calendário
function applyDynamicStyles(dayElement, currentDate, periods, aircraftId, settings) {
    // Obtém o dia da semana (0=Domingo até 6=Sábado)
    const dayOfWeek = currentDate.getDay();
    // Verifica se é dia útil (segunda a sexta)
    const isBusinessDay = appConfig.businessDays.includes(dayOfWeek);

    // Encontra períodos de manutenção para esta data
    // Filtra os períodos que incluem a data atual
    const matchingPeriods = periods.filter(p => 
        currentDate >= p.entrada && // Data atual é após a entrada
        currentDate <= p.saida && // Data atual é antes da saída
        isBusinessDay // E é dia útil
    );

    // Se a data está em algum período de manutenção
    if (matchingPeriods.length > 0) {
        // Pega o primeiro período que coincide
        const period = matchingPeriods[0];
        // Adiciona classe CSS para manutenção
        dayElement.classList.add("maintenance");
        
        // VERIFICA ATRASO PRIMEIRO - CORREÇÃO IMPORTANTE
        // Verifica se há atraso nesta data
        const hasDelay = checkForDelay(aircraftId, currentDate, settings);
        
        // SE HOUVER ATRASO, ADICIONA CLASSE DELAY
        // Se há atraso, adiciona classe CSS para destacar
        if (hasDelay) {
            dayElement.classList.add("delay");
        }
        
        // TOOLTIP DINÂMICO
        // Cria e adiciona o tooltip informativo
        const tooltip = createDynamicTooltip(period, aircraftId, settings, currentDate);
        dayElement.appendChild(tooltip);
    }
}

// FUNÇÃO CORRIGIDA - Verifica atraso dinamicamente
// Verifica se uma data específica representa atraso na manutenção
function checkForDelay(aircraftId, currentDate, settings) {
    // Se não existem configurações ou data planejada, não há atraso
    if (!settings || !settings.plannedExit) return false;
    
    // Converte a data planejada para objeto Date
    const plannedExit = parseDateISO(settings.plannedExit);
    // Se a conversão falhou, não há atraso
    if (!plannedExit) return false;
    
    // CORREÇÃO: Verifica se a data atual é APÓS a data planejada
    // Compara as datas para determinar atraso
    const hasDelay = currentDate > plannedExit;
    
    // Retorna true se há atraso, false caso contrário
    return hasDelay;
}

// FUNÇÃO NOVA - Cria tooltip dinâmico
// Cria tooltips contextuais para os dias do calendário
function createDynamicTooltip(period, aircraftId, settings, currentDate) {
    // Cria o elemento do tooltip
    const tooltip = document.createElement("div");
    // Adiciona classe CSS base para tooltip
    tooltip.className = "day-tooltip";
    
    // Verifica se é o último dia do período
    const isLastDay = currentDate.getTime() === period.saida.getTime();
    // Verifica se há atraso
    const hasDelay = checkForDelay(aircraftId, currentDate, settings);
    
    // Constrói o texto do tooltip baseado no status
    let tooltipText = `${aircraftData[aircraftId].prefix} - `;
    
    // Define o texto baseado no contexto
    if (hasDelay) {
        // Texto para dias de atraso
        tooltipText += `ATRASO: ${period.descricao}`;
        // Adiciona classe CSS específica para atraso
        tooltip.classList.add('delay-tooltip');
    } else if (isLastDay) {
        // Texto para último dia (conclusão)
        tooltipText += `Concluído: ${period.descricao}`;
    } else {
        // Texto para dias em andamento
        tooltipText += `Em andamento: ${period.descricao}`;
    }
    
    // INFO DINÂMICA - adiciona equipe se disponível
    // Se existe informação de equipe, adiciona ao tooltip
    if (settings && settings.maintenanceTeam) {
        tooltipText += ` | Equipe: ${settings.maintenanceTeam}`;
    }
    
    // Define o texto final do tooltip
    tooltip.textContent = tooltipText;
    // Retorna o tooltip criado
    return tooltip;
}

// FUNÇÃO NOVA - Atualiza aba se estiver ativa
// Atualiza as informações apenas se a aba estiver visível
function updateTabIfActive(aircraftId) {
    // Verifica se a aba desta aeronave está ativa
    if (document.getElementById(aircraftId).classList.contains("active")) {
        // Atualiza as informações da aeronave
        updateAircraftInfo(aircraftId);
    }
}

// ============================================================================
// FUNÇÕES DE API PARA DEIXAR AINDA MAIS DINÂMICO - Opcionais
// ============================================================================

// FUNÇÃO NOVA - Adiciona manutenção dinamicamente (para uso futuro)