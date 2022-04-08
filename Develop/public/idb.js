let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("budget", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    uploadBudget();
  }
};

request.onerror = function (record) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["budet"], "readwrite");

  const budgetStore = transaction.objectStore("budet");

  budgetStore.add(record);
}

function uploadBudget() {
  const transaction = db.transaction(["budet"], "readwrite");

  const budgetStore = transaction.objectStore("budet");

  const getAll = budgetStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (SErverResponse.message) {
            throw new Error(serverResponse);
          }

          const transaction = db.transaction(["budet"], "readwrite");
          const budgetStore = transaction.objectStore("budet");

          budgetStore.clear();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
}

window.addEventListener('online', uploadBudget);
