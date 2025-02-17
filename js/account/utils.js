// Read file csv in local
function processCSV() {
  const fileInput = document.getElementById("file-input");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a CSV file first.");
    return;
  }

  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: async function (results) {
      const users = results.data
        .filter((row) => row.userName && row.passWord) // Filter out blank or invalid rows
        .map((row) => ({
          userName: row.userName,
          passWord: row.passWord,
        }));

      console.log(users);
      // Add each user account
      for (const user of users) {
        await addListAccount(user.userName, user.passWord);
      }
    },
    error: function (error) {
      showToast("Warning", "Error reading CSV file!", "warning");
      console.warn("Error reading CSV file:", error);
    },
  });
}

// Add list account customer
async function addListAccount(username, password) {
  const accountType = "customer";
  try {
    const response = await fetchWithAuth(`${apiUrl}/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountType, username, password }),
    });
    if (!response.ok) {
      showToast("Success", "CSV file processed successfully!", "danger");
      throw new Error("Failed to create account");
    }
    hideModal("uploadCSVModal");
    showToast("Success", "Add account by CSV successfully!", "success");
  } catch (error) {
    showToast("Fail", "Add account fail. Please try again!", "danger");
    console.warn("Error creating account:", error);
  }
}
