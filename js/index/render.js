const renderTable = () => {
  const dataList = document.getElementById("data-list");
  const tableHeader = document.getElementById("table-header");
  const totalEntries = document.getElementById("total-entries");
  const firstPage = document.getElementById("first-page");
  const previousPage = document.getElementById("previous-page");
  const nextPage = document.getElementById("next-page");
  const lastPage = document.getElementById("last-page");
  const pageNumberInput = document.getElementById("page-number");
  const itemsPerPageSelect = document.getElementById("items-per-page");

  if (
    !dataList ||
    !tableHeader ||
    !totalEntries ||
    !firstPage ||
    !previousPage ||
    !nextPage ||
    !lastPage ||
    !pageNumberInput ||
    !itemsPerPageSelect
  ) {
    console.error("One or more DOM elements not found");
    return;
  }

  const searchInput = document
    .getElementById("search-input")
    .value.toLowerCase();
  const statusFilter = document.getElementById("status-filter").value;

  itemsPerPage = parseInt(itemsPerPageSelect.value, 10);

  // Lọc dữ liệu
  const filteredData = allData.filter(
    (item) =>
      item.content.toLowerCase().includes(searchInput) &&
      (statusFilter === "" || item.status === statusFilter)
  );

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // KCheck if `currentPage` is greater than total number of pages, reset to last page with data
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Check is `userName`
  let hasUserName = paginatedData.some((item) =>
    item.hasOwnProperty("userName")
  );

  // Update table header (avoid unnecessary updates)
  let newHeader = `
    <tr>
      <th>#</th>
      ${hasUserName ? `<th>User Name</th>` : ""}
      <th>Content</th>
      <th>Date Update</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  `;
  if (tableHeader.innerHTML !== newHeader) {
    tableHeader.innerHTML = newHeader;
  }

  // update new data
  dataList.innerHTML = "";
  paginatedData.forEach((item, index) => {
    const tr = document.createElement("tr");
    const statusClasses = {
      done: "text-success",
      doing: "text-primary",
      pending: "text-info",
      fail: "text-danger",
    };

    const statusDot = `<td><span class="status ${
      statusClasses[item.status] || "text-secondary"
    }">&bull;</span> ${item.status}</td>`;
    const displayAction =
      item.status === "fail"
        ? `<a href="#" class="settings" title="Resend" data-toggle="tooltip">
          <span class="material-symbols-outlined">refresh</span>
        </a>`
        : "";

    tr.innerHTML = `
      <td>${startIndex + index + 1}</td>
      ${hasUserName ? `<td>${item.userName}</td>` : ""}
      <td>${item.content}</td>
      <td>${formatDateVN(item.date)}</td>
      ${statusDot}
      <td>${displayAction}</td>
    `;

    dataList.appendChild(tr);
  });

  // Update total items
  totalEntries.textContent = totalItems;

  // Update page input
  pageNumberInput.value = currentPage;

  // Update pagination button status
  firstPage.classList.toggle("disabled", currentPage === 1);
  previousPage.classList.toggle("disabled", currentPage === 1);
  nextPage.classList.toggle("disabled", currentPage >= totalPages);
  lastPage.classList.toggle("disabled", currentPage >= totalPages);

  // Handling pagination events
  firstPage.onclick = () => {
    if (currentPage > 1) {
      currentPage = 1;
      renderTable();
    }
  };

  previousPage.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  };

  nextPage.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  };

  lastPage.onclick = () => {
    if (currentPage < totalPages) {
      currentPage = totalPages;
      renderTable();
    }
  };

  pageNumberInput.onchange = () => {
    let newPage = parseInt(pageNumberInput.value, 10);
    if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
      renderTable();
    } else {
      pageNumberInput.value = currentPage;
    }
  };

  itemsPerPageSelect.onchange = () => {
    itemsPerPage = parseInt(itemsPerPageSelect.value, 10);
    const newTotalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // If the current page exceeds the new page number, set to the last valid page
    if (currentPage > newTotalPages) {
      currentPage = newTotalPages;
    }

    renderTable();
  };
};
