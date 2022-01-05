import { request } from "graphql-request";
import useSWR from "swr";

const URL = "http://localhost:8080/v1/graphql";

const fetcher = async (query, variables) => {
  return await request(URL, query, variables)
};

export const useGraphql = ({ query, variables }) => {
  const { data, error } = useSWR([query, variables], fetcher);
  return { data, error, loading: !data && !error };
};
