// script.js - gera abas e calendários dinamicamente (suporta múltiplas manutenções)
// VERSÃO 2.0 - Dinâmica e compatível com data.js atual

// armazenamento global dos dados das aeronaves (preenchido por initializeWithData)
let aircraftData = {}; // Variável que vai armazenar todos os dados das aeronaves

// CONFIGURAÇÕES GLOBAIS E POR AERONAVE
const appConfig = { // Objeto de configuração da aplicação
    defaultYear: new Date().getFullYear(), // ano padrão para calendário (ano atual)
    dateFormat: 'pt-BR',                    // formato de exibição de mês (português Brasil)
    businessDays: [1, 2, 3, 4, 5],         // dias úteis (1=Seg ... 5=Sex) - array com números dos dias
    // configurações específicas por prefixo de aeronave
    aircraftSettings: { // Objeto com configurações individuais para cada aeronave
        "pp-fcf": {
            plannedExit: "2025-09-12", // data planejada de saída (string ISO) - formato YYYY-MM-DD
            critical: false,           // flag crítica - indica se a aeronave é crítica
        },
        "pr-msz": {
            plannedExit: "2025-08-29",
            critical: false,           // false = não crítica, true = crítica
        },
        "pp-emo": {
            plannedExit: "2025-08-29",
            critical: false,
        },
        "ps-ece": {
            plannedExit: "2025-08-27",
            critical: false,
        },
        "pr-rex": {
            plannedExit: "2025-08-14",
            critical: false,
        },
        "pr-arb": {
            plannedExit: "2025-09-30",
            critical: true,            // true = esta aeronave é marcada como crítica
        },
        "pr-day": {
            plannedExit: "2025-09-30",
            critical: false,
        },
        "pr-fil": {
            plannedExit: "2025-12-01",
            critical: false,
        },
        "pr-eft": {
            plannedExit: "2025-10-31",
            critical: false,
        },
        "ps-cmc": {
            plannedExit: "2025-11-14",
            critical: false,
        },
        "pp-nld": {
            plannedExit: "2025-12-12",
            critical: false,
        },
        "pp-lja": {
            plannedExit: "2025-12-20",
            critical: false,
        }
    },
};

// converte string "YYYY-MM-DD" para Date em meia-noite (compatível com data.js)
function parseDateISO(dateString) { // Função para converter string em objeto Date
    if (!dateString) return null; // evita erro se vazio - retorna null se não houver data
    return new Date(dateString + "T00:00:00"); // Cria objeto Date adicionando horário meia-noite
}

// conta dias úteis entre startDate e endDate inclusive (ignora Sáb/Dom)
function calculateDaysDifference(startDate, endDate) { // Calcula diferença em dias úteis
    if (!startDate || !endDate) return 0; // Retorna 0 se datas forem inválidas
    let count = 0; // Contador de dias úteis
    const curDate = new Date(startDate.getTime()); // copia para iterar - cria cópia da data inicial
    while (curDate <= endDate) { // Loop enquanto data atual for menor ou igual à data final
        const dayOfWeek = curDate.getDay(); // Obtém dia da semana (0=Dom, 1=Seg, ..., 6=Sáb)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) count++; // incrementa se for dia útil (não sábado nem domingo)
        curDate.setDate(curDate.getDate() + 1); // próximo dia - avança um dia
    }
    return count; // Retorna total de dias úteis
}

// soma dias úteis de um array de manutenções [{entrada, saida}, ...]
function sumBusinessDays(maintenances) { // Soma dias úteis de múltiplas manutenções
    if (!Array.isArray(maintenances)) return 0; // Retorna 0 se não for array
    return maintenances.reduce((acc, m) => { // Reduce para somar todos os dias
        const e = parseDateISO(m.entrada); // Converte data de entrada para Date
        const s = parseDateISO(m.saida);   // Converte data de saída para Date
        if (!e || !s) return acc; // pula entradas inválidas - mantém acumulador se datas inválidas
        return acc + calculateDaysDifference(e, s); // Soma dias úteis ao acumulador
    }, 0); // Valor inicial do acumulador é 0
}

