// Cache DOM lookups so we do not query repeatedly
const display = document.getElementById('display');

// Track the number currently being typed and the full pending expression
let currentInput = '0';
let expression = '';
let lastInputType = 'number'; // "number" | "operator" | "equals"

// Update the on-screen value in one place
function updateDisplay(value) {
  display.textContent = value;
}

// Handle numeric and decimal input
function handleNumber(value) {
  // After an equals press, start a fresh calculation
  if (lastInputType === 'equals') {
    expression = '';
    currentInput = '0';
  }

  // Prevent multiple decimals in the same number
  if (value === '.' && currentInput.includes('.')) return;

  // Replace leading zero unless adding a decimal point
  if (currentInput === '0' && value !== '.') {
    currentInput = value;
  } else {
    currentInput += value;
  }

  lastInputType = 'number';
  updateDisplay(currentInput);
}

// Handle operator buttons (+, -, *, /)
function handleOperator(operator) {
  // If user taps operators back-to-back, replace the previous operator
  if (lastInputType === 'operator') {
    expression = expression.slice(0, -3);
  } else if (lastInputType === 'equals') {
    // Continue calculation using the last result
    expression = `${currentInput} `;
  }

  expression = `${expression.trim()} ${currentInput} ${operator} `.trim() + ' ';
  currentInput = '0';
  lastInputType = 'operator';
  updateDisplay(operator);
}

// Evaluate the built expression
function handleEquals() {
  // Do nothing if the last input was an operator
  if (lastInputType === 'operator') return;

  const finalExpression = `${expression}${currentInput}`.trim();
  if (!finalExpression) return;

  try {
    // Function constructor keeps the evaluation scoped and strict
    const result = Function('"use strict"; return (' + finalExpression + ')')();
    currentInput = String(result);
    expression = '';
    lastInputType = 'equals';
    updateDisplay(currentInput);
  } catch (error) {
    updateDisplay('Error');
    currentInput = '0';
    expression = '';
    lastInputType = 'number';
  }
}

// Clear everything back to defaults
function handleClear() {
  currentInput = '0';
  expression = '';
  lastInputType = 'number';
  updateDisplay('0');
}

// Backspace support for keyboard users
function handleBackspace() {
  if (lastInputType !== 'number') return;
  if (currentInput.length === 1) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay(currentInput);
}

// Delegate button clicks through the buttons container
document.querySelector('.buttons').addEventListener('click', (event) => {
  const button = event.target;
  const value = button.getAttribute('data-value');
  const action = button.getAttribute('data-action');

  // Ignore clicks on the grid gaps
  if (!value && !action) return;

  if (action === 'clear') {
    handleClear();
  } else if (action === 'equals') {
    handleEquals();
  } else if (action === 'operator') {
    handleOperator(value);
  } else {
    handleNumber(value);
  }
});

// Keyboard accessibility for faster input
document.addEventListener('keydown', (event) => {
  const { key } = event;

  if ((/\d/).test(key)) {
    handleNumber(key);
  } else if (key === '.') {
    handleNumber('.');
  } else if (['+', '-', '*', '/'].includes(key)) {
    handleOperator(key);
  } else if (key === 'Enter' || key === '=') {
    handleEquals();
  } else if (key === 'Escape') {
    handleClear();
  } else if (key === 'Backspace') {
    handleBackspace();
  }
});
