// ======================================================
// DOM ELEMENTS
// ======================================================

const form1 = document.getElementById('form1');
const addEmployeeForm = document.getElementById('addEmployeeForm');
const addPartForm = document.getElementById('addPartForm');
const tableBody = document.querySelector('#dataTable tbody');

const employeeSelect = document.getElementById('employeeName1');
const partSelect = document.getElementById('partNumber1');

// ======================================================
// LOAD DATA
// ======================================================

let employeeNames = JSON.parse(localStorage.getItem('employeeNames')) || [];
let partNumbers = JSON.parse(localStorage.getItem('partNumbers')) || [];

// ======================================================
// INITIAL LOAD
// ======================================================

window.addEventListener('load', () => {
  const savedData = JSON.parse(localStorage.getItem('partsData')) || [];
  savedData.forEach(entry => addRowToTable(entry));

  employeeNames.forEach(name => addOption(employeeSelect, name));
  partNumbers.forEach(part => addOption(partSelect, part));
});

// ======================================================
// MAIN FORM SUBMIT
// ======================================================

form1.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form1);
  const data = Object.fromEntries(formData.entries());

  // Auto insert timestamp
  data.timeRequested = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Default values for optional fields
  data.inventoryCount = data.inventoryCount || "";
  data.notes = data.notes || "";
  data.adjustCount = data.adjustCount ? data.adjustCount : "N/A";

  // Save to storage
  const savedData = JSON.parse(localStorage.getItem('partsData')) || [];
  savedData.push(data);
  localStorage.setItem('partsData', JSON.stringify(savedData));

  updateDropdowns(data.employeeName, data.partNumber);
  addRowToTable(data);

  form1.reset();
});

// ======================================================
// ADD EMPLOYEE
// ======================================================

addEmployeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('employeeName2').value.trim();
  if (name && !employeeNames.includes(name)) {
    employeeNames.push(name);
    localStorage.setItem('employeeNames', JSON.stringify(employeeNames));
    addOption(employeeSelect, name);
  }
  addEmployeeForm.reset();
});

// ======================================================
// ADD PART NUMBER
// ======================================================

addPartForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const part = document.getElementById('partNumber2').value.trim();
  if (part && !partNumbers.includes(part)) {
    partNumbers.push(part);
    localStorage.setItem('partNumbers', JSON.stringify(partNumbers));
    addOption(partSelect, part);
  }
  addPartForm.reset();
});

// ======================================================
// TABLE ROW BUILDER
// ======================================================

function addRowToTable(data) {
  const row = tableBody.insertRow();

  // Match the header order:
  // Employee | Job | Part | Qty | Inventory | Adjust | Date | Time | Fulfilled (button) | Notes
  row.insertCell(0).textContent = data.employeeName || '';
  row.insertCell(1).textContent = data.jobNumber || '';
  row.insertCell(2).textContent = data.partNumber || '';
  row.insertCell(3).textContent = data.quantity || '';
  row.insertCell(4).textContent = data.inventoryCount || '';
  row.insertCell(5).textContent = data.adjustCount || 'N/A';
  row.insertCell(6).textContent = data.datePulled || '';
  row.insertCell(7).textContent = data.timeRequested || '';

  // Fulfilled button column
  const fulfilledCell = row.insertCell(8);
  const fulfilledBtn = document.createElement('button');
  fulfilledBtn.type = 'button';
  fulfilledBtn.textContent = 'Fulfilled';
  fulfilledBtn.addEventListener('click', () => {
    const msg = `Request Details:\n` +
                `Employee: ${data.employeeName || ''}\n` +
                `Job Number: ${data.jobNumber || ''}\n` +
                `Part Number: ${data.partNumber || ''}\n` +
                `Quantity: ${data.quantity || ''}\n` +
                `Date Pulled: ${data.datePulled || ''}\n` +
                `Time of Request: ${data.timeRequested || ''}`;
    alert(msg);
  });
  fulfilledCell.appendChild(fulfilledBtn);

  // Notes column
  row.insertCell(9).textContent = data.notes || '';
}

function addOption(select, value) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = value;
  select.appendChild(option);
}

function updateDropdowns(employeeName, partNumber) {
  if (employeeName && !employeeNames.includes(employeeName)) {
    employeeNames.push(employeeName);
    localStorage.setItem('employeeNames', JSON.stringify(employeeNames));
    addOption(employeeSelect, employeeName);
  }

  if (partNumber && !partNumbers.includes(partNumber)) {
    partNumbers.push(partNumber);
    localStorage.setItem('partNumbers', JSON.stringify(partNumbers));
    addOption(partSelect, partNumber);
  }
}

// ======================================================
// TODAY BUTTON
// ======================================================

document.getElementById('todayDateBtn').addEventListener('click', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('datePulled1').value = today;
});

// ======================================================
// EXPORT CSV
// ======================================================

document.getElementById('exportBtn').addEventListener('click', () => {
  let csv = 'Employee Name,Job Number,Part Number,Quantity,Inventory Count,Adjust Count,Date Pulled,Time of Request,Fulfilled,Notes\n';

  const rows = tableBody.querySelectorAll('tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const rowData = Array.from(cells).map(c => `"${c.textContent}"`).join(',');
    csv += rowData + '\n';
  });

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = 'parts_tracker.csv';
  a.click();

  URL.revokeObjectURL(url);
});

// ======================================================
// EXPORT TXT
// ======================================================

document.getElementById('exportTxtBtn').addEventListener('click', () => {
  const savedData = JSON.parse(localStorage.getItem('partsData')) || [];
  let txt = '';

  savedData.forEach(entry => {
    txt += `Employee Name: ${entry.employeeName}\n`;
    txt += `Job Number: ${entry.jobNumber}\n`;
    txt += `Part Number: ${entry.partNumber}\n`;
    txt += `Quantity: ${entry.quantity}\n`;
    txt += `Inventory Count (at time): ${entry.inventoryCount || ''}\n`;
    txt += `Adjust Count: ${entry.adjustCount || 'N/A'}\n`;
    txt += `Date Pulled: ${entry.datePulled}\n`;
    txt += `Time of Request: ${entry.timeRequested || ''}\n`;
    txt += `Notes: ${entry.notes || ''}\n`;
    txt += '------------------------------\n';
  });

  const blob = new Blob([txt], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = 'parts_tracker.txt';
  a.click();

  URL.revokeObjectURL(url);
});