// inicializa quando DOM estiver pronto - espera que AIRCRAFT_DATA exista (data.js)
document.addEventListener('DOMContentLoaded', () => { // Evento disparado quando página carrega
    if (typeof AIRCRAFT_DATA !== 'undefined') { // Verifica se variável global AIRCRAFT_DATA existe
        initializeWithData(AIRCRAFT_DATA); // carrega dados e constrói UI - inicia aplicação
    } else {
        console.error('AIRCRAFT_DATA não foi carregado. Certifique-se de que data.js está incluído no HTML.'); // Mensagem de erro
    }
});

// inicializa variáveis locais e gera UI + calendários
function initializeWithData(data) { // Função principal de inicialização
    aircraftData = data;               // salva dados globalmente - armazena dados na variável global
    buildUIFromData(aircraftData);     // cria abas e containers HTML - constrói interface

    // gera calendários para cada aeronave
    Object.keys(aircraftData).forEach((id) => { // Para cada aeronave nos dados
        generateCalendar(id, aircraftData[id]); // Gera calendário individual
    });

    // abre a primeira aba automaticamente
    openFirstTab(); // Abre primeira aba disponível
    updateCurrentDate(); // atualiza campo que mostra a data atual (se existir)
}

// abre a primeira aba disponível (se houver)
function openFirstTab() { // Função para abrir primeira aba
    const firstId = Object.keys(aircraftData)[0]; // Pega ID da primeira aeronave
    if (firstId) { // Se existe pelo menos uma aeronave
        const firstButton = document.querySelector(`.tab-button[data-aircraft="${firstId}"]`); // Encontra botão correspondente
        if (firstButton) { // Se botão existe
            openTab(firstId, firstButton); // Abre a aba
        }
    }
}

// atualiza elemento com id "current-date" para data atual formatada
function updateCurrentDate() { // Atualiza data no rodapé
    const el = document.getElementById("current-date"); // Encontra elemento da data
    if (el) el.textContent = new Date().toLocaleDateString("pt-BR"); // Se existe, atualiza com data formatada
}

