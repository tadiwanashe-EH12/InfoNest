document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
  const librarian = data.user;
  sessionStorage.setItem('librarian', JSON.stringify(librarian));
  showToast('Login successful! 🔓', '#2ecc71');

  // Show the app interface and dashboard
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('appSection').style.display = 'flex'; // or 'block' depending on your CSS
  document.getElementById('dashboardSection').style.display = 'block';

  const greetings = [
  `👋 Hello, ${librarian.name}! Ready for another productive day?`,
  `📚 Welcome back, ${librarian.name}! Let’s make InfoNest shine.`,
  `🕵️‍♀️ Greetings, Chief Curator ${librarian.name}!`,
  `🌟 ${librarian.name}, your knowledge empire awaits.`
];
document.getElementById('librarianName').textContent = greetings[Math.floor(Math.random() * greetings.length)];

}

    else {
      showToast(data.message || 'Login failed', '#e74c3c');
    }
  } catch (err) {
    showToast('Server error. Please try again later.', '#e74c3c');
  }
});

document.getElementById('memberHistorySelect').addEventListener('change', function () {
  const memberId = this.value;
  if (memberId) loadMemberHistory(memberId);
});

function showSection(sectionId) {
  const sections = [
    'dashboardSection',
    'membersSection',
    'booksSection',
    'lendingSection',
    'finesSection',
    'reportsSection'
  ];

  sections.forEach(id => {
    document.getElementById(id).style.display = (id === sectionId + 'Section') ? 'block' : 'none';
  });

  // Optional: Update active class on sidebar
  document.querySelectorAll('.sidebar a').forEach(link => {
    link.classList.remove('active');
  });
  const activeLink = Array.from(document.querySelectorAll('.sidebar a'))
    .find(link => link.getAttribute('onclick')?.includes(sectionId));
  if (activeLink) activeLink.classList.add('active');
}


