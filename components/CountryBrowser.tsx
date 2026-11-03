'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Country } from '@/lib/countries';
import { useFavorites } from '../lib/useFavorites';

export default function CountryBrowser({ countries }: { countries: Country[] }) {
  const [query, setQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const { favorites, toggle } = useFavorites();

  const visible = countries.filter(
    (c) =>
      c.name.common.toLowerCase().includes(query.toLowerCase()) &&
      (!onlyFavorites || favorites.includes(c.cca2))
  );

  return (
    <>
      <div className='mb-6 flex flex-wrap items-center gap-4'>
        <input
          type='search'
          placeholder='Search countries...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='w-full max-w-sm rounded border px-3 py-2'
        />
        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={onlyFavorites}
            onChange={(e) => setOnlyFavorites(e.target.checked)}
          />
          Only favorites
        </label>
      </div>

      {visible.length === 0 && <p>No countries found.</p>}

      <ul className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {visible.map((c) => (
          <li key={c.cca2} className='rounded-lg border p-3'>
            <Link href={`/country/${c.cca2}`} className='hover:opacity-80'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.flags.png}
                alt={c.flags.alt ?? `Flag of ${c.name.common}`}
                className='mb-2 h-28 w-full rounded object-cover'
              />
              <strong>{c.name.common}</strong>
              <p className='text-sm opacity-70'>{c.region}</p>
            </Link>
            <button
              onClick={() => toggle(c.cca2)}
              aria-label={`Toggle favorite: ${c.name.common}`}
              className='mt-2 text-xl'
            >
              {favorites.includes(c.cca2) ? '★' : '☆'}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}