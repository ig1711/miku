'use client';

import useSWR from 'swr';
import { use, useState, useRef, useEffect } from 'react';
import Hls from 'hls.js';
// import { DiscordSnowflake } from '@sapphire/snowflake';

async function fetcher(id) {
    const res = await fetch(`https://api3.janime.workers.dev/episode/${id}`);
    const data = await res.json();
    const a = ([...(data.results.stream.sources.map(s => ({ url: s.file, type: 'direct' }))), ...(data.results.stream.sources_bk.map(s => ({ url: s.file, type: 'direct' }))), ...(Object.values(data.results.servers).map(s => ({ url: s, type: 'iframe' })))]);
    return a;
}

export default function Episode({ params }) {
    const { 'ep-slug': epSlug } = use(params);

    const { data, isLoading, error } = useSWR(epSlug, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
    });

    const [server, setServer] = useState(0);

    if (error) {
        console.log(error);
        return <div>error</div>;
    }
    if (isLoading) return <div>loading...</div>;

    return <>
        <select onChange={(e) => setServer(e.target.value)}>
            {data.map((d, i) => <option key={i} value={i}>Server {i + 1}{d.type === 'iframe' ? ' (may contain ads)' : ''}</option>)}
        </select>
        {data[server].type === 'direct' ? <DirectPlay url={data[server].url} /> : <IframePlay url={data[server].url} />}
    </>;
}

function DirectPlay({ url }) {
    const videoRef = useRef();

    useEffect(() => {
        if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = url;
          } else if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(videoRef.current);
          }
    }, [url])

    return (
        <video
            ref={videoRef}
            controls
            width="1120"
            height="630"
        />
    )
}

function IframePlay({ url }) {
    return <iframe width="1120" height="630" sandbox="allow-scripts allow-same-origin" allowFullScreen src={url} />;
}
