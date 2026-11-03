'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className='p-6'>
      <h1 className='mb-2 text-2xl font-bold'>Something went wrong</h1>
      <p className='mb-4'>The country data could not be loaded.</p>
      <button onClick={reset} className='rounded border px-3 py-1'>
        Try again
      </button>
    </main>
  );
}