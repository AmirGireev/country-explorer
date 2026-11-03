// imports
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCountry } from '@/lib/countries';
import FavoriteButton from '@/components/FavoriteButton';

// route params
type Props = { params: Promise<{ code: string }> };

// page title
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const country = await getCountry(code);
  return {
    title: country ? `${country.name.common} | Country Explorer` : 'Not found',
  };
}

// detail page
export default async function CountryPage({ params }: Props) {
  const { code } = await params;
  const country = await getCountry(code);
  // 404 if missing
  if (!country) notFound();

  const subregion = country.subregion ?? 'n/a';

  // render
  return (
    <main className='mx-auto max-w-2xl p-6'>
      <Link href='/' className='text-sm underline'>
        Back to all countries
      </Link>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={country.flags.png}
        alt={country.flags.alt ?? `Flag of ${country.name.common}`}
        className='my-6 w-64 rounded shadow'
      />
      <h1 className='text-3xl font-bold'>{country.name.common}</h1>
      <p className='mb-4 opacity-70'>{country.name.official}</p>
      <dl className='mb-6 grid grid-cols-[120px_1fr] gap-2'>
        <dt className='font-semibold'>Capital</dt>
        <dd>{country.capital?.join(', ') ?? 'n/a'}</dd>
        <dt className='font-semibold'>Region</dt>
        <dd>{country.region}</dd>
        <dt className='font-semibold'>Population</dt>
        <dd>{country.population.toLocaleString('en-US')}</dd>
        <dt className='font-semibold'>Subregion</dt>
        <dd>{subregion}</dd>
      </dl>
      <FavoriteButton code={country.cca2} />
    </main>
  );
}