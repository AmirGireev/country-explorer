'use client';

import { useFavorites } from '@/lib/useFavorites';

export default function FavoriteButton({ code }: { code: string }) {
  const { favorites, toggle } = useFavorites();
  const active = favorites.includes(code);

  return (
    <button
      onClick={() => toggle(code)}
      aria-pressed={active}
      className='rounded border px-3 py-1 text-sm hover:opacity-80'
    >
      {active ? '★ Favorite' : '☆ Add to favorites'}
    </button>
  );
}