
const currentDisplay = document.getElementById("current-value");
const previousDisplay = document.getElementById("previous-operation");
const buttons = document.querySelector(".buttons");

// Calculator state
let currentValue = "0";
let firstOperand = null;
let operator = null;
let shouldResetDisplay = false;
let isResultDisplayed = false;

// Update display
function updateDisplay() {
    currentDisplay.textContent = currentValue;
}

// Add number
function appendNumber(number) {
    if (shouldResetDisplay || isResultDisplayed) {
        currentValue = number;
        shouldResetDisplay = false;
        isResultDisplayed = false;
    } else {
        currentValue = currentValue === "0"
            ? number
            : currentValue + number;
    }

    updateDisplay();
}

// Add decimal
function appendDecimal() {
    if (shouldResetDisplay || isResultDisplayed) {
        currentValue = "0";
        shouldResetDisplay = false;
        isResultDisplayed = false;
    }

    if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}

// Select operator
function selectOperator(selectedOperator) {
    firstOperand = currentValue;
    operator = selectedOperator;

    previousDisplay.textContent =
        `${firstOperand} ${operator}`;

    shouldResetDisplay = true;
    isResultDisplayed = false;
}

// Call Java backend
async function calculate() {
    if (firstOperand === null || operator === null) {
        return;
    }

    const secondOperand = currentValue;

    try {
        const response = await fetch(
            "/api/calculator/calculate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    number1: firstOperand,
                    number2: secondOperand,
                    operation: operator
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Calculation error");
        }

        previousDisplay.textContent =
            `${firstOperand} ${operator} ${secondOperand} =`;

        currentValue = String(data.result);

        firstOperand = null;
        operator = null;

        shouldResetDisplay = false;
        isResultDisplayed = true;

        updateDisplay();

    } catch (error) {
        previousDisplay.textContent = error.message;
        currentValue = "Error";

        firstOperand = null;
        operator = null;

        shouldResetDisplay = true;
        isResultDisplayed = false;

        updateDisplay();
    }
}

// Clear calculator
function clearCalculator() {
    currentValue = "0";
    firstOperand = null;
    operator = null;
    shouldResetDisplay = false;
    isResultDisplayed = false;

    previousDisplay.textContent = "";

    updateDisplay();
}

// Delete last digit
function deleteDigit() {
    if (shouldResetDisplay || isResultDisplayed) {
        return;
    }

    currentValue = currentValue.length > 1
        ? currentValue.slice(0, -1)
        : "0";

    if (currentValue === "-") {
        currentValue = "0";
    }

    updateDisplay();
}

// Change sign
function changeSign() {
    if (currentValue === "0" || currentValue === "Error") {
        return;
    }

    currentValue = currentValue.startsWith("-")
        ? currentValue.slice(1)
        : "-" + currentValue;

    updateDisplay();
}

// Button events
buttons.addEventListener("click", (event) => {

    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.number !== undefined) {
        appendNumber(button.dataset.number);
    }

    if (button.dataset.operation !== undefined) {
        selectOperator(button.dataset.operation);
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

// Initial display
updateDisplay();
