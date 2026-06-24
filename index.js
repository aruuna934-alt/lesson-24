const currentDisplay = document.getElementById('current');
const previousDisplay = document.getElementById('previous');
const historyList = document.getElementById('historyList');
const historySidebar = document.getElementById('historySidebar');
const advancedPanel = document.getElementById('advancedPanel');
const wrapper = document.querySelector('.calculator-wrapper');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

// 1. ӨТМӨКТӨРДҮ КОТОРУШТУРУУ
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    if (tabName === 'calc') {
        document.querySelector('button[onclick="switchTab(\'calc\')"]').classList.add('active');
        document.getElementById('calcTab').classList.add('active');
    } else {
        document.querySelector('button[onclick="switchTab(\'currency\')"]').classList.add('active');
        document.getElementById('currencyTab').classList.add('active');
        convertCurrency(); // Өткөндө дароо эсептейт
    }
}

// 2. ВАЛЮТА КОНВЕРТЕР ЛОГИКАСЫ (Биздин сомго карата бекитилген заманбап курстар)
const exchangeRates = {
    KGS: 1,
    USD: 87.50, // 1 доллар = 87.5 сом
    RUB: 0.95,  // 1 рубль = 0.95 сом
    EUR: 95.20  // 1 евро = 95.2 сом
};

function convertCurrency() {
    const amount = parseFloat(document.getElementById('currencyAmount').value);
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    
    if (isNaN(amount) || amount <= 0) {
        document.getElementById('convertedResult').innerText = "0.00";
        return;
    }

    // Алгач каалаган валютаны Сомго айлантабыз, андан кийин максаттуу валютага бөлүп чыгарабыз
    const amountInKGS = amount * exchangeRates[from];
    const finalResult = amountInKGS / exchangeRates[to];

    // Натыйжаны экранга чыгаруу (чекиттен кийин 2 сан менен)
    document.getElementById('convertedResult').innerText = finalResult.toFixed(2);
    document.getElementById('resultCurrencyName').innerText = to;
}

// Өйдөдөгү жана ылдыйдагы валюталардын ордун алмаштыруу баскычы
function swapCurrencies() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    
    convertCurrency();
}

// 3. КАЛЬКУЛЯТОР ФУНКЦИЯЛАРЫ
function toggleHistory() {
    historySidebar.classList.toggle('open');
    wrapper.classList.toggle('has-history');
}

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

function clearDisplay() { currentInput = '0'; previousInput = ''; operator = null; updateDisplay(); }
function deleteNumber() { currentInput = currentInput.length === 1 ? '0' : currentInput.slice(0, -1); updateDisplay(); }

function calculateSquareRoot() {
    const value = parseFloat(currentInput);
    if (value < 0) { currentInput = "Ката"; } else {
        const result = Math.sqrt(value);
        addHistoryItem(`√(${value})`, result);
        currentInput = result.toString();
    }
    shouldResetDisplay = true;
    updateDisplay();
}

function calculateSquare() {
    const value = parseFloat(currentInput);
    const result = value * value;
    addHistoryItem(`( ${value} )²`, result);
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
        case '/': result = current === 0 ? "Ката" : prev / current; break;
        case '%': result = (prev / 100) * current; opSymbol = '%'; break;
        default: return;
    }

    if (result !== "Ката") addHistoryItem(`${previousInput} ${opSymbol} ${currentInput}`, result);
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
    } else { previousDisplay.innerText = ''; }
}

function addHistoryItem(expression, result) {
    const emptyMsg = document.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.remove();
    const item = document.createElement('div');
    item.classList.add('history-item');
    item.innerHTML = `<div class="expr">${expression} =</div><div class="res">${result}</div>`;
    historyList.insertBefore(item, historyList.firstChild);
}

function clearHistory() { historyList.innerHTML = '<p class="empty-msg">Азырынча тарых жок...</p>'; }