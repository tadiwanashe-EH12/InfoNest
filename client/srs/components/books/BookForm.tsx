import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Box, 
  Button, 
  TextField, 
  Grid, 
  Paper, 
  Typography, 
  MenuItem, 
  Chip,
  Avatar,
  IconButton
} from '@mui/material';
import { Save, Cancel, AddPhotoAlternate } from '@mui/icons-material';
import { getBookDetails, createBook, updateBook } from '../../utils/api';

const bookSchema = z.object({
  isbn: z.string().min(10, 'ISBN must be at least 10 characters'),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  publisher: z.string().min(1, 'Publisher is required'),
  publicationYear: z.number().min(1000, 'Invalid year').max(new Date().getFullYear(), 'Year cannot be in the future'),
  genre: z.array(z.string()).min(1, 'At least one genre is required'),
  summary: z.string().optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

const BookForm = ({ bookId }: { bookId?: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(!!bookId);
  const [coverPreview, setCoverPreview] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [currentGenre, setCurrentGenre] = useState('');

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
  });

  useEffect(() => {
    if (bookId) {
      const fetchBook = async () => {
        try {
          const book = await getBookDetails(bookId);
          reset({
            isbn: book.isbn,
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            publicationYear: book.publicationYear,
            genre: book.genre,
            summary: book.summary,
          });
          setGenres(book.genre);
          if (book.coverImage) setCoverPreview(book.coverImage);
        } catch (error) {
          console.error('Error fetching book:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBook();
    }
  }, [bookId, reset]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGenre = () => {
    if (currentGenre && !genres.includes(currentGenre)) {
      const newGenres = [...genres, currentGenre];
      setGenres(newGenres);
      setValue('genre', newGenres);
      setCurrentGenre('');
    }
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    const newGenres = genres.filter(genre => genre !== genreToRemove);
    setGenres(newGenres);
    setValue('genre', newGenres);
  };

  const onSubmit = async (data: BookFormData) => {
    try {
      const formData = {
        ...data,
        coverImage: coverPreview,
      };

      if (bookId) {
        await updateBook(bookId, formData);
      } else {
        await createBook(formData);
      }
      router.push('/books');
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {bookId ? 'Edit Book' : 'Add New Book'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={coverPreview}
                variant="rounded"
                sx={{ 
                  width: 200, 
                  height: 300, 
                  mb: 2,
                  backgroundColor: coverPreview ? 'transparent' : '#e8eaf6'
                }}
              >
                {!coverPreview && <AddPhotoAlternate sx={{ fontSize: 60 }} />}
              </Avatar>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="cover-upload"
                type="file"
                onChange={handleCoverChange}
              />
              <label htmlFor="cover-upload">
                <Button 
                  variant="outlined" 
                  component="span"
                  startIcon={<AddPhotoAlternate />}
                >
                  Upload Cover
                </Button>
              </label>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ISBN"
                  variant="outlined"
                  {...register('isbn')}
                  error={!!errors.isbn}
                  helperText={errors.isbn?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Publication Year"
                  variant="outlined"
                  type="number"
                  {...register('publicationYear', { valueAsNumber: true })}
                  error={!!errors.publicationYear}
                  helperText={errors.publicationYear?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                  {...register('title')}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Author"
                  variant="outlined"
                  {...register('author')}
                  error={!!errors.author}
                  helperText={errors.author?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Publisher"
                  variant="outlined"
                  {...register('publisher')}
                  error={!!errors.publisher}
                  helperText={errors.publisher?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    label="Add Genre"
                    variant="outlined"
                    size="small"
                    value={currentGenre}
                    onChange={(e) => setCurrentGenre(e.target.value)}
                    sx={{ mr: 1, flexGrow: 1 }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={handleAddGenre}
                    disabled={!currentGenre}
                  >
                    Add
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {genres.map((genre) => (
                    <Chip
                      key={genre}
                      label={genre}
                      onDelete={() => handleRemoveGenre(genre)}
                      color="primary"
                    />
                  ))}
                </Box>
                <input type="hidden" {...register('genre')} />
                {errors.genre && (
                  <Typography color="error" variant="caption">
                    {errors.genre.message}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Summary"
                  variant="outlined"
                  multiline
                  rows={4}
                  {...register('summary')}
                  error={!!errors.summary}
                  helperText={errors.summary?.message}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                color="secondary" 
                startIcon={<Cancel />}
                onClick={() => router.push('/books')}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                type="submit"
                startIcon={<Save />}
              >
                Save Book
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default BookForm;