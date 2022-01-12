import Head from "next/head";

export default function SiteHead() {
  return (
    <Head>
      <title key="title">Travis County Evictions Tracker @ runthedata.io</title>
        <meta name="description" content="Tracking evictions in Austin, TX from public court records"/>
        {/* <!-- Google / Search Engine Tags --> */}
        <meta itemprop="name" content="Travis County Evictions Tracker @ runthedata.io"/>
        <meta itemprop="description" content="Tracking evictions in Austin, TX from public court records"/>
        <meta itemprop="image" content="http://evictions.runthedata.io/preview.png"/>
        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://evictions.runthedata.io"/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content="Travis County Evictions Tracker @ runthedata.io"/>
        <meta property="og:description" content="Tracking evictions in Austin, TX from public court records"/>
        <meta property="og:image" content="http://evictions.runthedata.io/preview.png"/>
        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="Travis County Evictions Tracker @ runthedata.io"/>
        <meta name="twitter:description" content="Tracking evictions in Austin, TX from public court records"/>
        <meta name="twitter:image" content="http://evictions.runthedata.io/preview.png"/
        >
        {/* <!-- Meta Tags Generated via http://heymeta.com --> */}
    </Head>
  );
}
