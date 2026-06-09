const form = document.getElementById("expenseForm");
const list = document.getElementById("transactionList");
const totalBalance = document.getElementById("totalBalance");
const sortOption = document.getElementById("sortOption");

let transactions =
JSON.parse(localStorage.getItem("transactions")) || [];

let chart;

form.addEventListener("submit", function(e){

e.preventDefault();

const item =
document.getElementById("itemName").value;

const amount =
parseFloat(
document.getElementById("amount").value
);

let category =
document.getElementById("category").value;

const custom =
document.getElementById("customCategory").value;

if(custom.trim() !== ""){
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
<span>Rp ${t.amount.toLocaleString()}</span>
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
transactions.filter(t => t.id !== id);

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

sortOption.addEventListener("change",()=>{

if(sortOption.value === "amount"){

transactions.sort(
(a,b)=>b.amount-a.amount
);

}

if(sortOption.value === "category"){

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

const themeToggle =
document.getElementById("themeToggle");

themeToggle.addEventListener("click",()=>{

document.body.classList.toggle("dark");

if(document.body.classList.contains("dark")){

themeToggle.textContent =
"☀️ Light Mode";

}else{

themeToggle.textContent =
"🌙 Dark Mode";
}

});

render();
