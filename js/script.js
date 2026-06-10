const form = document.getElementById("expenseForm");
const list = document.getElementById("transactionList");
const totalBalance = document.getElementById("totalBalance");
const sortOption = document.getElementById("sortOption");

const categorySelect =
document.getElementById("category");

const customCategoryInput =
document.getElementById("customCategory");

const addCategoryBtn =
document.getElementById("addCategoryBtn");

let transactions =
JSON.parse(
localStorage.getItem("transactions")
) || [];

let customCategories =
JSON.parse(
localStorage.getItem("customCategories")
) || [];

let chart;

/* =========================
   CUSTOM CATEGORY
========================= */

function loadCustomCategories(){

customCategories.forEach(category=>{

const exists =
[...categorySelect.options].some(
option =>
option.value.toLowerCase() ===
category.toLowerCase()
);

if(!exists){

const option =
document.createElement("option");

option.value = category;
option.textContent = category;

categorySelect.appendChild(option);

}

});

}

function saveCustomCategories(){

localStorage.setItem(
"customCategories",
JSON.stringify(customCategories)
);

}

addCategoryBtn.addEventListener("click",()=>{

const newCategory =
customCategoryInput.value.trim();

if(!newCategory){

alert("Please enter a category");

return;
}

const exists =
[...categorySelect.options].some(
option =>
option.value.toLowerCase() ===
newCategory.toLowerCase()
);

if(exists){

alert("Category already exists");

return;
}

customCategories.push(newCategory);

saveCustomCategories();

const option =
document.createElement("option");

option.value = newCategory;
option.textContent = newCategory;

categorySelect.appendChild(option);

categorySelect.value = newCategory;

customCategoryInput.value = "";

});

/* =========================
   TRANSACTIONS
========================= */

form.addEventListener("submit", function(e){

e.preventDefault();

const item =
document.getElementById("itemName").value;

const amount =
parseFloat(
document.getElementById("amount").value
);

let category =
categorySelect.value;

const custom =
customCategoryInput.value.trim();

if(custom !== ""){
category = custom;
}

if(!item || !amount || !category){

alert("Please fill all fields");

return;
}

const transaction = {
id: Date.now(),
item,
amount,
category
};

transactions.push(transaction);

saveData();

form.reset();

render();

});

function render(){

list.innerHTML = "";

transactions.forEach(t=>{

const div =
document.createElement("div");

div.classList.add("transaction");

div.innerHTML = `
<div class="info">
<strong>${t.item}</strong>
<span>${t.category}</span>
<span>Rp ${t.amount.toLocaleString("id-ID")}</span>
</div>

<button
class="delete-btn"
onclick="deleteTransaction(${t.id})">
Delete
</button>
`;

list.appendChild(div);

});

updateBalance();
updateChart();

}

function deleteTransaction(id){

transactions =
transactions.filter(
t => t.id !== id
);

saveData();

render();

}

function updateBalance(){

const total =
transactions.reduce(
(sum,t)=>sum+t.amount,
0
);

totalBalance.textContent =
"Rp " +
total.toLocaleString("id-ID");

}

function saveData(){

localStorage.setItem(
"transactions",
JSON.stringify(transactions)
);

}

/* =========================
   CHART
========================= */

function updateChart(){

const categories = {};

transactions.forEach(t=>{

categories[t.category] =
(categories[t.category] || 0)
+ t.amount;

});

const labels =
Object.keys(categories);

const data =
Object.values(categories);

if(chart){
chart.destroy();
}

const ctx =
document.getElementById("expenseChart");

chart =
new Chart(ctx,{

type:"pie",

data:{
labels,
datasets:[{
data
}]
}

});

}

/* =========================
   SORTING
========================= */

sortOption.addEventListener("change",()=>{

if(sortOption.value === "amount"){

transactions.sort(
(a,b)=>b.amount-a.amount
);

}
else if(
sortOption.value === "category"
){

transactions.sort(
(a,b)=>
a.category.localeCompare(
b.category
)
);

}

render();

saveData();

});

/* =========================
   DARK MODE
========================= */

const themeToggle =
document.getElementById("themeToggle");

themeToggle.addEventListener("click",()=>{

document.body.classList.toggle("dark");

if(
document.body.classList.contains("dark")
){

themeToggle.textContent =
"☀️ Light Mode";

}else{

themeToggle.textContent =
"🌙 Dark Mode";

}

});

/* =========================
   INITIAL LOAD
========================= */

loadCustomCategories();
render();
