const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/books', require('./routes/book.routes'));
app.use('/api/members', require('./routes/member.routes'));
app.use('/api/loans', require('./routes/loan.routes'));
app.use('/api/fines', require('./routes/fine.routes'));
app.use('/api/reports', require('./routes/report.routes'));

// Global error handler
app.use(errorHandler);

module.exports = app;

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/books', require('./routes/book.routes'));
// ...etc.
