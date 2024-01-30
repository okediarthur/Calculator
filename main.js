const keys = document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

let input = "";

for(let key of keys){
    const value = key.dataset.key;

    key.addEventListener('click', () => {
        if(value == "clear"){
            input = "";
            display_input.innerHTML = "";
            display_output.innerHTML = "";
        } else if(value == "backspace"){
            input = input.slice(0, -1);
            display_input.innerHTML = CleanInput(input);
        } else if (value == "="){
            // let result = eval(PrepareInput(input));
            let postfixExpression = infixToPostfix(input);
            let result = evaluatePostfix(postfixExpression);
            display_output.innerHTML = CleanOutput(result);
        } else if(value == "brackets"){
            if(
                input.indexOf("(") == -1 ||
                input.indexOf("(") != -1 &&
                input.indexOf(")") != -1 &&
                input.lastIndexOf("(") < input.lastIndexOf(")")
            ){
                input += "(";
            } else if (
                input.indexOf("(") != -1 &&
                input.indexOf(")") == -1 ||
                input.indexOf("(") != -1 &&
                input.indexOf(")") != -1 &&
                input.lastIndexOf("(") > input.lastIndexOf(")")
            ){
                input += ")";
            }
            display_input.innerHTML = CleanInput(input);
        }else {
            if(ValidateInput(value)){
                input += value;
                display_input.innerHTML = CleanInput(input);
            }
        }
        
    })
}

function handleKeyEvent(event){
    let pressedKey = {};

    handleKeyMapping(event, pressedKey);
    handleClickEvent(event, pressedKey);
}

function handleClickEvent(event, pressedKey){
    const state = {
        previousOperand: display_input.textContent.trim(),
        currentOperand: display_output.textContent.trim(),
        previousKeyType: calculator.dataset.previousKeyType,
        operatorKeys: keys.querySelectorAll('[data-type="operator"]'),
        memoryContainer: document.querySelector('.memory__container'),
        key: event instanceof MouseEvent ? event.target : pressedKey,
    };
}

function infixToPostfix(infix) {
    let output = [];
    let stack = [];

    const operators = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
    };

    const isOperator = (token) => /^[\+\-\*\/]$/.test(token);

    let currentNumber = '';

    for (let i = 0; i < infix.length; i++) {
        let token = infix[i];

        if (!isNaN(token) || token === '.') {
            currentNumber += token;
        } else if (isOperator(token)) {
            if (currentNumber) {
                output.push(currentNumber);
                currentNumber = '';
            }

            while (
                stack.length > 0 &&
                isOperator(stack[stack.length - 1]) &&
                operators[stack[stack.length - 1]] >= operators[token]
            ) {
                output.push(stack.pop());
            }
            stack.push(token);
        } else {
            console.error("Unexpected token:", token);
        }
    }

    if (currentNumber) {
        output.push(currentNumber);
    }

    while (stack.length > 0) {
        output.push(stack.pop());
    }

    console.log("Postfix Expression:", output.join(' '));

    return output.join(' ');
}


// function infixToPostfix(infix){
//     let output = [];
//     let stack = [];

//     const operators = {
//         '+': 1,
//         '-': 1,
//         '*': 2,
//         '/': 2,
//     };

//     // const isOperator = (token) => token in operators;
//     const isOperator = (token) => /^[\+\-\*\/]$/.test(token);


//     for(let token of infix.split(/\s+/)){
//         if(isNaN(token)) {
//             output.push(token);
//         } else if(isOperator(token)){
//             while(
//                 stack.length > 0 &&
//                 isOperator(stack[stack.length - 1]) &&
//                 operators[stack[stack.length - 1]] >= operators[token]){
//                     output.push(stack.pop());
//                 }
//                 stack.push(token);
//         } else {
//             console.error("Unexpected token:", token);
//         }
        
//         }
//         while(stack.length > 0){
//             output.push(stack.pop());

//     }
//     console.log("Postfix Expression:", output.join(' '));

//     return output.join(' ');
// }

// function evaluatePostfix(postfix){
//     let stack = [];