// constrói a interface de abas e conteúdos a partir dos dados
function buildUIFromData(data) { // Constrói toda a interface do zero
    const tabsContainer = document.getElementById("tabs");   // container das abas (scrollable)
    const contents = document.getElementById("contents");    // container dos conteúdos/ calendários

    // cria (ou recupera) wrapper para as abas, que conterá a seta à direita
    let tabsWrapper = document.getElementById('tabs-wrapper'); // Tenta encontrar wrapper existente
    if (!tabsWrapper) { // Se não existe
        tabsWrapper = document.createElement('div'); // Cria novo elemento div
        tabsWrapper.id = 'tabs-wrapper'; // Define ID
        tabsWrapper.className = 'tabs-wrapper'; // Define classe CSS
        // mais adições abaixo
    }

    // cria botão de navegação (seta direita) se não existir
    let arrowRight = document.getElementById('tabs-arrow-right'); // Tenta encontrar seta existente
    if (!arrowRight) { // Se não existe
        arrowRight = document.createElement('button'); // Cria botão
        arrowRight.id = 'tabs-arrow-right'; // Define ID
        arrowRight.className = 'tabs-arrow right'; // Define classes CSS
        arrowRight.type = 'button'; // Define tipo do botão
        arrowRight.setAttribute('aria-label', 'Mostrar mais aeronaves'); // Acessibilidade
        arrowRight.innerHTML = '>';                       // símbolo simples para a seta
        arrowRight.addEventListener('click', () => scrollTabs(1)); // ao clicar rola para a direita - adiciona evento de clique
    }

    // limpa conteúdo antigo antes de reconstruir
    tabsContainer.innerHTML = ''; // Limpa conteúdo das abas
    contents.innerHTML = ''; // Limpa conteúdo dos painéis

    // se ainda não estiver aninhado, insere wrapper no DOM e anexa tabs + seta
    if (!tabsContainer.parentElement || tabsContainer.parentElement.id !== 'tabs-wrapper') { // Verifica se precisa reorganizar DOM
        const parent = tabsContainer.parentElement || document.body; // Encontra elemento pai
        parent.insertBefore(tabsWrapper, tabsContainer); // Insere wrapper antes das abas
        tabsWrapper.appendChild(tabsContainer); // coloca as abas dentro do wrapper - move abas para dentro do wrapper
        tabsWrapper.appendChild(arrowRight);   // seta à direita do container - adiciona seta ao wrapper
    }

    // para cada aeronave nos dados, cria botão de aba e painel de conteúdo
    Object.keys(data).forEach((id) => { // Para cada aeronave
        const item = data[id]; // Dados da aeronave atual

        // botão da aba
        const button = document.createElement("button"); // Cria elemento botão
        button.className = "tab-button"; // Define classe CSS
        button.setAttribute("data-aircraft", id); // Define atributo data com ID da aeronave
        button.type = "button"; // Define tipo do botão
        button.appendChild(document.createTextNode(item.prefix || id)); // texto do botão = prefixo ou id - adiciona texto

        const tooltip = document.createElement("div"); // Cria elemento para tooltip
        tooltip.className = "tab-tooltip"; // Define classe CSS
        tooltip.textContent = ""; // preenchido em mouseenter - inicia vazio
        button.appendChild(tooltip); // Adiciona tooltip ao botão

        button.addEventListener("click", () => openTab(id, button)); // abre aba ao clicar - adiciona evento de clique

        // mostra resumo no tooltip ao passar o mouse
        button.addEventListener("mouseenter", () => { // Quando mouse entra no botão
            updateTabTooltip(button, item, id); // Atualiza tooltip
        });

        button.addEventListener("mouseleave", () => { // Quando mouse sai do botão
            tooltip.textContent = ""; // limpa tooltip ao sair
        });

        tabsContainer.appendChild(button); // adiciona o botão à linha de abas

        // CONTEÚDO da aba (painel com calendário, lista de manutenções, legenda)
        const tabContent = document.createElement("div"); // Cria container do conteúdo
        tabContent.className = "tab-content"; // Define classe CSS
        tabContent.id = id; // Define ID igual ao da aeronave

        const h2 = document.createElement("h2"); // Cria título
        h2.className = "year-title"; // Define classe CSS
        h2.textContent = `${item.prefix || id} - Calendário ${item.year || new Date().getFullYear()}`; // Texto do título
        tabContent.appendChild(h2); // Adiciona título ao conteúdo

        const pInfo = document.createElement("p"); // Cria parágrafo de informações
        pInfo.className = "aircraft-info"; // Define classe CSS
        pInfo.id = `${id}-info`; // Define ID único
        pInfo.textContent = "Passe o mouse sobre os dias para mais informações"; // Texto inicial
        tabContent.appendChild(pInfo); // Adiciona ao conteúdo

        // área que lista manutenções detalhadas
        const maintList = document.createElement("div"); // Cria container da lista
        maintList.className = "maintenance-list"; // Define classe CSS
        maintList.id = `${id}-maint-list`; // Define ID único
        tabContent.appendChild(maintList); // Adiciona ao conteúdo

        // legenda dinâmica (criada por createLegendHTML)
        const legend = document.createElement("div"); // Cria container da legenda
        legend.className = "legend"; // Define classe CSS
        legend.innerHTML = createLegendHTML(id); // Preenche com HTML da legenda
        tabContent.appendChild(legend); // Adiciona ao conteúdo

        // container do calendário (12 meses)
        const calendarContainer = document.createElement("div"); // Cria container do calendário
        calendarContainer.className = "calendar-container"; // Define classe CSS

        const monthsGrid = document.createElement("div"); // Cria grade de meses
        monthsGrid.className = "months-grid"; // Define classe CSS
        monthsGrid.id = `${id}-calendar`; // Define ID único

        calendarContainer.appendChild(monthsGrid); // Adiciona grade ao container
        tabContent.appendChild(calendarContainer); // Adiciona container ao conteúdo

        // anexa painel ao container de conteúdos
        contents.appendChild(tabContent); // Adiciona conteúdo completo ao container principal
    });

    // atualiza visibilidade da seta quando houver scroll no container de abas
    tabsContainer.addEventListener('scroll', updateArrowVisibility); // Adiciona listener de scroll
    // pequena espera para garantir que layout esteja pronto antes de verificar
    setTimeout(updateArrowVisibility, 50); // Aguarda 50ms e verifica visibilidade da seta
}

