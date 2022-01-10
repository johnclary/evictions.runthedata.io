import { request } from "graphql-request";
import useSWR from "swr";

const HASURA_GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT;

const fetcher = async (query, variables) => {
  return await request(HASURA_GRAPHQL_ENDPOINT, query, variables);
};

export const useGraphql = ({ query, variables }) => {
  const { data, error } = useSWR([query, variables], fetcher);
  return { data, error, loading: !data && !error };
};
