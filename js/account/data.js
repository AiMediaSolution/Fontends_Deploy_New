let accountsData = []; // Store accounts data locally
let currentPage = 1;
let itemsPerPage = 10;

document.getElementById("items-per-page").addEventListener("change", () => {
  currentPage = 1;
  renderTable();
});

// Function to fetch all accounts
async function fetchAccounts() {
  const response = await fetchWithAuth(`${apiUrl}/admin`, {
    method: "GET",
  });

  if (response.ok) {
    accountsData = await response.json(); // Save data locally
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

// Function to search accounts by username
function searchAccounts() {
  const searchInput = document
    .getElementById("search-input")
    .value.toLowerCase();
  const filteredAccounts = accountsData.filter((account) =>
    account.userName.toLowerCase().includes(searchInput)
  );
  renderTable(filteredAccounts);
}

// Function to change page
function changePage(direction) {
  const totalPages = Math.ceil(accountsData.length / itemsPerPage);
  currentPage = Math.max(1, Math.min(currentPage + direction, totalPages));
  renderTable();
}

// Function to go to the first page
function goToFirstPage() {
  if (currentPage !== 1) {
    currentPage = 1;
    renderTable();
  }
}

// Function to go to the last page
function goToLastPage() {
  const totalPages = Math.ceil(accountsData.length / itemsPerPage);
  if (currentPage !== totalPages) {
    currentPage = totalPages;
    renderTable();
  }
}

// Function to render table with pagination and filtering
function renderTable(filteredAccounts = accountsData) {
  const accountTableBody = document.getElementById("accountTableBody");
  const totalEntries = document.getElementById("total-entries");
  const firstPage = document.getElementById("first-page");
  const previousPage = document.getElementById("previous-page");
  const nextPage = document.getElementById("next-page");
  const lastPage = document.getElementById("last-page");
  const pageNumberInput = document.getElementById("page-number");

  itemsPerPage = parseInt(document.getElementById("items-per-page").value, 10);
  const totalItems = filteredAccounts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  currentPage = Math.min(currentPage, totalPages) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);

  accountTableBody.innerHTML = "";
  paginatedAccounts.forEach((account, index) => {
    let statusAccount = "";
    let btn = "";
    if (account.isDeleted) {
      statusAccount = `<td><span class="status text-dark">&bull;</span></td>`;
      btn = `<button class="btn btn-info" onclick="openRestoreModal(${account.account_Id}, '${account.userName}')" title="Resend">
    <i class="fa fa-rotate-right"></i>
  </button>`;
    } else {
      statusAccount = `<td><span class="status text-success">&bull;</span></td>`;
      btn = `<button class="btn btn-danger" onclick="openDeleteModal(${account.account_Id}, '${account.userName}')" title="Delete">
    <i class="fa fa-trash"></i>
  </button>`;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td>${account.account_Id}</td>
            <td>${account.account_type}</td>
            <td>${account.userName}</td>
            <td>${account.data}</td>
            ${statusAccount}
<td>
  <button class="btn btn-primary" 
          onclick="openEditModal(${account.account_Id}, '${
      account.account_type
    }', '${account.userName}')">
    <i class="fa fa-pencil-alt"></i>
  </button>
  ${btn}
</td>
        `;
    accountTableBody.appendChild(row);
  });

  totalEntries.textContent = totalItems;
  firstPage.classList.toggle("disabled", currentPage === 1);
  previousPage.classList.toggle("disabled", currentPage === 1);
  nextPage.classList.toggle("disabled", currentPage >= totalPages);
  lastPage.classList.toggle("disabled", currentPage >= totalPages);

  pageNumberInput.value = currentPage;
  pageNumberInput.onchange = () => {
    const newPage = parseInt(pageNumberInput.value);
    if (newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
      renderTable();
    } else {
      pageNumberInput.value = currentPage;
    }
  };
}

// Event listeners for pagination buttons
document.getElementById("first-page").addEventListener("click", goToFirstPage);
document
  .getElementById("previous-page")
  .addEventListener("click", () => changePage(-1));
document
  .getElementById("next-page")
  .addEventListener("click", () => changePage(1));
document.getElementById("last-page").addEventListener("click", goToLastPage);

// Initial fetch of accounts
fetchAccounts();

function redirectToHome() {
  window.location.href = "index.html";
}
