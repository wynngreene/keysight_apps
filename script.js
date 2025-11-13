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
// LOAD DATA FROM LOCAL STORAGE
// ======================================================

let employeeNames = JSON.parse(localStorage.getItem('employeeNames')) || [];
let partNumbers = JSON.parse(localStorage.getItem('partNumbers')) || [];


// ======================================================
// INITIALIZE PAGE
// ======================================================

window.addEventListener('load', () => {
  const savedData = JSON.parse(localStorage.getItem('partsData')) || [];

  // Restore table rows
  savedData.forEach(entry => addRowToTable(entry));

  // Restore dropdown options
  employeeNames.forEach(name => addOption(employeeSelect, name));
  partNumbers.forEach(part => addOption(partSelect, part));
});


// ======================================================
// MAIN FORM — ADD ENTRY
// ======================================================

form1.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form1);
  const data = Object.fromEntries(formData.entries());

  // Save to localStorage
  const savedData = JSON.parse(localStorage.getItem('partsData')) || [];
  savedData.push(data);
  localStorage.setItem('partsData', JSON.stringify(savedData));

  // Update dropdowns if needed
  updateDropdowns(data.employeeName, data.partNumber);

  // Display on table
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
// HELPER FUNCTIONS
// ======================================================

function addRowToTable(data) {
  const row = tableBody.insertRow();

  row.insertCell(0).textContent = data.employeeName;
  row.insertCell(1).textContent = data.jobNumber;
  row.insertCell(2).textContent = data.partNumber;
  row.insertCell(3).textContent = data.quantity;
  row.insertCell(4).textContent = data.datePulled;
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
// TODAY BUTTON — AUTO-FILL DATE
// ======================================================

document.getElementById('todayDateBtn').addEventListener('click', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('datePulled1').value = today;
});


// ======================================================
// EXPORT TO CSV
// ======================================================

document.getElementById('exportBtn').addEventListener('click', () => {

  let csv = 'Employee Name,Job Number,Part Number,Quantity,Date Pulled\n';

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
// EXPORT TO TXT  (FIXED VERSION)
// ======================================================

document.getElementById('exportTxtBtn').addEventListener('click', () => {
  const savedData = JSON.parse(localStorage.getItem('partsData')) || [];
  let txt = '';

  savedData.forEach(entry => {
    txt += `Employee Name: ${entry.employeeName}\n`;
    txt += `Job Number: ${entry.jobNumber}\n`;
    txt += `Part Number: ${entry.partNumber}\n`;
    txt += `Quantity: ${entry.quantity}\n`;
    txt += `Date Pulled: ${entry.datePulled}\n`;
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
