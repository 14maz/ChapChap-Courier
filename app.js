const barcodeInput = document.querySelector("#barcode-input");
const locationSelect = document.querySelector("#location-select");
const handlerSelect = document.querySelector("#handler-select");
const statusSelect = document.querySelector("#status-select");
const scanButton = document.querySelector("#scan-button");
const logBody = document.querySelector("#scan-log-body");
const notificationCard = document.querySelector("#notification-card");
const dbParcel = document.querySelector("#db-parcel");
const dbHandler = document.querySelector("#db-handler");
const dbLocation = document.querySelector("#db-location");
const dbTime = document.querySelector("#db-time");
const dbStatus = document.querySelector("#db-status");
const dbNotification = document.querySelector("#db-notification");
const scanSummary = document.querySelector("#scan-summary");

const renderNotification = ({ barcode, location, handler, status, time }) => {
  const isDelivered = status.toLowerCase() === "delivered";
  const statusClass = `status-${status.toLowerCase().replace(/\s+/g, "-")}`;
  const deliveryMessage = isDelivered
    ? "Your parcel reached the final destination and is marked as delivered."
    : "Your package status has been updated in the courier system.";

  notificationCard.innerHTML = `
    <div class="notification-header">
      <p class="notification-title">${status} — ${barcode}</p>
      <span class="status-pill ${statusClass}">${status}</span>
    </div>
    <p class="notification-body">
      Parcel updated by ${handler} at ${location}. ${deliveryMessage}
    </p>
    <div class="notification-meta">
      <span id="notification-time">Last updated: ${time}</span>
      <span id="notification-status">Status: ${status}</span>
    </div>
  `;
};

const addLogRow = ({ barcode, location, handler, status, time }) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${time}</td>
    <td>${barcode}</td>
    <td>${location}</td>
    <td>${handler}</td>
    <td>${status}</td>
  `;
  logBody.prepend(row);
};

const handleScan = () => {
  const barcode = barcodeInput.value.trim() || "CC-2048-9912";
  const location = locationSelect.value;
  const handler = handlerSelect.value;
  const status = statusSelect.value;
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const scanData = { barcode, location, handler, status, time };

  addLogRow(scanData);
  renderNotification(scanData);
  dbParcel.textContent = barcode;
  dbHandler.textContent = handler;
  dbLocation.textContent = location;
  dbTime.textContent = time;
  dbStatus.textContent = status;
  dbNotification.textContent = status.toLowerCase() === "delivered" ? "Delivered sent" : "Sent";
  scanSummary.textContent = `Last scan: ${barcode} • ${status} at ${location} (${time})`;
  barcodeInput.value = "";
};

scanButton.addEventListener("click", handleScan);

// --- Demo controls and automated demo scans ---
const demoOnceButton = document.querySelector("#demo-once");
const demoStartButton = document.querySelector("#demo-start");
const demoStopButton = document.querySelector("#demo-stop");

const demoScans = [
  {
    barcode: "CC-7781-2024",
    location: "Nairobi Hub",
    handler: "Worker: Amina K.",
    status: "Picked up",
  },
  {
    barcode: "CC-7781-2024",
    location: "Mombasa Port",
    handler: "Worker: David O.",
    status: "In transit",
  },
  {
    barcode: "CC-7781-2024",
    location: "Kisumu Depot",
    handler: "Worker: Faith N.",
    status: "Arrived at hub",
  },
  {
    barcode: "CC-7781-2024",
    location: "Final Destination",
    handler: "Worker: Amina K.",
    status: "Delivered",
  },
];

let demoInterval = null;
let demoIndex = 0;

const applyDemoScan = () => {
  const nextScan = demoScans[demoIndex];
  demoIndex = (demoIndex + 1) % demoScans.length;
  if (!nextScan) return;
  barcodeInput.value = nextScan.barcode;
  locationSelect.value = nextScan.location;
  handlerSelect.value = nextScan.handler;
  statusSelect.value = nextScan.status;
  handleScan();
};

const startDemo = () => {
  if (demoInterval) {
    return;
  }
  if (demoStartButton) demoStartButton.disabled = true;
  if (demoStopButton) demoStopButton.disabled = false;
  if (demoOnceButton) demoOnceButton.disabled = true;
  applyDemoScan();
  demoInterval = setInterval(applyDemoScan, 5000);
};

const stopDemo = () => {
  if (!demoInterval) {
    return;
  }
  clearInterval(demoInterval);
  demoInterval = null;
  if (demoStartButton) demoStartButton.disabled = false;
  if (demoStopButton) demoStopButton.disabled = true;
  if (demoOnceButton) demoOnceButton.disabled = false;
};

if (demoOnceButton) demoOnceButton.addEventListener("click", applyDemoScan);
if (demoStartButton) demoStartButton.addEventListener("click", startDemo);
if (demoStopButton) demoStopButton.addEventListener("click", stopDemo);
