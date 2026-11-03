export interface Country {
  cca2: string; // 2-Buchstaben-Code, z. B. DE
  name: { common: string; official: string };
  region: string;
  subregion?: string;
  population: number;
  capital?: string[];
  flags: { png: string; alt?: string };
}

// So sieht ein Land in der neuen API aus (nur die Felder, die wir brauchen)
interface ApiCountry {
  names: { common: string; official?: string };
  codes: { alpha_2: string };
  region?: string;
  subregion?: string;
  population?: number;
  capitals?: { name: string }[];
}

interface ApiResponse {
  data: {
    objects: ApiCountry[];
    meta: { total: number; more: boolean };
  };
}

const BASE = 'https://api.restcountries.com/countries/v5';

function request(path: string) {
  return fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${process.env.RESTCOUNTRIES_API_KEY}` },
    next: { revalidate: 86400 }, // Antwort 24 h zwischenspeichern
  });
}

// Flaggen kommen vom kostenlosen Flag-CDN der API, ohne Key
const flagUrl = (code: string) =>
  `https://flags.restcountries.com/v5/w320/${code.toLowerCase()}.png`;

// Wandelt die API-Antwort in unsere eigene, einfache Form um
function toCountry(c: ApiCountry): Country {
  return {
    cca2: c.codes.alpha_2,
    name: { common: c.names.common, official: c.names.official ?? c.names.common },
    region: c.region ?? '',
    subregion: c.subregion,
    population: c.population ?? 0,
    capital: c.capitals?.map((cap) => cap.name),
    flags: { png: flagUrl(c.codes.alpha_2) },
  };
}

export async function getAllCountries(): Promise<Country[]> {
  const all: Country[] = [];
  let offset = 0;
  let more = true;

  // Max. 100 Länder pro Anfrage, deshalb seitenweise laden
  while (more) {
    const res = await request(
      `?limit=100&offset=${offset}&response_fields=names.common,codes.alpha_2,region,population`
    );
    if (!res.ok) throw new Error(`Failed to load countries (${res.status})`);
    const { data }: ApiResponse = await res.json();
    all.push(...data.objects.filter((c) => c.codes?.alpha_2).map(toCountry));
    more = data.meta.more;
    offset += 100;
  }

  return all.sort((a, b) => a.name.common.localeCompare(b.name.common));
}

export async function getCountry(code: string): Promise<Country | null> {
  const res = await request(`/codes.alpha_2/${encodeURIComponent(code)}`);
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Failed to load country (${res.status})`);
  const { data }: ApiResponse = await res.json();
  return data.objects[0] ? toCountry(data.objects[0]) : null;
}