// imports
import { getAllCountries } from '@/lib/countries';
import CountryBrowser from '@/components/CountryBrowser';

// home page
export default async function Home() {
  // load countries
  const countries = await getAllCountries();

  // render
  return (
    <main className='mx-auto max-w-6xl p-6'>
      <h1 className='mb-6 text-3xl font-bold'>Country Explorer</h1>
      <CountryBrowser countries={countries} />
    </main>
  );
}