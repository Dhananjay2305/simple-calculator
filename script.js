
const display = document.getElementById("display");
const themeToggle = document.getElementById("themeToggle");

let current = "";
let operator = "";
let previous = "";

function updateDisplay(value) {
  display.textContent = value || "0";
}

function handleNumber(num) {
  if (num === "." && current.includes(".")) return;
  current += num;
  updateDisplay(current);
}

function handleOperator(op) {
  if (current === "" && previous === "") return;

  if (previous !== "" && current !== "") {
    previous = String(calculate(previous, current, operator));
    current = "";
    updateDisplay(previous);
  } else if (previous === "") {
    previous = current;
    current = "";
  }

  operator = op;
}

function handleEquals() {
  if (previous === "" || current === "" || operator === "") return;

  const result = calculate(previous, current, operator);
  updateDisplay(String(result));

  current = String(result);
  previous = "";
  operator = "";
}

function handleClear() {
  current = "";
  previous = "";
  operator = "";
  updateDisplay("0");
}

function handleDelete() {
  current = current.slice(0, -1);
  updateDisplay(current);
}

function calculate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);

  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return b === 0 ? "Error" : a / b;

  return b;
}

// Button click
document.querySelector(".buttons").addEventListener("click", (event) => {
  const btn = event.target;
  const value = btn.getAttribute("data-value");
  const action = btn.getAttribute("data-action");

  if (action === "clear") return handleClear();
  if (action === "equals") return handleEquals();
  if (action === "delete") return handleDelete();
  if (action === "operator") return handleOperator(value);

  if (value) handleNumber(value);
});

// Keyboard support
document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/\d/.test(key)) handleNumber(key);
  else if (key === ".") handleNumber(".");
  else if (["+", "-", "*", "/"].includes(key)) handleOperator(key);
  else if (key === "Enter" || key === "=") handleEquals();
  else if (key === "Backspace") handleDelete();
  else if (key === "Escape") handleClear();
});

// Theme Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }
});
