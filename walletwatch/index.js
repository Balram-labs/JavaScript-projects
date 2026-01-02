
const togler = document.getElementById("theme");
const addbudgetFieldset = document.getElementById("addBudget");
const addExpenseFieldset = document.getElementById("addExpns");


togler.addEventListener("click", () => {
  document.body.classList.toggle("sliderTheme");
  togler.classList.toggle("slider");
  if(document.body.classList.contains("sliderTheme")){
    localStorage.setItem("theme","dark");

  }else{
    localStorage.setItem("theme","light");
  }
});
window.addEventListener("DOMContentLoaded",()=>{
  let THEME = localStorage.getItem("theme");
  if(THEME === "dark"){
    document.body.classList.add("sliderTheme");
    togler.classList.add("slider");
  }else if(THEME === "light"){
    document.body.classList.remove("sliderTheme");
    togler.classList.remove("slider");
  }
});

document.getElementById("year").textContent = new Date().getFullYear();


const budgetInput = document.getElementById("budget");
const expenseTitleInput = document.getElementById("expenseTitel");
const amountInput = document.getElementById("amount");
const budgetButton = document.getElementById("addbgt");
const expenseButton = document.getElementById("addExpense");

const totalBudget = document.getElementById("totalBudget");
const totalExpense = document.getElementById("totalExpense");
const budgetLeft = document.getElementById("budgetLeft");
const tableBody = document.getElementById("tbodyelem");


function saveBudget() {
  localStorage.setItem("Budget", JSON.stringify(budgetInput.value));
}

function loadBudget() {
  let savedBudget = localStorage.getItem("Budget");
  return savedBudget ? JSON.parse(savedBudget) : 0;
  update();
}

budgetInput.addEventListener("input", saveBudget);

budgetButton.addEventListener("click", () => {
  if (budgetInput.value.trim() === "")
    return;
  let B = loadBudget();
  if (B < 0) B = "Enter positive budget please";
  totalBudget.innerText = `Total Budget: ${B}`;
  budgetInput.value = "";
  
  update();
});


function saveExpense() {
  let allExpense = loadExpense();
  const expense = expenseTitleInput.value;
  const amount = amountInput.value;
  allExpense.push({ expense, amount });
  localStorage.setItem("expense", JSON.stringify(allExpense));
}

function loadExpense() {
  let savedExpense = localStorage.getItem("expense");
  return savedExpense ? JSON.parse(savedExpense) : [];
}

function createExpense(expense, amount) {
  let tr = document.createElement("tr");
  let tdExpense = document.createElement("td");
  let tdAmount = document.createElement("td");
  let tdButton = document.createElement("td");
  let button = document.createElement("button");

  button.innerHTML = `&#10008;`;
  tdButton.append(button);
  tdExpense.innerText = expense;
  tdAmount.innerText = amount;
  tr.append(tdExpense, tdAmount, tdButton);
  tableBody.append(tr);

  button.addEventListener("click", () => {
    tr.classList.add("deletego");
    setTimeout(() => {
      tr.remove();
      let expenses = loadExpense().filter(
        (e) => !(e.expense === expense && e.amount === amount)
      );
      let expnseee = expenses;
      const bgt = loadBudget();
      const ttlexp = expnseee.reduce((a, b) => {
        return (a += JSON.parse(b.amount));
      }, 0);
      const bgtL = `${bgt - ttlexp}`;
      localStorage.setItem("budgetL", bgtL);
      budgetLeft.innerText = `Budget Left : ${JSON.parse(
        localStorage.getItem("budgetL")
      )}`;
      localStorage.setItem("totalexp", ttlexp);
      totalExpense.innerText = `Total Expense : ${JSON.parse(
        localStorage.getItem("totalexp")
      )}`;
      
      localStorage.setItem("expense", JSON.stringify(expenses));
    }, 0);
    update();
  });
}


window.addEventListener("DOMContentLoaded", () => {
  
  let C = loadBudget();
  if (C < 0) C = "Enter positive budget please";
  totalBudget.innerText = `Total Budget: ${C}`;

 
  let exp = loadExpense();
  exp.forEach((e) => createExpense(e.expense, e.amount));
  update();
});



expenseButton.addEventListener("click", () => {
  if (expenseTitleInput.value.trim() === "" || amountInput.value.trim() === "")
    return;
  createExpense(expenseTitleInput.value.trim(), amountInput.value.trim());
  saveExpense();
  expenseTitleInput.value = "";
  amountInput.value = "";
  update();
});

function update() {
  let expnseee = loadExpense();
  const buget = loadBudget();
  let totalexp = expnseee.reduce((a, b) => {
    return (a += JSON.parse(b.amount));
  }, 0);
  
   
  let budgetL = `${buget - totalexp}`;
  if(budgetL<0){
    budgetL = 0;
  }
  if(buget == 0){
    addExpenseFieldset.disabled = true;
    addExpenseFieldset.style.filter = `grayscale(90%)`;
    expenseButton.disabled = true;
    expenseButton.style.scale = 1;
    expenseButton.style.fileter = `opacity(1)`;
    
  }else{
    addExpenseFieldset.disabled = false;
    expenseButton.disabled = false;
    addExpenseFieldset.style.filter = `grayscale(0%)`;
    expenseButton.style.scale = 1;
    expenseButton.style.fileter = `opacity(.95)`;
  }
  if(buget == 0){
    budgetL = 0;
    totalexp = 0;
    localStorage.setItem("budgetL",0);
  }
  
  
  
  localStorage.setItem("budgetL", budgetL);
  budgetLeft.innerText = `Budget Left : ${JSON.parse(
    localStorage.getItem("budgetL")
  )}`;
  localStorage.setItem("totalexp", totalexp);
  totalExpense.innerText = `Total Expense : ${JSON.parse(
    localStorage.getItem("totalexp")
  )}`;
  
}
const resetExpense = document.getElementById("resetexpense");
resetExpense.addEventListener("click",()=>{
  localStorage.removeItem("expense");
  localStorage.setItem("totalexp",0);
  tableBody.innerHTML = "";
  if (typeof update === "function") {
  update();
}
})