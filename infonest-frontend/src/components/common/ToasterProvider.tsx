'use client';
import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
  return <Toaster position="top-right" toastOptions={{ duration: 3500 }} />;
}
import toast from 'react-hot-toast';

// on success
toast.success('Book checked out');

// on error
toast.error('Something went wrong');
