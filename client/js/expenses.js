let expenses = []

function addExpense(category, amount){

let expense = {
category:category,
amount:amount
}

expenses.push(expense)

renderExpenses()

}

function renderExpenses(){

let table=document.getElementById("expenseTable")

table.innerHTML=""

expenses.forEach(e=>{

let row=`
<tr>
<td>${new Date().toLocaleDateString()}</td>
<td>${e.category}</td>
<td>₹${e.amount}</td>
<td><button>Delete</button></td>
</tr>
`

table.innerHTML+=row

})

}