// monta texto resumo para tooltip da aba (entrada/saída, equipe, crítica)
function updateTabTooltip(button, item, aircraftId) { // Atualiza tooltip da aba
    const tooltip = button.querySelector('.tab-tooltip'); // Encontra elemento do tooltip
    const firstMaint = item.maintenances && item.maintenances[0]; // Pega primeira manutenção
    const settings = appConfig.aircraftSettings[aircraftId]; // Pega configurações específicas

    if (firstMaint) { // Se existe manutenção
        const e = parseDateISO(firstMaint.entrada); // Converte data de entrada
        const s = parseDateISO(firstMaint.saida); // Converte data de saída
        if (e && s) { // Se datas são válidas
            let tooltipText = `Entrada: ${e.toLocaleDateString("pt-BR")} | Saída: ${s.toLocaleDateString("pt-BR")}`; // Texto base

            // adiciona equipe se configurada
            if (settings && settings.maintenanceTeam) { // Se tem equipe definida
                tooltipText += ` | Equipe: ${settings.maintenanceTeam}`; // Adiciona equipe
            }

            // indica crítica se for o caso
            if (settings && settings.critical) { // Se é crítica
                tooltipText += ` | ⚠ CRÍTICA`; // Adiciona indicador
            }

            tooltip.textContent = tooltipText; // Aplica texto ao tooltip
        }
    } else {
        tooltip.textContent = "Sem manutenção registrada"; // Mensagem padrão
    }
}

// cria HTML da legenda com base nas configurações da aeronave
function createLegendHTML(aircraftId) { // Gera HTML da legenda
    const settings = appConfig.aircraftSettings[aircraftId]; // Pega configurações
    let legendHTML = '<div class="legend-item"><div class="color-box maintenance-color"></div><span>Período de Manutenção</span></div>'; // HTML base

    // só mostra item de atraso se houver plannedExit
    if (settings && settings.plannedExit) { // Se tem data planejada
        legendHTML += '<div class="legend-item"><div class="color-box delay-color"></div><span>Dias de Atraso</span></div>'; // Adiciona item de atraso
    }

    // mostra equipe se disponível
    if (settings && settings.maintenanceTeam) { // Se tem equipe definida
        legendHTML += `<div class="legend-item" style="margin-left: auto; font-style: italic; color: #666;">Equipe: ${settings.maintenanceTeam}</div>`; // Adiciona equipe
    }

    return legendHTML; // Retorna HTML completo
}

// abre aba: oculta todas e ativa apenas a selecionada; atualiza info
function openTab(tabId, button) { // Função para abrir aba
    document.querySelectorAll(".tab-content").forEach((el) => el.classList.remove("active")); // Remove active de todos os conteúdos
    document.querySelectorAll(".tab-button").forEach((b) => b.classList.remove("active")); // Remove active de todos os botões

    const content = document.getElementById(tabId); // Encontra conteúdo da aba
    if (content) content.classList.add("active"); // Se existe, adiciona classe active
    if (button) button.classList.add("active"); // Se botão existe, adiciona classe active

    updateAircraftInfo(tabId); // Atualiza informações da aeronave
}

// atualiza painel de info da aeronave (nome, ano, total dias úteis, lista de manutenções)
function updateAircraftInfo(aircraftId) { // Atualiza informações da aeronave
    const item = aircraftData[aircraftId]; // Dados da aeronave
    const infoElement = document.getElementById(`${aircraftId}-info`); // Elemento de info
    const listElement = document.getElementById(`${aircraftId}-maint-list`); // Elemento da lista
    if (!item || !infoElement || !listElement) return; // Se algo não existe, retorna

    const totalDays = sumBusinessDays(item.maintenances || []); // Calcula total de dias úteis
    const settings = appConfig.aircraftSettings[aircraftId]; // Configurações específicas

    // indica crítico se configurado
    let criticalInfo = ""; // Inicia vazio
    if (settings && settings.critical) { // Se é crítica
        criticalInfo = ` | <strong style="color: #d32f2f;">⚡ CRÍTICA</strong>`; // Adiciona indicador
    }

    infoElement.innerHTML = `<strong>Nome:</strong> ${item.name || "-"} | <strong>Ano:</strong> ${item.year || "-"} | <strong>Total (dias úteis):</strong> ${totalDays}${criticalInfo}`; // Atualiza HTML

    // popula lista de manutenções
    listElement.innerHTML = ""; // Limpa lista
    if (Array.isArray(item.maintenances) && item.maintenances.length) { // Se tem manutenções
        item.maintenances.forEach((m, idx) => { // Para cada manutenção
            const e = parseDateISO(m.entrada); // Converte entrada
            const s = parseDateISO(m.saida); // Converte saída
            const li = document.createElement("div"); // Cria elemento
            li.className = "maintenance-item"; // Define classe
            li.innerHTML = `<strong>Manutenção ${idx + 1}:</strong> ${m.descricao || ""} <br> <strong>Entrada:</strong> ${e ? e.toLocaleDateString("pt-BR") : "-"} | <strong>Saída:</strong> ${s ? s.toLocaleDateString("pt-BR") : "-"} | <strong>Duração:</strong> ${calculateDaysDifference(e, s)} dias úteis`; // Conteúdo HTML
            listElement.appendChild(li); // Adiciona à lista
        });
    } else {
        listElement.textContent = "Nenhuma manutenção registrada."; // Mensagem padrão
    }
}

