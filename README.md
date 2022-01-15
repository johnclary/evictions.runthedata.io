[evictions.runthedata.io](https://evictions.runthedata.io) is a website that tracks eviction filings in Travis County, TX.

You can suggest an improvment or report a problem by [opening an issue](https://github.com/johnclary/evictions.runthedata.io/issues/new).

Code contributions are welcome! Read on to get the app running locally.

## Get it running

This is a [Next.js](https://nextjs.org/) app powered by a [Hasura](https://github.com/hasura/graphql-engine) graphql endpoint.

The easiest way to get started is to connect a local copy of the app to our public eviction case API. See [here](https://github.com/johnclary/travis-county-courts-db) if you want to run the Postgres + Hasura API locally.


1. Clone this repo and create a file called `.env.local` in root directory. This environment file needs a single environmental variable which points to the evictions API:

```bash
# .env.local
NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT=http://api.runthedata.io/v1/graphql

```

2. [Install Node.js and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), then run:

```bash
$ npm install    
```

3. Start the development server by running:

```bash
$ npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

