'use client';

// imports
import { useFavorites } from '@/lib/useFavorites';

// favorite button
export default function FavoriteButton({ code }: { code: string }) {
  // state
  const { favorites, toggle } = useFavorites();
  const active = favorites.includes(code);

  // render
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