// gera calendário (12 meses) para uma aeronave e marca períodos de manutenção
function generateCalendar(aircraftId, item) { // Gera calendário completo
    const calendarContainer = document.getElementById(`${aircraftId}-calendar`); // Encontra container
    if (!calendarContainer) return; // Se não existe, retorna

    calendarContainer.innerHTML = ""; // Limpa conteúdo anterior

    // prepara períodos válidos (Date objects)
    const periods = (item.maintenances || []).map((m) => ({ // Converte manutenções para objetos Date
        entrada: parseDateISO(m.entrada), // Data de entrada
        saida: parseDateISO(m.saida), // Data de saída
        descricao: m.descricao || "", // Descrição
    }))
        .filter((p) => p.entrada && p.saida); // remove períodos inválidos - filtra datas inválidas

    const year = determineCalendarYear(item, periods); // decide ano a usar
    const settings = appConfig.aircraftSettings[aircraftId] || {}; // Configurações ou objeto vazio

    // cria meses do ano
    for (let month = 0; month < 12; month++) { // Para cada mês (0=Jan, 11=Dez)
        const monthElement = createMonthElement(year, month); // Cria elemento do mês
        addMonthDays(monthElement, year, month, periods, aircraftId, settings); // Adiciona dias
        calendarContainer.appendChild(monthElement); // Adiciona mês ao calendário
    }

    updateTabIfActive(aircraftId); // se aba ativa, atualiza informações exibidas
}

// determina qual ano usar no calendário (prioriza item.year, depois primeira manutenção, senão default)
function determineCalendarYear(item, periods) { // Decide qual ano mostrar
    return item.year || // Usa ano definido nos dados
        (periods[0] && periods[0].entrada && periods[0].entrada.getFullYear()) || // Ou ano da primeira manutenção
        appConfig.defaultYear; // Ou ano padrão
}

// cria DOM base do mês (nome + cabeçalho dos dias + container de dias)
function createMonthElement(year, month) { // Cria estrutura base do mês
    const monthElement = document.createElement("div"); // Cria container do mês
    monthElement.className = "month"; // Define classe

    const monthName = document.createElement("div"); // Cria elemento do nome
    monthName.className = "month-name"; // Define classe
    monthName.textContent = new Date(year, month, 1).toLocaleDateString( // Formata nome do mês
        appConfig.dateFormat, // Usa formato configurado
        { month: "long" } // Nome completo do mês
    );
    monthElement.appendChild(monthName); // Adiciona nome ao mês

    const weekdays = document.createElement("div"); // Cria container dos dias da semana
    weekdays.className = "weekdays"; // Define classe
    ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].forEach((day) => { // Para cada dia
        const dayElement = document.createElement("div"); // Cria elemento do dia
        dayElement.textContent = day; // Define texto
        weekdays.appendChild(dayElement); // Adiciona ao container
    });
    monthElement.appendChild(weekdays); // Adiciona dias da semana ao mês

    const daysContainer = document.createElement("div"); // Cria container dos dias
    daysContainer.className = "days"; // Define classe
    monthElement.appendChild(daysContainer); // Adiciona ao mês

    return monthElement; // Retorna mês completo
}

