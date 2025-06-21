// Login Logic
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (email === 'librarian@library.com' && password === 'SecureLib@123') {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('appSection').style.display = 'flex';
  } else {
    alert('Incorrect credentials');
  }
});

// Navigation
function showSection(section) {
  document.getElementById('dashboardSection').style.display = 'none';
  document.getElementById('membersSection').style.display = 'none';
  document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));

  if (section === 'dashboard') {
    document.getElementById('dashboardSection').style.display = 'block';
    document.querySelectorAll('.sidebar a')[0].classList.add('active');
  } else if (section === 'members') {
    document.getElementById('membersSection').style.display = 'block';
    document.querySelectorAll('.sidebar a')[1].classList.add('active');
  }
}

// Member Management
document.getElementById('memberForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = this[0].value;
  const email = this[1].value;
  const phone = this[2].value;

  const div = document.createElement('div');
  div.classList.add('member-card');
  div.innerHTML = `<h4>${name}</h4><p>${email}</p><p>${phone}</p>`;

  document.getElementById('memberList').appendChild(div);
  this.reset();
});
function showSection(section) {
  const sections = ['dashboard', 'members', 'books', 'lending'];
  sections.forEach(id => {
    document.getElementById(`${id}Section`).style.display = 'none';
  });

  document.getElementById(`${section}Section`).style.display = 'block';
  document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
  const index = sections.indexOf(section);
  if (index !== -1) {
    document.querySelectorAll('.sidebar a')[index].classList.add('active');
  }
}

// Book Management
document.getElementById('bookForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const title = this[0].value;
  const author = this[1].value;
  const isbn = this[2].value;

  const div = document.createElement('div');
  div.classList.add('book-card');
  div.innerHTML = `<h4>${title}</h4><p>${author}</p><p>ISBN: ${isbn}</p>`;

  document.getElementById('bookList').appendChild(div);
  this.reset();
});

// Lending System
document.getElementById('lendForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const member = this[0].value;
  const book = this[1].value;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14);

  const div = document.createElement('div');
  div.classList.add('loan-card');
  div.innerHTML = `<h4>${book}</h4><p>Lent to: ${member}</p><p>Due: ${dueDate.toDateString()}</p>`;

  document.getElementById('loanList').appendChild(div);
  this.reset();
});

// Fines Module
document.getElementById('fineForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const member = this[0].value;
  const amount = this[1].value;

  const div = document.createElement('div');
  div.classList.add('fine-card');
  div.innerHTML = `<p><strong>${member}</strong> owes $${amount}</p><p>Status: Unpaid</p>`;
  document.getElementById('fineList').appendChild(div);

  this.reset();
});

// Reporting Module (Highlights overdue)
function updateReports() {
  const loans = document.querySelectorAll('.loan-card');
  const report = document.getElementById('activeLoansReport');
  report.innerHTML = '';

  loans.forEach(loan => {
    const text = loan.innerText;
    const dueText = loan.querySelector('p:nth-child(3)').innerText.replace('Due: ', '');
    const due = new Date(dueText);
    const today = new Date();
    const isOverdue = due < today;

    const p = document.createElement('p');
    p.innerText = text;
    if (isOverdue) p.classList.add('overdue');
    report.appendChild(p);
  });
}

// Refresh report on lending
document.getElementById('lendForm').addEventListener('submit', () => {
  setTimeout(updateReports, 100);
});