async function loadMembers() {
  try {
    const res = await fetch('http://localhost:3000/api/members');
    const members = await res.json();

    const container = document.getElementById('memberList');
    container.innerHTML = ''; // Clear previous list

    members.forEach(member => {
      const div = document.createElement('div');
      div.className = 'member-card';
      div.innerHTML = `
        <h4>${member.full_name}</h4>
        <p>Email: ${member.email}</p>
        <p>Phone: ${member.phone}</p>
        <p>Joined: ${new Date(member.membership_date).toLocaleDateString()}</p>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error('Failed to load members:', err);
  }
}

// Navigation
async function viewCopies(bookId, title) {
  try {
    const res = await fetch(`http://localhost:3000/api/copies/book/${bookId}`);
    const copies = await res.json();

    document.getElementById('copyBookTitle').textContent = `Copies of "${title}"`;
    const container = document.getElementById('copyList');
    container.innerHTML = '';

    copies.forEach(copy => {
      const statusColor = {
        'Available': '#2ecc71',
        'Borrowed': '#e67e22',
        'Lost': '#e74c3c'
      }[copy.status] || '#999';

      const card = document.createElement('div');
      card.className = 'copy-card';
      card.innerHTML = `
        <p><strong>Barcode:</strong> ${copy.barcode}</p>
        <p><strong>Status:</strong> <span style="color:${statusColor}">${copy.status}</span></p>
      `;

      const select = document.createElement('select');
      ['Available', 'Borrowed', 'Lost'].forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        if (copy.status === status) option.selected = true;
        select.appendChild(option);
      });

      select.addEventListener('change', async function () {
        try {
          const res = await fetch(`http://localhost:3000/api/copies/${copy.id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: this.value })
          });

          if (res.ok) {
            showToast('Copy status updated ✅', '#0072ff');
            viewCopies(bookId, title); // Refresh view
          }
        } catch (err) {
          console.error('Status update failed:', err);
        }
      });

      card.appendChild(select);
      container.appendChild(card);
    });

    document.getElementById('copySection').style.display = 'block';
  } catch (err) {
    console.error('Failed to load copies:', err);
  }
}

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('show');
}


// Member Management
document.getElementById('memberForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const fullName = this[0].value.trim();
  const email = this[1].value.trim();
  const phone = this[2].value.trim();

  if (!fullName || !email || !phone) {
    alert('Please fill in all fields.');
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    alert('Invalid email format');
    return;
  }

  if (!/^\d{7,15}$/.test(phone.replace(/\D/g, ''))) {
    alert('Phone number should be 7–15 digits');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, email, phone })
    });

    if (res.ok) {
      alert('Member added successfully');
      this.reset();
      loadMembers();
    } else {
      const msg = await res.json();
      alert('Error: ' + (msg?.error || 'Failed to add member'));
    }
  } catch (err) {
    alert('Network error');
    console.error(err);
  }
});

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

async function updateMember(id, updatedData) {
  try {
    const res = await fetch(`http://localhost:3000/api/members/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });

    if (res.ok) {
      alert('Member updated successfully');
      loadMembers(); // refresh the list
    } else {
      console.error('Update failed');
    }
  } catch (err) {
    console.error('Update error:', err);
  }
}
async function deleteMember(id) {
  if (!confirm('Are you sure you want to inactivate this member?')) return;

  try {
    const res = await fetch(`http://localhost:3000/api/members/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert('Member inactivated');
      loadMembers();
    } else {
      console.error('Delete failed');
    }
  } catch (err) {
    console.error('Deletion error:', err);
  }
}
async function addBook(bookData) {
  try {
    const res = await fetch('http://localhost:3000/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });

    if (res.ok) {
      alert('Book added');
      loadBooks();
    } else {
      const msg = await res.json();
      alert('Failed to add book: ' + msg.error);
    }
  } catch (err) {
    console.error('Add book error:', err);
  }
}
async function updateBook(id, updatedBook) {
  try {
    const res = await fetch(`http://localhost:3000/api/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBook)
    });

    if (res.ok) {
      alert('Book updated');
      loadBooks();
    }
  } catch (err) {
    console.error('Book update error:', err);
  }
}
async function deleteBook(id) {
  if (!confirm('Delete this book?')) return;

  try {
    const res = await fetch(`http://localhost:3000/api/books/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert('Book deleted');
      loadBooks();
    }
  } catch (err) {
    console.error('Book delete error:', err);
  }
}
async function lendBook(data) {
  try {
    const res = await fetch('http://localhost:3000/api/lending', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert('Book lent');
      loadLoans();
    }
  } catch (err) {
    console.error('Lending error:', err);
  }
}
async function returnBook(loanId) {
  if (!confirm('Confirm return?')) return;

  try {
    const res = await fetch(`http://localhost:3000/api/lending/return/${loanId}`, {
      method: 'PUT'
    });

    if (res.ok) {
      alert('Book returned');
      loadLoans();
    }
  } catch (err) {
    console.error('Return error:', err);
  }
}
async function addFine(fineData) {
  try {
    const res = await fetch('http://localhost:3000/api/fines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fineData)
    });

    if (res.ok) {
      alert('Fine recorded');
      loadFines();
    }
  } catch (err) {
    console.error('Fine error:', err);
  }
}
async function markFinePaid(fineId) {
  try {
    const res = await fetch(`http://localhost:3000/api/fines/pay/${fineId}`, {
      method: 'PUT'
    });

    if (res.ok) {
      alert('Fine marked as paid');
      loadFines();
    }
  } catch (err) {
    console.error('Fine payment error:', err);
  }
}
async function loadOverdueLoans() {
  const res = await fetch('http://localhost:3000/api/reports/overdue-loans');
  const loans = await res.json();
  console.log('Overdue:', loans);
  // Render to UI as needed
}
async function loadUnpaidFines() {
  const res = await fetch('http://localhost:3000/api/reports/unpaid-fines');
  const fines = await res.json();
  console.log('Unpaid fines:', fines);
  // Render to UI
}
async function loadMemberHistory(memberId) {
  const res = await fetch(`http://localhost:3000/api/reports/member-history/${memberId}`);
  const history = await res.json();
  console.log('History:', history);
  // Display as timeline or table
}
async function loadOverdueLoans() {
  try {
    const res = await fetch('http://localhost:3000/api/reports/overdue-loans');
    const data = await res.json();
    const container = document.getElementById('overdueReport');
    container.innerHTML = '';

    data.forEach(loan => {
      const card = document.createElement('div');
      card.className = 'report-card overdue';
      card.innerHTML = `
        <h4>${loan.book}</h4>
        <p><strong>Member:</strong> ${loan.member}</p>
        <p><strong>Due:</strong> ${new Date(loan.due_on).toLocaleDateString()}</p>
        <p><strong>Overdue:</strong> ${loan.days_overdue} days</p>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Overdue fetch error:', err);
  }
}
async function loadUnpaidFines() {
  try {
    const res = await fetch('http://localhost:3000/api/reports/unpaid-fines');
    const data = await res.json();
    const container = document.getElementById('fineReport');
    container.innerHTML = '';

    data.forEach(fine => {
      const card = document.createElement('div');
      card.className = 'report-card fine';
      card.innerHTML = `
        <h4>${fine.member}</h4>
        <p><strong>Amount:</strong> $${fine.amount}</p>
        <p><strong>Reason:</strong> ${fine.reason}</p>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Fines fetch error:', err);
  }
}
async function loadMemberDropdown() {
  const res = await fetch('http://localhost:3000/api/members');
  const data = await res.json();

  const select = document.getElementById('memberHistorySelect');
  select.innerHTML = `<option value="">Select a member</option>`;
  data.forEach(member => {
    const opt = document.createElement('option');
    opt.value = member.id;
    opt.textContent = member.full_name;
    select.appendChild(opt);
  });
}

async function loadMemberHistory(memberId) {
  try {
    const res = await fetch(`http://localhost:3000/api/reports/member-history/${memberId}`);
    const loans = await res.json();
    const container = document.getElementById('memberHistoryList');
    container.innerHTML = '';

    loans.forEach(loan => {
      const card = document.createElement('div');
      card.className = 'report-card history';
      card.innerHTML = `
        <h4>${loan.title}</h4>
        <p><strong>Lent:</strong> ${new Date(loan.lent_on).toLocaleDateString()}</p>
        <p><strong>Due:</strong> ${new Date(loan.due_on).toLocaleDateString()}</p>
        <p><strong>Returned:</strong> ${
          loan.returned_on ? new Date(loan.returned_on).toLocaleDateString() : '⏳ Not yet'
        }</p>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load history:', err);
  }
}
function exportReport(type) {
  let rows = [];
  let headers = [];
  if (type === 'overdue') {
    const cards = document.querySelectorAll('#overdueReport .report-card');
    headers = ['Book', 'Member', 'Due Date', 'Days Overdue'];
    cards.forEach(card => {
      const cells = card.querySelectorAll('p');
      rows.push([
        card.querySelector('h4').innerText,
        cells[0].innerText.split(': ')[1],
        cells[1].innerText.split(': ')[1],
        cells[2].innerText.split(': ')[1]
      ]);
    });
  } else if (type === 'fines') {
    const cards = document.querySelectorAll('#fineReport .report-card');
    headers = ['Member', 'Amount', 'Reason'];
    cards.forEach(card => {
      const cells = card.querySelectorAll('p');
      rows.push([
        card.querySelector('h4').innerText,
        cells[0].innerText.split(': ')[1],
        cells[1].innerText.split(': ')[1]
      ]);
    });
  }

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${type}_report.csv`);
  link.click();
}
function showToast(message, bg = '#222') {
  const toast = document.getElementById('toast');
  const div = document.createElement('div');
  div.className = 'toast';
  div.style.background = bg;
  div.textContent = message;
  toast.appendChild(div);

//   showToast('Member updated! 🎉', '#0072ff');
// showToast('Fine recorded', '#f39c12');
// showToast('Book returned 📘', '#2ecc71');

  setTimeout(() => {
    div.style.opacity = 0;
    setTimeout(() => div.remove(), 600);
  }, 2500);
}
