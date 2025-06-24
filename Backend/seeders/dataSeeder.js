const db = require('../models/db');
const bcrypt = require('bcryptjs');

class DataSeeder {
  static async seedBooks() {
    const books = [
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "9780061120084"
      },
      {
        title: "1984",
        author: "George Orwell", 
        isbn: "9780451524935"
      },
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        isbn: "9780141439518"
      },
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "9780743273565"
      },
      {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        isbn: "9780316769174"
      },
      {
        title: "Lord of the Flies",
        author: "William Golding",
        isbn: "9780571058914"
      },
      {
        title: "Animal Farm",
        author: "George Orwell",
        isbn: "9780452284241"
      },
      {
        title: "Brave New World",
        author: "Aldous Huxley",
        isbn: "9780060850524"
      },
      {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        isbn: "9780547928227"
      },
      {
        title: "Fahrenheit 451",
        author: "Ray Bradbury",
        isbn: "9781451673319"
      },
      {
        title: "Jane Eyre",
        author: "Charlotte Brontë",
        isbn: "9780141441146"
      },
      {
        title: "Wuthering Heights",
        author: "Emily Brontë",
        isbn: "9780141439556"
      },
      {
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        isbn: "9780544003415"
      },
      {
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        isbn: "9780747532699"
      },
      {
        title: "The Da Vinci Code",
        author: "Dan Brown",
        isbn: "9780307474278"
      }
    ];

    console.log('Seeding books...');
    for (const book of books) {
      try {
        await db.execute(
          'INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)',
          [book.title, book.author, book.isbn]
        );
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          console.error(`Error inserting book ${book.title}:`, error.message);
        }
      }
    }
    console.log('Books seeded successfully!');
  }

  static async seedMembers() {
    const members = [
      {
        full_name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1234567890"
      },
      {
        full_name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "+1234567891"
      },
      {
        full_name: "Michael Brown",
        email: "michael.brown@email.com",
        phone: "+1234567892"
      },
      {
        full_name: "Emily Davis",
        email: "emily.davis@email.com",
        phone: "+1234567893"
      },
      {
        full_name: "David Wilson",
        email: "david.wilson@email.com",
        phone: "+1234567894"
      },
      {
        full_name: "Jessica Miller",
        email: "jessica.miller@email.com",
        phone: "+1234567895"
      },
      {
        full_name: "Christopher Moore",
        email: "christopher.moore@email.com",
        phone: "+1234567896"
      },
      {
        full_name: "Amanda Taylor",
        email: "amanda.taylor@email.com",
        phone: "+1234567897"
      },
      {
        full_name: "Matthew Anderson",
        email: "matthew.anderson@email.com",
        phone: "+1234567898"
      },
      {
        full_name: "Ashley Thomas",
        email: "ashley.thomas@email.com",
        phone: "+1234567899"
      },
      {
        full_name: "Daniel Jackson",
        email: "daniel.jackson@email.com",
        phone: "+1234567800"
      },
      {
        full_name: "Lisa White",
        email: "lisa.white@email.com",
        phone: "+1234567801"
      }
    ];

    console.log('Seeding members...');
    for (const member of members) {
      try {
        await db.execute(
          'INSERT INTO members (full_name, email, phone, status) VALUES (?, ?, ?, ?)',
          [member.full_name, member.email, member.phone, 'Active']
        );
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          console.error(`Error inserting member ${member.full_name}:`, error.message);
        }
      }
    }
    console.log('Members seeded successfully!');
  }

  static async seedLibrarians() {
    const librarians = [
      {
        name: "Admin User",
        email: "librarian@library.com",
        password: await bcrypt.hash("SecureLib@123", 10)
      },
      {
        name: "Jane Librarian",
        email: "jane@library.com", 
        password: await bcrypt.hash("library123", 10)
      },
      {
        name: "Robert Manager",
        email: "robert@library.com",
        password: await bcrypt.hash("manager123", 10)
      }
    ];

    console.log('Seeding librarians...');
    for (const librarian of librarians) {
      try {
        await db.execute(
          'INSERT INTO librarians (name, email, password) VALUES (?, ?, ?)',
          [librarian.name, librarian.email, librarian.password]
        );
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          console.error(`Error inserting librarian ${librarian.name}:`, error.message);
        }
      }
    }
    console.log('Librarians seeded successfully!');
  }

  static async seedLoans() {
    console.log('Seeding loans...');
    
    // Get existing books and members
    const [books] = await db.execute('SELECT id FROM books LIMIT 10');
    const [members] = await db.execute('SELECT id FROM members LIMIT 8');

    if (books.length === 0 || members.length === 0) {
      console.log('No books or members found. Skipping loan seeding.');
      return;
    }

    const loans = [
      {
        member_id: members[0].id,
        book_id: books[0].id,
        copy_number: 1,
        lent_on: '2024-12-01',
        due_on: '2024-12-15',
        returned_on: '2024-12-14'
      },
      {
        member_id: members[1].id,
        book_id: books[1].id,
        copy_number: 1,
        lent_on: '2024-12-05',
        due_on: '2024-12-19',
        returned_on: '2024-12-20'
      },
      {
        member_id: members[2].id,
        book_id: books[2].id,
        copy_number: 1,
        lent_on: '2024-12-10',
        due_on: '2024-12-24',
        returned_on: null
      },
      {
        member_id: members[3].id,
        book_id: books[3].id,
        copy_number: 1,
        lent_on: '2024-12-15',
        due_on: '2024-12-29',
        returned_on: null
      },
      {
        member_id: members[4].id,
        book_id: books[4].id,
        copy_number: 1,
        lent_on: '2025-01-01',
        due_on: '2025-01-15',
        returned_on: null
      },
      {
        member_id: members[5].id,
        book_id: books[5].id,
        copy_number: 1,
        lent_on: '2025-01-05',
        due_on: '2025-01-19',
        returned_on: '2025-01-18'
      },
      {
        member_id: members[6].id,
        book_id: books[6].id,
        copy_number: 1,
        lent_on: '2025-06-01',
        due_on: '2025-06-15',
        returned_on: null
      },
      {
        member_id: members[7].id,
        book_id: books[7].id,
        copy_number: 1,
        lent_on: '2025-06-10',
        due_on: '2025-06-24',
        returned_on: null
      }
    ];

    for (const loan of loans) {
      try {
        await db.execute(
          'INSERT INTO loans (member_id, book_id, copy_number, lent_on, due_on, returned_on) VALUES (?, ?, ?, ?, ?, ?)',
          [loan.member_id, loan.book_id, loan.copy_number, loan.lent_on, loan.due_on, loan.returned_on]
        );
      } catch (error) {
        console.error('Error inserting loan:', error.message);
      }
    }
    console.log('Loans seeded successfully!');
  }

  static async seedFines() {
    console.log('Seeding fines...');
    
    // Get members with overdue loans
    const [members] = await db.execute('SELECT id FROM members LIMIT 5');

    if (members.length === 0) {
      console.log('No members found. Skipping fine seeding.');
      return;
    }

    const fines = [
      {
        member_id: members[0].id,
        amount: 5.00,
        reason: 'Late return of book',
        paid: 1,
        issued_on: '2024-12-21'
      },
      {
        member_id: members[1].id,
        amount: 2.50,
        reason: 'Overdue fine',
        paid: 0,
        issued_on: '2025-01-20'
      },
      {
        member_id: members[2].id,
        amount: 10.00,
        reason: 'Damaged book cover',
        paid: 1,
        issued_on: '2025-02-15'
      },
      {
        member_id: members[3].id,
        amount: 7.50,
        reason: 'Late return - 5 days overdue',
        paid: 0,
        issued_on: '2025-06-15'
      },
      {
        member_id: members[4].id,
        amount: 3.00,
        reason: 'Late return - 2 days overdue',
        paid: 0,
        issued_on: '2025-06-20'
      }
    ];

    for (const fine of fines) {
      try {
        await db.execute(
          'INSERT INTO fines (member_id, amount, reason, paid, issued_on) VALUES (?, ?, ?, ?, ?)',
          [fine.member_id, fine.amount, fine.reason, fine.paid, fine.issued_on]
        );
      } catch (error) {
        console.error('Error inserting fine:', error.message);
      }
    }
    console.log('Fines seeded successfully!');
  }

  static async clearAllData() {
    console.log('Clearing existing data...');
    try {
      // Disable foreign key checks temporarily
      await db.execute('SET FOREIGN_KEY_CHECKS = 0');
      
      // Clear tables in reverse dependency order
      await db.execute('DELETE FROM fines');
      await db.execute('DELETE FROM loans');
      await db.execute('DELETE FROM members');
      await db.execute('DELETE FROM books');
      await db.execute('DELETE FROM librarians WHERE email != "librarian@library.com"');
      
      // Reset auto increment counters
      await db.execute('ALTER TABLE books AUTO_INCREMENT = 1');
      await db.execute('ALTER TABLE members AUTO_INCREMENT = 1');
      await db.execute('ALTER TABLE loans AUTO_INCREMENT = 1');
      await db.execute('ALTER TABLE fines AUTO_INCREMENT = 1');
      
      // Re-enable foreign key checks
      await db.execute('SET FOREIGN_KEY_CHECKS = 1');
      
      console.log('Data cleared successfully!');
    } catch (error) {
      console.error('Error clearing data:', error.message);
    }
  }

  static async seedAll() {
    try {
      console.log('Starting database seeding...');
      
      await this.seedBooks();
      await this.seedMembers();
      await this.seedLibrarians();
      await this.seedLoans();
      await this.seedFines();
      
      console.log('Database seeding completed successfully!');
    } catch (error) {
      console.error('Error during seeding:', error.message);
    }
  }

  static async run() {
    try {
      console.log('=== Library Management System Data Seeder ===');
      console.log('Choose an option:');
      console.log('1. Seed all data (without clearing)');
      console.log('2. Clear all data and seed fresh');
      console.log('3. Clear data only');
      console.log('4. Seed books only');
      console.log('5. Seed members only');
      console.log('6. Seed loans only');
      console.log('7. Seed fines only');

      // For command line usage, default to seed all
      const option = process.argv[2] || '1';

      switch (option) {
        case '1':
          await this.seedAll();
          break;
        case '2':
          await this.clearAllData();
          await this.seedAll();
          break;
        case '3':
          await this.clearAllData();
          break;
        case '4':
          await this.seedBooks();
          break;
        case '5':
          await this.seedMembers();
          break;
        case '6':
          await this.seedLoans();
          break;
        case '7':
          await this.seedFines();
          break;
        default:
          console.log('Invalid option. Running full seed...');
          await this.seedAll();
      }

      process.exit(0);
    } catch (error) {
      console.error('Seeder error:', error.message);
      process.exit(1);
    }
  }
}

// If this file is run directly
if (require.main === module) {
  DataSeeder.run();
}

module.exports = DataSeeder;
