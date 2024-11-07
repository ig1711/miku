'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Miku() {
  const [value, setValue] = useState('');
  const [searhResult, setSearchResult] = useState([]);

  async function handleSubmit() {
    const res = await fetch(`https://api3.janime.workers.dev/search/${value}`);
    const data = await res.json();
    data?.results?.length && setSearchResult(data.results);
  }

  return <>
  <input type="text" value={value} onInput={e => setValue(e.target.value)} />
  <button onClick={handleSubmit}>Search</button>
  {searhResult.map(d => <Link className="block" key={d.id} href={`/anime/${d.id}`}>{d.title}</Link>)}
  </>;
}
