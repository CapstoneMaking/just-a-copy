//import and config
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyD9tMYYbrrIeg8IzJr6HsmSLTQkrpPS6O0",
  authDomain: "userlogindb-76260.firebaseapp.com",
  databaseURL: "https://userlogindb-76260-default-rtdb.firebaseio.com",
  projectId: "userlogindb-76260",
  storageBucket: "userlogindb-76260.firebasestorage.app",
  messagingSenderId: "1010679264774",
  appId: "1:1010679264774:web:780f788497e943015b7587"
};
const app = initializeApp(firebaseConfig);

//check the data if there is data in renting process
const bookingData = JSON.parse(localStorage.getItem("bookingFormData"));
const summary = document.getElementById("bookingSummary");
if (!bookingData) {
  summary.innerHTML = "<p class='error'>No booking data found. Please start from the main page.</p>";
  document.getElementById("confirmForm").style.display = "none";
} else {
  const { startDate, endDate, items } = bookingData;
  summary.innerHTML = `
    <h3>Booking Summary</h3>
    <p><strong>Date From:</strong> ${startDate}</p>
    <p><strong>Date To:</strong> ${endDate}</p>
    <p><strong>Items:</strong></p>
    <ul>
      ${items.map(item => `<li>${item.name} x${item.quantity}</li>`).join("")}
    </ul>
  `;
}

//submitting the confirmation and store data in firebase
const db = getFirestore(app);
const bookingsRef = collection(db, "bookings");
document.getElementById("confirmForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const venue = document.getElementById("venue").value.trim();
  const message = document.getElementById("message");
  try {
    await addDoc(bookingsRef, {
      ...bookingData,
      name,
      email,
      contact,
      venue,
      timestamp: new Date()
    });
    message.textContent = "Booking confirmed successfully!";
    document.getElementById("confirmForm").reset();
    document.getElementById("confirmForm").style.display = "none";
    localStorage.removeItem("bookingFormData");
  } catch (err) {
    message.textContent = "Failed to save booking. Please try again.";
    message.className = "error";
    console.error(err);
  }
});
