import type { AppProps } from 'next/app';
import '../styles/globals.css'; // Adjust path if needed
import ToasterProvider from '@/components/common/ToasterProvider';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToasterProvider />
      <Component {...pageProps} />
    </>
  );
}
