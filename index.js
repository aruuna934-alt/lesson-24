const currentDisplay = document.getElementById('current');
const previousDisplay = document.getElementById('previous');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

// Сандарды жана чекитти экранга кошуу
function appendNumber(number) {
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        if (number === '.' && currentInput.includes('.')) return; // Эки жолу чекит койдурбайт
        if (shouldResetDisplay) {
            currentInput = number;
            shouldResetDisplay = false;
        } else {
            currentInput += number;
        }
    }
    updateDisplay();
}

// Операторлорду тандоо (+, -, *, /)
function appendOperator(op) {
    if (operator !== null) calculate();
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
    updateDisplay();
}

// Экранды толук тазалоо (C)
function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    updateDisplay();
}

// Акыркы бир санды өчүрүү (DEL)
function deleteNumber() {
    if (currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// Эсептөө логикасы (=)
function calculate() {
    if (operator === null || shouldResetDisplay) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                result = "Ката (0гө бөлүү)";
            } else {
                result = prev / current;
            }
            break;
        case '%':
            result = (prev / 100) * current;
            break;
        default:
            return;
    }

    currentInput = result.toString();
    operator = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}

// Экранды жаңылап туруучу функция
function updateDisplay() {
    currentDisplay.innerText = currentInput;
    if (operator != null) {
        previousDisplay.innerText = `${previousInput} ${operator}`;
    } else {
        previousDisplay.innerText = '';
    }
}