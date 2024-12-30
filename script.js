const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const dueDate = document.querySelector("#dueDate"); // Campo para data de vencimento
const btnNew = document.querySelector("#btnNew");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

let items;

btnNew.onclick = () => {
  if (
    descItem.value === "" ||
    amount.value === "" ||
    type.value === "" ||
    dueDate.value === "" // Verifica se a data foi preenchida
  ) {
    return alert("Preencha todos os campos!");
  }

  items.push({
    desc: descItem.value,
    amount: Math.abs(amount.value).toFixed(2),
    type: type.value,
    dueDate: dueDate.value, // Adiciona a data de vencimento ao objeto
  });

  setItensBD();
  loadItens();

  // Limpa os campos
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

// Função para formatar valores no padrão brasileiro
function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.desc}</td>
    <td>${formatCurrency(Number(item.amount))}</td>
    <td class="columnType">${
      item.type === "Entrada"
        ? '<i class="bx bxs-chevron-up-circle"></i>'
        : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td>${new Date(item.dueDate).toLocaleDateString("pt-BR")}</td> <!-- Exibe a data formatada -->
    <td class="columnAction">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}

function loadItens() {
  items = getItensBD();
  tbody.innerHTML = "";
  items.forEach((item, index) => {
    insertItem(item, index);
  });

  getTotals();
}

function getTotals() {
  const amountIncomes = items
    .filter((item) => item.type === "Entrada")
    .map((transaction) => Number(transaction.amount));

  const amountExpenses = items
    .filter((item) => item.type === "Saída")
    .map((transaction) => Number(transaction.amount));

  const totalIncomes = amountIncomes.reduce((acc, cur) => acc + cur, 0);
  const totalExpenses = Math.abs(
    amountExpenses.reduce((acc, cur) => acc + cur, 0)
  );
  const totalItems = totalIncomes - totalExpenses;

  // Formata os valores no padrão brasileiro
  incomes.innerHTML = formatCurrency(totalIncomes);
  expenses.innerHTML = formatCurrency(totalExpenses);
  total.innerHTML = formatCurrency(totalItems);
}

const getItensBD = () => JSON.parse(localStorage.getItem("db_items")) ?? [];
const setItensBD = () =>
  localStorage.setItem("db_items", JSON.stringify(items));

loadItens();

