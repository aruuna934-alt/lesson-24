const currentDisplay = document.getElementById('current');
const previousDisplay = document.getElementById('previous');
const historyList = document.getElementById('historyList');
const historySidebar = document.getElementById('historySidebar');
const advancedPanel = document.getElementById('advancedPanel');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

// Тарых панелин ачуу / жабуу
function toggleHistory() {
    historySidebar.classList.toggle('open');
}

// Инженердик панелди ачуу / жабуу
function toggleAdvanced() {
    advancedPanel.classList.toggle('open');
}

function appendNumber(number) {
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        if (number === '.' && currentInput.includes('.')) return;
        if (shouldResetDisplay) {
            currentInput = number;
            shouldResetDisplay = false;
        } else {
            currentInput += number;
        }
    }
    updateDisplay();
}

function appendOperator(op) {
    if (operator !== null) calculate();
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    updateDisplay();
}

function deleteNumber() {
    if (currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// ТАМЫР АСТЫНАН ЧЫГАРУУ ФУНКЦИЯСЫ
function calculateSquareRoot() {
    const value = parseFloat(currentInput);
    if (value < 0) {
        currentInput = "Ката";
    } else {
        const result = Math.sqrt(value);
        addHistoryItem(`√(${value})`, result);
        currentInput = result.toString();
    }
    shouldResetDisplay = true;
    updateDisplay();
}

// КВАДРАТКА КӨТӨРҮҮ ФУНКЦИЯСЫ
function calculateSquare() {
    const value = parseFloat(currentInput);
    const result = value * value;
    addHistoryItem(`(${value})²`, result);
    currentInput = result.toString();
    shouldResetDisplay = true;
    updateDisplay();
}

function calculate() {
    if (operator === null || shouldResetDisplay) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    let opSymbol = operator;
    if (operator === '*') opSymbol = '×';
    if (operator === '/') opSymbol = '÷';

    switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/': 
            if (current === 0) { result = "Ката"; } else { result = prev / current; } 
            break;
        case '%': 
            result = (prev / 100) * current; 
            opSymbol = '%';
            break;
        default: return;
    }

    if (result !== "Ката") {
        addHistoryItem(`${previousInput} ${opSymbol} ${currentInput}`, result);
    }

    currentInput = result.toString();
    operator = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}

function updateDisplay() {
    currentDisplay.innerText = currentInput;
    if (operator != null) {
        let opSymbol = operator;
        if (operator === '*') opSymbol = '×';
        if (operator === '/') opSymbol = '÷';
        previousDisplay.innerText = `${previousInput} ${opSymbol}`;
    } else {
        previousDisplay.innerText = '';
    }
}

function addHistoryItem(expression, result) {
    const emptyMsg = document.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.remove();

    const item = document.createElement('div');
    item.classList.add('history-item');
    item.innerHTML = `
        <div class="expr">${expression} =</div>
        <div class="res">${result}</div>
    `;
    historyList.insertBefore(item, historyList.firstChild);
}

function clearHistory() {
    historyList.innerHTML = '<p class="empty-msg">Азырынча тарых жок...</p>';
}