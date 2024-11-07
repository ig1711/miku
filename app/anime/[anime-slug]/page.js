'use client';

import useSWR from 'swr';
import { use } from 'react';
import Link from 'next/link';

async function fetcher(id) {
    const res = await fetch(`https://api3.janime.workers.dev/anime/${id}`);
    const data = await res.json();
    return data.results;
}

export default function Anime({ params }) {
    const { 'anime-slug': animeSlug } = use(params);
    const { data, isLoading, error } = useSWR(animeSlug, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
    });

    if (error) {
        console.log(error);
        return <div>error</div>;
    }
    if (isLoading) return <div>loading...</div>;

    return <>
    <h1>Name: {data.name}</h1>
    <h3>Episodes:</h3>
    {data.episodes.map(([eNo, id]) => <Link key={id} className="block" href={`/${id}`}>Episode {eNo}</Link>)}
    </>;
}
