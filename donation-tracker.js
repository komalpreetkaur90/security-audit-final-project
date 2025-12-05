document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("donation-form");
  const feedback = document.getElementById("form-feedback");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const charityName = document.getElementById("charity-name").value.trim();
    const donationAmount = document.getElementById("donation-amount").value.trim();
    const donationDate = document.getElementById("donation-date").value.trim();
    const donorMessage = document.getElementById("donor-message").value.trim();

    if (!charityName || !donationAmount || !donationDate || !donorMessage) {
      feedback.textContent = "Please fill in all required fields.";
      feedback.style.color = "red";
      console.log("Error message displayed");
      return;
    }

    feedback.textContent = "";
    feedback.style.color = "black";

    console.log("Form submitted successfully!");

    const donations = loadDonations();
    donations.push({
      charity: charityName,
      amount: parseFloat(donationAmount),
      date: donationDate,
      comment: donorMessage
    });

    saveDonations(donations);
    renderTable();
  });
});

// -------- Stage Two Helper Functions --------
function loadDonations() {
  const data = localStorage.getItem("donations");
  return data ? JSON.parse(data) : [];
}

function saveDonations(donations) {
  localStorage.setItem("donations", JSON.stringify(donations));
}

function renderTable() {
  const tableBody = document.querySelector("#donationTable tbody");
  const totalDisplay = document.getElementById("totalDonations");
  const donations = loadDonations();

  tableBody.innerHTML = "";
  let total = 0;

  donations.forEach((donation, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${donation.charity}</td>
      <td>$${donation.amount.toFixed(2)}</td>
      <td>${donation.date}</td>
      <td>${donation.comment}</td>
      <td><button data-index="${index}">Delete</button></td>
    `;

    row.querySelector("button").addEventListener("click", () => {
      deleteDonation(index);
    });

    total += donation.amount;
    tableBody.appendChild(row);
  });

  totalDisplay.textContent = `Total Donated: $${total.toFixed(2)}`;
}

function deleteDonation(index) {
  const donations = loadDonations();
  donations.splice(index, 1);
  saveDonations(donations);
  renderTable();
}
