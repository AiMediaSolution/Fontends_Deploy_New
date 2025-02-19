function showToast(title, message, type) {
  const toast = new bootstrap.Toast(document.getElementById("csv-toast"));
  document.getElementById("toast-title").textContent = title;
  document.getElementById("toast-body").textContent = message;
  document.getElementById("csv-toast").classList.add(`text-bg-${type}`);
  toast.show();
}
function hideModal(modalId) {
  const modalElement = document.getElementById(modalId);
  if (modalElement) {
    const modalInstance =
      bootstrap.Modal.getInstance(modalElement) ||
      new bootstrap.Modal(modalElement);
    modalInstance.hide();
  } else {
    console.warn(`Modal with ID '${modalId}' not found.`);
  }
}
function showModal(modal) {
  const modalElement = document.getElementById(modal);
  if (modalElement) {
    const modalInstance =
      bootstrap.Modal.getInstance(modalElement) ||
      new bootstrap.Modal(modalElement);
    modalInstance.show();
  } else {
    console.warn(`Modal with ID '${modal}' not found.`);
  }
}

function formatDateVN(dateInput) {
  const dateObject = new Date(dateInput);
  const formatter = new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  });
  return formatter.format(dateObject);
}
globalThis.API_URL = "https://claim.mediasolution.ai";
globalThis.SOCKET_URL = "wss://claim.mediasolution.ai/ws";
