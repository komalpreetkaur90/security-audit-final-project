const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.resolve(__dirname, "donation-tracker.html"), "utf8");

document.documentElement.innerHTML = html;

require("./donation-tracker.js");

describe("Integration Test - Donation Form", () => {
  let form, feedback;

  beforeEach(() => {
    localStorage.clear(); 
    document.documentElement.innerHTML = html;
    document.dispatchEvent(new Event("DOMContentLoaded"));

    document.getElementById("charity-name").value = "";
    document.getElementById("donation-amount").value = "";
    document.getElementById("donation-date").value = "";
    document.getElementById("donor-message").value = "";

    feedback = document.getElementById("form-feedback");
    feedback.textContent = "";

    form = document.getElementById("donation-form");
  });

  test("shows error message on empty form submission", async () => {
    form.dispatchEvent(new Event("submit", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(feedback.textContent).toBe("Please fill in all required fields.");
  });

  test("submits successfully with valid data", async () => {
    document.getElementById("charity-name").value = "Red Cross";
    document.getElementById("donation-amount").value = "100";
    document.getElementById("donation-date").value = "2025-04-01";
    document.getElementById("donor-message").value = "Keep up the great work!";

    form.dispatchEvent(new Event("submit", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(feedback.textContent).toBe("");
  });

  test("adds donation to localStorage on valid form submission", async () => {
    document.getElementById("charity-name").value = "UNICEF";
    document.getElementById("donation-amount").value = "50";
    document.getElementById("donation-date").value = "2025-04-05";
    document.getElementById("donor-message").value = "For children";

    form.dispatchEvent(new Event("submit", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 200));

    const donations = JSON.parse(localStorage.getItem("donations")) || [];
    expect(donations.length).toBe(1);
    expect(donations[0].charity).toBe("UNICEF");
  });

  test("total donation amount updates after submission", async () => {
    document.getElementById("charity-name").value = "WWF";
    document.getElementById("donation-amount").value = "30";
    document.getElementById("donation-date").value = "2025-04-10";
    document.getElementById("donor-message").value = "Save wildlife";

    form.dispatchEvent(new Event("submit", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 200));

    const totalDisplay = document.getElementById("totalDonations");
    expect(totalDisplay.textContent).toContain("30.00");
  });

  test("donation appears in table after submission", async () => {
    document.getElementById("charity-name").value = "Doctors Without Borders";
    document.getElementById("donation-amount").value = "75";
    document.getElementById("donation-date").value = "2025-04-12";
    document.getElementById("donor-message").value = "Thank you!";

    form.dispatchEvent(new Event("submit", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 200));

    const tableBody = document.querySelector("#donationTable tbody");
    expect(tableBody.children.length).toBe(1);
    expect(tableBody.innerHTML).toContain("Doctors Without Borders");
  });

  test("deletes donation from localStorage and updates table", async () => {
    // Add a donation
    document.getElementById("charity-name").value = "Greenpeace";
    document.getElementById("donation-amount").value = "60";
    document.getElementById("donation-date").value = "2025-04-15";
    document.getElementById("donor-message").value = "Environment matters";

    form.dispatchEvent(new Event("submit", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Manually call renderTable to reflect localStorage
    if (typeof renderTable === "function") {
      renderTable();
    }

    const deleteButton = document.querySelector("#donationTable button");
    deleteButton.click();
    await new Promise((resolve) => setTimeout(resolve, 200));

    const donations = JSON.parse(localStorage.getItem("donations")) || [];
    expect(donations.length).toBe(0);

    const tableBody = document.querySelector("#donationTable tbody");
    expect(tableBody.children.length).toBe(0);
  });
});








