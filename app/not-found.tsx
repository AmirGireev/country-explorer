// imports
import Link from 'next/link';

// 404 page
export default function NotFound() {
  return (
    <main className='p-6'>
      <h1 className='mb-2 text-2xl font-bold'>Country not found</h1>
      <Link href='/' className='underline'>
        Back to all countries
      </Link>
    </main>
  );
}