// popula um mês com os dias e aplica marcações dinâmicas
function addMonthDays(monthElement, year, month, periods, aircraftId, settings) { // Adiciona dias ao mês
    const daysContainer = monthElement.querySelector('.days'); // Encontra container dos dias
    const firstDay = new Date(year, month, 1); // Primeiro dia do mês
    const lastDay = new Date(year, month + 1, 0); // Último dia do mês

    // adiciona dias vazios para alinhar o primeiro dia da semana
    for (let i = 0; i < firstDay.getDay(); i++) { // Para cada dia antes do primeiro
        const emptyDay = document.createElement("div"); // Cria dia vazio
        emptyDay.className = "day empty"; // Define classe
        daysContainer.appendChild(emptyDay); // Adiciona ao container
    }

    // cria cada dia do mês
    for (let day = 1; day <= lastDay.getDate(); day++) { // Para cada dia do mês
        const currentDate = new Date(year, month, day); // Cria data atual
        const dayElement = createDayElement(day, currentDate); // Cria elemento do dia

        // aplica classes/tooltip se estiver em período de manutenção
        applyDynamicStyles(dayElement, currentDate, periods, aircraftId, settings); // Aplica estilos

        daysContainer.appendChild(dayElement); // Adiciona dia ao container
    }
}

// cria elemento DOM de um dia (com data em data-date)
function createDayElement(dayNumber, currentDate) { // Cria elemento de um dia
    const dayElement = document.createElement("div"); // Cria elemento
    dayElement.className = "day"; // Define classe
    dayElement.textContent = dayNumber; // Define número do dia
    dayElement.setAttribute('data-date', currentDate.toISOString().split('T')[0]); // YYYY-MM-DD - atributo com data
    return dayElement; // Retorna elemento
}

// aplica classes CSS e tooltip para dias dentro de período de manutenção
function applyDynamicStyles(dayElement, currentDate, periods, aircraftId, settings) { // Aplica estilos ao dia
    const dayOfWeek = currentDate.getDay(); // Dia da semana (0-6)
    const isBusinessDay = appConfig.businessDays.includes(dayOfWeek); // verifica se é dia útil

    // filtra períodos que cobrem a data atual e que ocorram em dia útil
    const matchingPeriods = periods.filter(p => // Filtra períodos
        currentDate >= p.entrada && // Data depois ou igual à entrada
        currentDate <= p.saida && // Data antes ou igual à saída
        isBusinessDay // E é dia útil
    );

    if (matchingPeriods.length > 0) { // Se está em período de manutenção
        const period = matchingPeriods[0]; // Pega primeiro período (prioridade)
        dayElement.classList.add("maintenance"); // marca período de manutenção - adiciona classe CSS

        // checa se existe atraso (data do dia > plannedExit)
        const hasDelay = checkForDelay(aircraftId, currentDate, settings); // Verifica atraso

        if (hasDelay) {
            dayElement.classList.add("delay"); // adiciona classe de atraso
        }

        // cria e anexa tooltip do dia com descrição/detalhes
        const tooltip = createDynamicTooltip(period, aircraftId, settings, currentDate); // Cria tooltip
        dayElement.appendChild(tooltip); // Adiciona tooltip ao dia
    }
}

// verifica se a data corrente está após a data planejada de saída (atraso)
function checkForDelay(aircraftId, currentDate, settings) { // Verifica se há atraso
    if (!settings || !settings.plannedExit) return false; // Se não tem configuração, retorna false

    const plannedExit = parseDateISO(settings.plannedExit); // Converte data planejada
    if (!plannedExit) return false; // Se conversão falhou, retorna false

    // true se a data do dia for maior que a data planejada (após)
    const hasDelay = currentDate > plannedExit; // Compara datas

    return hasDelay; // Retorna resultado
}

