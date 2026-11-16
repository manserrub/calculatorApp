
const currentDisplay = document.getElementById("current-value");
const previousDisplay = document.getElementById("previous-operation");
const buttons = document.querySelector(".buttons");
const historyContainer = document.getElementById("history-list");

// Calculator state
let expression = "";
let isResultDisplayed = false;
let isCalculating = false;

// Update display
function updateDisplay() {
    currentDisplay.textContent = expression || "0";
}

// Add number
function appendNumber(number) {

    if (isCalculating) return;

    if (isResultDisplayed) {
        expression = "";
        isResultDisplayed = false;
        previousDisplay.textContent = "";
    }

    expression += number;
    updateDisplay();
}

// Add operator
function appendOperator(operator) {

    if (isCalculating) return;

    if (isResultDisplayed) {
        isResultDisplayed = false;
        previousDisplay.textContent = "";
    }

    const trimmed = expression.trim();

    if (!trimmed) {
        if (operator === "-") {
            expression = "-";
            updateDisplay();
        }
        return;
    }

    const lastChar = trimmed.slice(-1);

    if ("+-*/".includes(lastChar)) {

        // Allow negative numbers after another operator
        if (operator === "-" && lastChar !== "-") {
            expression += " -";
        } else {
            expression = trimmed.slice(0, -1) + operator;
        }

    } else {
        expression += ` ${operator} `;
    }

    updateDisplay();
}

// Add decimal
function appendDecimal() {

    if (isCalculating) return;

    if (isResultDisplayed) {
        expression = "";
        isResultDisplayed = false;
    }

    const lastNumber = expression.split(/[+\-*/]/).pop();

    if (lastNumber.includes(".")) return;

    if (!lastNumber || lastNumber.trim() === "") {
        expression += "0.";
    } else {
        expression += ".";
    }

    updateDisplay();
}

// Calculate using Java backend
async function calculate() {

    if (!expression.trim() || isCalculating) return;

    const submittedExpression = expression.trim();

    isCalculating = true;

    try {

        const response = await fetch(
            "/api/calculator/expression",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    expression: submittedExpression
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Calculation error");
        }

        const result = String(data.result);

        previousDisplay.textContent =
            `${submittedExpression} =`;

        expression = result;
        isResultDisplayed = true;

        updateDisplay();

        saveToHistory(submittedExpression, result);

    } catch (error) {

        previousDisplay.textContent = error.message;
        expression = "";
        isResultDisplayed = false;

        updateDisplay();

    } finally {
        isCalculating = false;
    }
}

// Clear calculator
function clearCalculator() {

    if (isCalculating) return;

    expression = "";
    isResultDisplayed = false;

    previousDisplay.textContent = "";

    updateDisplay();
}

// Delete last character
function deleteDigit() {

    if (isCalculating || isResultDisplayed) return;

    expression = expression.slice(0, -1);

    updateDisplay();
}

// Change sign of current number
function changeSign() {

    if (isCalculating || !expression) return;

    const match = expression.match(/(-?\d*\.?\d+)$/);

    if (!match) return;

    const number = match[0];
    const start = match.index;

    const replacement = number.startsWith("-")
        ? number.slice(1)
        : "-" + number;

    expression =
        expression.slice(0, start) + replacement;

    updateDisplay();
}

// Save operation to localStorage
function saveToHistory(expression, result) {

    const history = getHistory();

    const entry = {
        expression,
        result,
        timestamp: new Date().toISOString()
    };

    history.unshift(entry);

    // Keep only the last 20 operations
    const limitedHistory = history.slice(0, 20);

    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(limitedHistory)
    );

    renderHistory();
}

// Retrieve history
function getHistory() {

    try {
        return JSON.parse(
            localStorage.getItem("calculatorHistory")
        ) || [];
    } catch {
        return [];
    }
}

// Render history
function renderHistory() {

    if (!historyContainer) return;

    historyContainer.replaceChildren();

    const history = getHistory();

    if (history.length === 0) {
        historyContainer.textContent = "No operations yet";
        return;
    }

    history.forEach(entry => {

        const item = document.createElement("button");

        item.className = "history-item";

        const operation = document.createElement("span");
        operation.textContent = entry.expression;

        const result = document.createElement("strong");
        result.textContent = `= ${entry.result}`;

        const date = document.createElement("small");
        date.textContent =
            new Date(entry.timestamp).toLocaleString();

        item.append(operation, result, date);

        item.addEventListener("click", () => {
            if (isCalculating) return;

            expression = entry.result;
            isResultDisplayed = true;

            previousDisplay.textContent =
                entry.expression + " =";

            updateDisplay();
        });

        historyContainer.appendChild(item);
    });
}

// Clear history
function clearHistory() {

    localStorage.removeItem("calculatorHistory");
    renderHistory();
}

// Button events
buttons.addEventListener("click", event => {

    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.number !== undefined) {
        appendNumber(button.dataset.number);
    }

    if (button.dataset.operation !== undefined) {
        appendOperator(button.dataset.operation);
    }

    switch (button.dataset.action) {

        case "clear":
            clearCalculator();
            break;

        case "delete":
            deleteDigit();
            break;

        case "decimal":
            appendDecimal();
            break;

        case "sign":
            changeSign();
            break;

        case "equals":
            calculate();
            break;
    }
});

// Initialize calculator
updateDisplay();
renderHistory();

document.getElementById("clear-history")
    .addEventListener("click", clearHistory);