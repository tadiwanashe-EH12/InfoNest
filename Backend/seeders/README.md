# Database Seeder

This seeder populates your InfoNest library management database with sample data for testing and development purposes.

## Features

The seeder includes:
- **Books**: 15 popular books with realistic titles, authors, and ISBNs
- **Members**: 12 library members with contact information
- **Librarians**: 3 librarian accounts with hashed passwords
- **Loans**: Sample loan records with various statuses (active, returned, overdue)
- **Fines**: Sample fine records for testing payment functionality

## Usage

### Using npm scripts (Recommended)

```bash
# Seed all data (keeps existing data)
npm run seed

# Clear all data and seed fresh
npm run seed:fresh

# Clear all data only
npm run seed:clear
```

### Using node directly

```bash
# Seed all data
node seeders/dataSeeder.js

# Clear and seed fresh
node seeders/dataSeeder.js 2

# Clear data only
node seeders/dataSeeder.js 3

# Seed specific data types
node seeders/dataSeeder.js 4  # Books only
node seeders/dataSeeder.js 5  # Members only
node seeders/dataSeeder.js 6  # Loans only
node seeders/dataSeeder.js 7  # Fines only
```

## Sample Data Details

### Librarians
- **admin@library.com** (password: admin123)
- **jane@library.com** (password: library123)
- **robert@library.com** (password: manager123)

### Members
Sample members with realistic names, emails, and phone numbers for testing member management features.

### Books
Classic and popular books including:
- To Kill a Mockingbird
- 1984
- Pride and Prejudice
- The Great Gatsby
- Harry Potter and the Philosopher's Stone
- And more...

### Loans
Sample loan records with:
- Active loans (not yet returned)
- Returned loans (on time)
- Overdue loans (for testing fine calculations)

### Fines
Sample fines for:
- Late returns
- Damaged books
- Overdue penalties

## Important Notes

1. **Database Connection**: Ensure your `.env` file is properly configured with database credentials
2. **Foreign Keys**: The seeder handles foreign key constraints properly
3. **Duplicates**: The seeder handles duplicate entries gracefully
4. **Data Safety**: The clear option only removes seeded data, preserving the original admin librarian account

## Environment Setup

Make sure your `.env` file contains:
```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=info_nest
```

## Running in Development

1. First, ensure your database is set up with the provided SQL schema
2. Run the seeder:
   ```bash
   npm run seed:fresh
   ```
3. Start your development server:
   ```bash
   npm run dev
   ```

The seeded data will be available for testing all library management features including book lending, member management, fine tracking, and reporting.