//     for(let token of postfix.split(/\s+/)){
//         if(!isNaN(token)){
//             stack.push(parseFloat(token));
//         } else {
//             let operand2 = stack.pop();
//             let operand1 = stack.pop();

//             switch(token){
//                 case '+':
//                     stack.push(operand1 + operand2);
//                     break;
//                 case '-':
//                     stack.push(operand1 - operand2);
//                     break;
//                 case '*':
//                     stack.push(operand1 * operand2);
//                     break;
//                 case '/':
//                     stack.push(operand1 / operand2);
//                     break;
//                 default:
//                     console.error("Unexpexted operator:", token);
//             }
//         }
//         if(stack.length !== 1){
//             console.error("Invalid Output - Stack not properly evaluated:", stack);
//             return "";
//         }
//     }
//     return stack[0];
// }

function evaluatePostfix(postfix) {
    let stack = [];

    for (let token of postfix.split(/\s+/)) {
        if (!isNaN(token)) {
            stack.push(parseFloat(token));
        } else {
            if (token === '-') {
                if (stack.length < 2) {
                    console.error("Insufficient operands for unary operator:", token);
                    return "";
                }
                let operand = stack.pop();
                stack.push(-operand);
            } else {
                if (stack.length < 2) {
                    console.error("Insufficient operands for binary operator:", token);
                    return "";
                }
                let operand2 = stack.pop();
                let operand1 = stack.pop();

                switch (token) {
                    case '+':
                        stack.push(operand1 + operand2);
                        break;
                    case '-':
                        stack.push(operand1 - operand2);
                        break;
                    case '*':
                        stack.push(operand1 * operand2);
                        break;
                    case '/':
                        if (operand2 !== 0) {
                            stack.push(operand1 / operand2);
                        } else {
                            console.error("Division by zero");
                            return "";
                        }
                        break;
                    default:
                        console.error("Unexpected operator:", token);
                        return "";
                }
            }
        }
    }

    if (stack.length !== 1) {
        console.error("Invalid Output - Stack not properly evaluated:", stack);
        return "";
    }

    return stack[0];
}



function CleanInput(input){
    let input_array = input.split("");
    let input_array_length = input_array.length;

    for(let i = 0; i < input_array_length; i++){
        if(input_array[i] == "*"){
            input_array[i] = `<span class="operator">x</span> `;
        } else if (input_array[i] == "/"){
            input_array[i] = `<span class="operator">÷</span> `;
        } else if(input_array[i] == "+"){
            input_array[i] = `<span class="operator">+</span> `;
        } else if(input_array[i] == "-"){
            input_array[i] = `<span class="operator">-</span> `;
        }else if(input_array[i] == "("){
            input_array[i] = `<span class="brackets">(</span>`;
        }else if(input_array[i] == ")"){
            input_array[i] = `<span class="brackets">)</span>`;
        }else if(input_array[i] == "%"){
            input_array[i] = `<span class ="percent">%</span>`;
        }
    }
    return input_array.join("");
}

function CleanOutput(output){
    if(output === undefined || output === null){
        console.error("Invalid Output:", output);
        return "Invalid Output";
    }
    let output_string = output.toString();
    let decimal = output_string.split(".")[1];
    output_string = output_string.split(".")[0];

    let output_array = output_string.split("");

    if(output_array.length > 3){
        for(let i = output_array.length - 3; i > 0; i -= 3){
            output_array.splice(i, 0, ",");
        }
    }
    if(decimal){
        output_array.push(".");
        output_array.push(decimal);
    }
    return output_array.join("");
}

function ValidateInput(value){
    let last_input = input.slice(-1);
    let operators = ["+", "-", "*", "/"];

    if(value == "." && last_input == "."){
        return false;
    }
    if(operators.includes(value)){
        if(operators.includes(last_input)){
            return false;
        } else {
            return true;
        }
    }
    return true;
}

function PrepareInput(input){
    let input_array = input.split("");

    for(let i = 0; i < input_array.length; i++){
        if(input_array[i] == "%"){
            input_array[i] = "/100";
        }
    }

    return input_array.join("");
}