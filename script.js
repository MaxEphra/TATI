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

let items = getItensBD(); // Inicializa a variável 'items' com os dados armazenados no localStorage

btnNew.onclick = () => {
  // Verifica se todos os campos foram preenchidos
  if (!descItem.value || !amount.value || !type.value || !dueDate.value) {
    return alert("Preencha todos os campos!");
  }

  // Adiciona o item à lista
  items.push({
    desc: descItem.value,
    amount: parseFloat(amount.value).toFixed(2),
    type: type.value,
    dueDate: dueDate.value,
  });

  // Salva os itens no armazenamento local
  setItensBD();

  // Limpar os campos após a inclusão
  descItem.value = "";
  amount.value = "";
  type.value = "Entrada"; // Reseta o tipo de entrada para o valor padrão
  dueDate.value = "";

  // Atualiza a lista de itens e os totais
  loadItens();
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
    <td>${formatCurrency(item.amount)}</td>
    <td style="color: ${
      item.type === "Entrada" ? "#28a745" : "#dc3545"
    }">${item.type}</td>
    <td>${formatDate(item.dueDate)}</td>
    <td>
      <button onclick="deleteItem(${index})">
        <i class="bx bxs-trash"></i>
      </button>
    </td>
  `;

  tbody.appendChild(tr);
}

function loadItens() {
  tbody.innerHTML = "";
  items.forEach((item, index) => insertItem(item, index));
  updateTotals();
}

function updateTotals() {
  const incomeAmounts = items
    .filter((i) => i.type === "Entrada")
    .map((i) => parseFloat(i.amount));
  const expenseAmounts = items
    .filter((i) => i.type === "Saída")
    .map((i) => parseFloat(i.amount));

  const totalIncomes = incomeAmounts.reduce((acc, val) => acc + val, 0);
  const totalExpenses = expenseAmounts.reduce((acc, val) => acc + val, 0);

  const totalBalance = totalIncomes - totalExpenses;

  // Atualiza os textos de entrada, saída e saldo total com cores dinâmicas
  incomes.innerHTML = `<span style="color: #28a745;">Entradas:</span> ${formatCurrency(
    totalIncomes
  )}`;
  expenses.innerHTML = `<span style="color: #dc3545;">Saídas:</span> ${formatCurrency(
    totalExpenses
  )}`;
  total.innerHTML = `<span style="color: ${
    totalBalance >= 0 ? "#28a745" : "#dc3545"
  };">Saldo Total:</span> ${formatCurrency(totalBalance)}`;

  // Adiciona classes ao box de saldo total para refletir as cores positivas ou negativas
  totalBox.classList.toggle("positive", totalBalance >= 0);
  totalBox.classList.toggle("negative", totalBalance < 0);
}

function formatCurrency(value) {
  return parseFloat(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(date) {
  const parsedDate = new Date(date);
  parsedDate.setDate(parsedDate.getDate() + 1); // Corrige o erro do dia anterior

  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const year = String(parsedDate.getFullYear()).slice(-2); // Apenas os dois últimos dígitos

  return `${day}/${month}/${year}`;
}

function getItensBD() {
  return JSON.parse(localStorage.getItem("db_items")) || [];
}

function setItensBD() {
  localStorage.setItem("db_items", JSON.stringify(items));
}

// Carregar os itens ao iniciar a página
loadItens();

