const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const dueDate = document.querySelector("#dueDate");
const btnNew = document.querySelector("#btnNew");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");
const totalBox = document.querySelector(".totalBox");

let items;

btnNew.onclick = () => {
  if (!descItem.value || !amount.value || !type.value || !dueDate.value) {
    return alert("Preencha todos os campos!");
  }

  items.push({
    desc: descItem.value,
    amount: parseFloat(amount.value).toFixed(2),
    type: type.value,
    dueDate: dueDate.value,
  });

  setItensBD();
  loadItens();

  descItem.value = "";
  amount.value = "";
  type.value = "Entrada";
  dueDate.value = "";
};

function deleteItem(index) {
  items.splice(index, 1);
  setItensBD();
  loadItens();
}

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.desc}</td>
    <td>R$ ${formatCurrency(item.amount)}</td>
    <td>${item.type === "Entrada" ? "Entrada" : "Saída"}</td>
    <td>${formatDate(item.dueDate)}</td>
    <td>
      <button onclick="deleteItem(${index})">
        <i class="bx bx-trash"></i>
      </button>
    </td>
  `;

  tbody.appendChild(tr);
}

function loadItens() {
  items = getItensBD();
  tbody.innerHTML = "";
  items.forEach((item, index) => insertItem(item, index));
  updateTotals();
}

function updateTotals() {
  const incomeAmounts = items.filter((i) => i.type === "Entrada").map((i) => parseFloat(i.amount));
  const expenseAmounts = items.filter((i) => i.type === "Saída").map((i) => parseFloat(i.amount));

  const totalIncomes = incomeAmounts.reduce((acc, val) => acc + val, 0);
  const totalExpenses = expenseAmounts.reduce((acc, val) => acc + val, 0);

  const totalBalance = totalIncomes - totalExpenses;

  incomes.textContent = `R$ ${formatCurrency(totalIncomes)}`;
  expenses.textContent = `R$ ${formatCurrency(totalExpenses)}`;
  total.textContent = `R$ ${formatCurrency(totalBalance)}`;

  totalBox.classList.toggle("positive", totalBalance >= 0);
  totalBox.classList.toggle("negative", totalBalance < 0);
}

function formatCurrency(value) {
  return Number(value)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,")
    .replace(".", ",");
}

function formatDate(date) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year.slice(2)}`; // Formato dd/mm/yy
}

function getItensBD() {
  return JSON.parse(localStorage.getItem("db_items")) || [];
}

function setItensBD() {
  localStorage.setItem("db_items", JSON.stringify(items));
}

loadItens();

