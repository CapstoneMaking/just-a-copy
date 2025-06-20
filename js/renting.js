//import and config
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
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
const db = getFirestore(app);

//calendar
const bookedDates = {};
const calendar = document.getElementById("calendar");
const today = new Date();
let year = today.getFullYear();
let month = today.getMonth();
function pad(n) {
  return n.toString().padStart(2, '0');
}
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function renderCalendar(year, month, highlightDate = "") {
  calendar.innerHTML = `
    <div class="day-name">Sun</div>
    <div class="day-name">Mon</div>
    <div class="day-name">Tue</div>
    <div class="day-name">Wed</div>
    <div class="day-name">Thu</div>
    <div class="day-name">Fri</div>
    <div class="day-name">Sat</div>
  `;
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  //empty the first day if it is in the calendar
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendar.appendChild(document.createElement("div"));
  }
  //change the calendar to an actual calendar
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${pad(month + 1)}-${pad(i)}`;
    const div = document.createElement("div");
    div.className = "day";
    div.textContent = i;
    if (bookedDates[dateStr]){
      div.classList.add("booked");
    } 
    if (dateStr === highlightDate){
      div.style.border = "2px solid green";
    } 
    calendar.appendChild(div);
  }
}
//check date
document.getElementById("checkDate").addEventListener("change", () => {
  const input = document.getElementById("checkDate").value;
  const result = document.getElementById("checkResult");
  if (!input) {
    result.textContent = "Please select a date.";
    result.style.color = "red";
    return;
  }
  const booked = bookedDates[input];
  result.textContent = booked ? `${input} is already booked.` : `${input} is available.`;
  result.style.color = booked ? "red" : "green";

  const d = new Date(input);
  year = d.getFullYear();
  month = d.getMonth();
  renderCalendar(year, month, input);
});

//items
const selectedItems = [];
const itemSelect = document.getElementById("itemSelect");
const itemsDisplay = document.getElementById("itemsDisplay");
const selectedItemsList = document.getElementById("selectedItemsList");
const message = document.getElementById("message");
const items = {
  "Camera":      { qty: 3, img: "./assets/camera.jpg" },
  "Tripod":      { qty: 2, img: "./assets/tripod.png" },
  "Comset":      { qty: 3, img: "./assets/comset.jpg" },
  "Audio Mixer": { qty: 3, img: "./assets/audioMixer.png" },
  "Monitor":     { qty: 3, img: "./assets/monitor.png" },
  "Switcher":    { qty: 2, img: "./assets/switcher.jpg" }
};
//render the items that is available
function renderItems() {
  itemsDisplay.innerHTML = '';
  itemSelect.innerHTML = '';
  for (const [name, data] of Object.entries(items)) {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<img src="${data.img}" /><br>${name}<br>x${data.qty}`;
    itemsDisplay.appendChild(div);

    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    itemSelect.appendChild(option);
  }
}
//update selected items
function updateSelectedItemsList() {
  selectedItemsList.innerHTML = '';
  selectedItems.forEach(({ name, quantity }) => {
    const li = document.createElement("li");
    li.textContent = `${name} x${quantity}`;
    selectedItemsList.appendChild(li);
  });
}
//add item
document.getElementById("addItemBtn").addEventListener("click", () => {
  const item = itemSelect.value;
  const qty = parseInt(document.getElementById("quantityInput").value);
  if (!item || isNaN(qty) || qty <= 0) {
    message.textContent = "Please select a valid item and quantity.";
    message.style.color = "red";
    return;
  }
  const existing = selectedItems.find(i => i.name === item);
  const alreadyQty = existing ? existing.quantity : 0;
  if (items[item].qty < qty + alreadyQty) {
    message.textContent = `Not enough ${item}s available.`;
    message.style.color = "red";
    return;
  }
  if (existing) {
    existing.quantity += qty;
  } 
  else {
    selectedItems.push({ name: item, quantity: qty });
  }
  updateSelectedItemsList();
  message.textContent = "";
});
//remove item
document.getElementById("removeItemBtn").addEventListener("click", () => {
  const item = itemSelect.value;
  const qty = parseInt(document.getElementById("quantityInput").value);
  const existing = selectedItems.find(i => i.name === item);
  if (!item || isNaN(qty) || qty <= 0) {
    message.textContent = "Please select a valid item and quantity to remove.";
    message.style.color = "red";
    return;
  }
  if (!existing) {
    message.textContent = `You haven't selected any ${item}s yet.`;
    message.style.color = "red";
    return;
  }
  if (existing.quantity < qty) {
    message.textContent = `You only have ${existing.quantity} ${item}(s) selected.`;
    message.style.color = "red";
    return;
  }
  existing.quantity -= qty;
  if (existing.quantity === 0) {
    const index = selectedItems.indexOf(existing);
    selectedItems.splice(index, 1);
  }
  updateSelectedItemsList();
  message.textContent = "";
});

//next button going to confirmation 
document.getElementById("nextBtn").addEventListener("click", async () => {
  const startInput = document.getElementById("startDate").value;
  const endInput = document.getElementById("endDate").value;
  if (!startInput || !endInput) {
    message.textContent = "Please enter both start and end dates.";
    message.style.color = "red";
    return;
  }
  const start = new Date(startInput);
  const end = new Date(endInput);
  if (start > end) {
    message.textContent = "Start date must be before end date.";
    message.style.color = "red";
    return;
  }
  if (selectedItems.length === 0) {
    message.textContent = "No items selected.";
    message.style.color = "red";
    return;
  }
  //check date conflict
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    if (bookedDates[key]) {
      message.textContent = `${key} is already booked.`;
      message.style.color = "red";
      return;
    }
  }
  //store the datas(not in firestore) and go to confirmation
  const formData = {
    startDate: startInput,
    endDate: endInput,
    items: selectedItems
  };
  localStorage.setItem("bookingFormData", JSON.stringify(formData));
  window.location.href = "confirmation-page.html";
});

//load bookings to Firestore
const bookingsRef = collection(db, "bookings");
async function loadBookings() {
  const snapshot = await getDocs(bookingsRef);
  snapshot.forEach(doc => {
    const { startDate, endDate } = doc.data();
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      bookedDates[key] = true;
    }
  });
  renderCalendar(year, month);
}

renderItems();
await loadBookings();