// constrói tooltip para um dia descrevendo estado (em andamento / concluído / atraso)
function createDynamicTooltip(period, aircraftId, settings, currentDate) { // Cria tooltip do dia
    const tooltip = document.createElement("div"); // Cria elemento
    tooltip.className = "day-tooltip"; // Define classe

    const isLastDay = currentDate.getTime() === period.saida.getTime(); // fim do período - compara timestamps
    const hasDelay = checkForDelay(aircraftId, currentDate, settings); // Verifica atraso

    let tooltipText = `${aircraftData[aircraftId].prefix} - `; // Texto base com prefixo

    if (hasDelay) { // Se tem atraso
        tooltipText += `ATRASO: ${period.descricao}`; // Adiciona "ATRASO"
        tooltip.classList.add('delay-tooltip'); // estilo diferenciado - classe especial
    } else if (isLastDay) { // Se é último dia
        tooltipText += `Concluído: ${period.descricao}`; // Adiciona "Concluído"
    } else {
        tooltipText += `Em andamento: ${period.descricao}`; // Adiciona "Em andamento"
    }

    // adiciona info de equipe se houver
    if (settings && settings.maintenanceTeam) { // Se tem equipe
        tooltipText += ` | Equipe: ${settings.maintenanceTeam}`; // Adiciona equipe
    }

    tooltip.textContent = tooltipText; // Define texto
    return tooltip; // Retorna tooltip
}

// atualiza painel ativo se a aba correspondente estiver visível (ativa)
function updateTabIfActive(aircraftId) { // Atualiza se estiver ativa
    if (document.getElementById(aircraftId).classList.contains("active")) { // Se aba está ativa
        updateAircraftInfo(aircraftId); // Atualiza informações
    }
}

// ============================================================================
// FUNÇÕES DE API - permitem alterar dados dinamicamente em runtime
// ============================================================================

// adiciona manutenção a uma aeronave e atualiza visual
function addMaintenance(aircraftId, maintenanceData) { // API: adiciona manutenção
    if (!aircraftData[aircraftId].maintenances) { // Se não existe array
        aircraftData[aircraftId].maintenances = []; // Cria array vazio
    }

    aircraftData[aircraftId].maintenances.push({ // Adiciona nova manutenção
        entrada: maintenanceData.entrada, // Data de entrada
        saida: maintenanceData.saida, // Data de saída
        descricao: maintenanceData.descricao || '', // Descrição
        ...maintenanceData // Spread operator para outras propriedades
    });

    // re-render do calendário e info
    generateCalendar(aircraftId, aircraftData[aircraftId]); // Regenera calendário
    updateAircraftInfo(aircraftId); // Atualiza informações
}

// atualiza configurações de aeronave (plannedExit, critical, maintenanceTeam, etc.)
function updateAircraftConfig(aircraftId, newConfig) { // API: atualiza configurações
    appConfig.aircraftSettings[aircraftId] = { // Atualiza configurações
        ...appConfig.aircraftSettings[aircraftId], // Mantém configurações existentes
        ...newConfig // Sobrescreve com novas
    };
    generateCalendar(aircraftId, aircraftData[aircraftId]); // re-render - atualiza visual
}

// recarrega dados completos (substitui aircraftData)
function reloadAircraftData(newData) { // API: recarrega todos os dados
    aircraftData = newData; // Substitui dados
    document.getElementById("tabs").innerHTML = ""; // Limpa abas
    document.getElementById("contents").innerHTML = ""; // Limpa conteúdos
    initializeWithData(aircraftData); // Reinicializa
}

// scroll das abas: direction 1 => direita, -1 => esquerda
function scrollTabs(direction) { // Função de scroll das abas
    const tabsContainer = document.getElementById('tabs'); // Container das abas
    if (!tabsContainer) return; // Se não existe, retorna
    const scrollAmount = Math.max(tabsContainer.clientWidth * 0.6, 150); // distância de scroll - calcula quantidade
    // calcula nova posição com base na direção
    const newPos = tabsContainer.scrollLeft + (direction > 0 ? scrollAmount : -scrollAmount); // Nova posição
    tabsContainer.scrollTo({ left: newPos, behavior: 'smooth' }); // rolagem suave - animação
}

// atualiza visibilidade da seta direita dependendo do overflow
function updateArrowVisibility() { // Controla visibilidade da seta
    const tabsContainer = document.getElementById('tabs'); // Container
    const right = document.getElementById('tabs-arrow-right'); // Seta direita
    if (!tabsContainer || !right) return; // Se não existem, retorna

    const maxScroll = tabsContainer.scrollWidth - tabsContainer.clientWidth; // Calcula scroll máximo
    // se não houver espaço extra à direita, oculta a seta
    if (maxScroll <= 5 || tabsContainer.scrollLeft >= maxScroll - 5) { // Se chegou ao fim
        right.style.visibility = 'hidden'; // Esconde seta
    } else {
        right.style.visibility = 'visible'; // Mostra seta
    }
}