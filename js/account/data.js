let accountsData = []; // Store accounts data locally
let currentPage = 1;
let itemsPerPage = 10;

document.getElementById("items-per-page").addEventListener("change", () => {
  itemsPerPage = parseInt(document.getElementById("items-per-page").value, 10);
  const totalPages = Math.max(1, Math.ceil(accountsData.length / itemsPerPage));
  if (currentPage > totalPages) currentPage = totalPages;
  renderTable();
});

async function fetchAccounts() {
  const response = await fetchWithAuth(`${apiUrl}/admin`, { method: "GET" });
  if (response.ok) {
    accountsData = await response.json();
    renderTable();
  } else {
    if (response.status === 401) {
      alert("Access forbidden: You do not have the required permissions.");
    } else if (response.status === 403) {
      showModal("noPermissionModal");
    } else {
      alert("Failed to fetch accounts");
    }
  }
}

function searchAccounts() {
  currentPage = 1;
  renderTable();
}

function changePage(direction) {
  const totalPages = Math.max(1, Math.ceil(accountsData.length / itemsPerPage));
  currentPage = Math.max(1, Math.min(currentPage + direction, totalPages));
  renderTable();
}

function goToFirstPage() {
  if (currentPage !== 1) {
    currentPage = 1;
    renderTable();
  }
}

function goToLastPage() {
  const totalPages = Math.max(1, Math.ceil(accountsData.length / itemsPerPage));
  if (currentPage !== totalPages) {
    currentPage = totalPages;
    renderTable();
  }
}

function renderTable() {
  const accountTableBody = document.getElementById("accountTableBody");
  const totalEntries = document.getElementById("total-entries");
  const pageNumberInput = document.getElementById("page-number");

  const searchInput = document
    .getElementById("search-input")
    .value.toLowerCase();
  const filteredAccounts = accountsData.filter((account) =>
    account.userName.toLowerCase().includes(searchInput)
  );

  const totalItems = filteredAccounts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  currentPage = Math.min(currentPage, totalPages);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);

  accountTableBody.innerHTML = paginatedAccounts
    .map((account, index) => {
      let statusAccount = account.isDeleted
        ? '<td><span class="status text-dark">&bull;</span></td>'
        : '<td><span class="status text-success">&bull;</span></td>';

      let actionButton = account.isDeleted
        ? `<button class="btn btn-info" onclick="openRestoreModal(${account.account_Id}, '${account.userName}')" title="Resend">
          <i class="fa fa-rotate-right"></i>
        </button>`
        : `<button class="btn btn-danger" onclick="openDeleteModal(${account.account_Id}, '${account.userName}')" title="Delete">
          <i class="fa fa-trash"></i>
        </button>`;

      return `
      <tr>
        <td>${startIndex + index + 1}</td>
        <td>${account.account_Id}</td>
        <td>${account.account_type}</td>
        <td>${account.userName}</td>
        <td>${account.data}</td>
        ${statusAccount}
        <td>
          <button class="btn btn-primary" onclick="openEditModal(${
            account.account_Id
          }, '${account.account_type}', '${account.userName}')">
            <i class="fa fa-pencil-alt"></i>
          </button>
          ${actionButton}
        </td>
      </tr>`;
    })
    .join("");

  totalEntries.textContent = totalItems;
  pageNumberInput.value = currentPage;
  pageNumberInput.onchange = () => {
    let newPage = parseInt(pageNumberInput.value, 10);
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
      renderTable();
    } else {
      pageNumberInput.value = currentPage;
    }
  };
}

document.getElementById("first-page").addEventListener("click", goToFirstPage);
document
  .getElementById("previous-page")
  .addEventListener("click", () => changePage(-1));
document
  .getElementById("next-page")
  .addEventListener("click", () => changePage(1));
document.getElementById("last-page").addEventListener("click", goToLastPage);

fetchAccounts();
