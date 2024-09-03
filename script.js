/* Author: Alexander May
   Last Modified: 9/3/2024 */ 


const input = document.getElementById("input");
const previousInput = document.getElementById("previous-input");
const numberButtons = document.querySelectorAll(".number");
const operationButtons = document.querySelectorAll(".operation");
const decimalButton = document.getElementById("btn-.");
const signButton = document.getElementById("btn-sign");
const equalsButton = document.getElementById("btn-equal")
const absButton = document.getElementById("btn-abs");
const clearButton = document.getElementById("btn-clear");
const clearAllButton = document.getElementById("btn-clear-all");



const handleInput = (button) => {
    if(handleError()) {
        return;
    } else {
        input.value += button.innerText;
    }
}

const handleOperationInput = (operation) => {
    if(handleError()) {
        return;
    } else {
        input.value += " " + operation.innerText + " ";
    }
}


const handleError = () => {
    const inputString = String(input.value);
    const spaceRegex = /\s/g;
    const cleanedString = inputString.replace(spaceRegex, "");
    const charRegex = /[`~!@#$%^&*\(\)_=\[\]{}|:;'",?<>a-zA-Z]/g
    if(cleanedString.length < 8) {
        return false;
    } else if(inputString.match(charRegex)) {
        alert("Please enter only numbers or the symbols ., +, -, /, *");
        return true;
    } else {
        alert("Please enter only up to 8 digits");
        return true;
    }
}

const checkStoredValue = () => {
    if(localStorage.getItem("previousResult")) {
        previousInput.value = localStorage.getItem("previousResult");
        input.value = '';
        localStorage.clear();
    } else {
        return;
    }
}


const changeSign = () => {
    const numberInput = parseFloat(input.value);
    input.value = numberInput - numberInput * 2;
}

const absoluteValue = () => {
    const numberInput = parseFloat(input.value);
    input.value = Math.abs(numberInput);
}

const simplifyInput = () => {
    const inputString = String(input.value);
    const operationRegex = /[+\-*/]/; // regex to match operators
    let inputArray = inputString.split(" ");
    
    if (inputString.match(operationRegex)) {
        while (inputArray.length > 1) {
            if (inputArray.includes("*") || inputArray.includes("/")) {
                const index = inputArray.findIndex((element) => element === "*" || element === "/");
                const operator = inputArray[index];
                const leftOperand = previousInput.value && index === 1 ? parseFloat(previousInput.value) : parseFloat(inputArray[index - 1]);
                const rightOperand = parseFloat(inputArray[index + 1]);
                let result;

                if (operator === "*") {
                    result = leftOperand * rightOperand;
                } else if (operator === "/") {
                    result = leftOperand / rightOperand;
                }

                inputArray.splice(index - 1, 3, result);
            } else if (inputArray.includes("+") || inputArray.includes("-")) {
                const index = inputArray.findIndex((element) => element === "+" || element === "-");
                const operator = inputArray[index];
                const leftOperand = previousInput.value && index === 1 ? parseFloat(previousInput.value) : parseFloat(inputArray[index - 1]);
                const rightOperand = parseFloat(inputArray[index + 1]);
                let result;

                if (operator === "+") {
                    result = leftOperand + rightOperand;
                } else if (operator === "-") {
                    result = leftOperand - rightOperand;
                }

                inputArray.splice(index - 1, 3, result);
            }
        }
        input.value = String(inputArray[0]).length <= 8 ? inputArray[0] : "ERR" ; //Result rendered to input
        localStorage.setItem("previousResult", String(input.value));

    } else {
        alert("Please enter something to calculate");
    }
}

const clearInput = () => {
    input.value = '';
}

const clearAllInput = () => {
    input.value = '';
    previousInput.value = '';
    localStorage.clear();
}

numberButtons.forEach((number) => {
    number.addEventListener("click", () => {
        checkStoredValue();
        handleInput(number);
    });
});

decimalButton.addEventListener("click", () => {
    checkStoredValue();
    handleInput(decimalButton)
});

operationButtons.forEach((operation) => {
    operation.addEventListener("click", () => {
        checkStoredValue();
        handleOperationInput(operation);
    })
})

signButton.addEventListener("click", () => {
    changeSign();
})

absButton.addEventListener("click", () => {
    absoluteValue();
})

equalsButton.addEventListener("click", () => {
    simplifyInput();
})

clearButton.addEventListener("click", ()=> {
    clearInput();
})

clearAllButton.addEventListener("click", ()=> {
    clearAllInput();
})
