import { useState } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TablePagination, 
  TextField,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { Edit, Delete, Add, Search } from '@mui/icons-material';
import { getBooks } from '../../utils/api';
import { Book3DViewer } from '../ui/Book3DViewer';

const BookList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  
  const { data, isLoading, error } = useQuery(['books', page, rowsPerPage, searchTerm], () => 
    getBooks({ 
      page: page + 1, 
      limit: rowsPerPage,
      search: searchTerm 
    })
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading books</div>;

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search books..."
          InputProps={{
            startAdornment: <Search color="action" sx={{ mr: 1 }} />,
          }}
          onChange={handleSearchChange}
        />
        <IconButton 
          color="primary" 
          onClick={() => router.push('/books/new')}
          sx={{ backgroundColor: '#1a237e', color: 'white', '&:hover': { backgroundColor: '#303f9f' } }}
        >
          <Add />
          <Box component="span" sx={{ ml: 1 }}>Add Book</Box>
        </IconButton>
      </Box>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="books table">
          <TableHead sx={{ backgroundColor: '#e8eaf6' }}>
            <TableRow>
              <TableCell>Cover</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Publisher</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data?.map((book) => (
              <TableRow key={book._id} hover>
                <TableCell>
                  <Box sx={{ width: 50, height: 70, backgroundColor: '#e8eaf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {book.coverImage ? (
                      <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <Book color="action" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.publisher}</TableCell>
                <TableCell>{book.publicationYear}</TableCell>
                <TableCell>
                  <Chip 
                    label={book.copies?.some(c => c.status === 'Available') ? 'Available' : 'Unavailable'} 
                    color={book.copies?.some(c => c.status === 'Available') ? 'success' : 'error'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => router.push(`/books/edit/${book._id}`)}>
                      <Edit color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton>
                      <Delete color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data?.total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default BookList;