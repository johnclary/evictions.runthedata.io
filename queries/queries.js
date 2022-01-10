import { gql } from "graphql-request";

export const CASES_BY_EVIC_DATE_QUERY = gql`
  query CasesByEvicDate($start: timestamp!, $end: timestamp!) {
    evic_by_date(
      where: {
        filed_date: { _gte: $start }
        _and: { filed_date: { _lte: $end } }
      }
    ) {
      count
      filed_date
      precinct
    }
  }
`;

export const EVIC_BY_ZIP_DAY_QUERY = gql`
  query EvicByZipDay($start: timestamp!, $end: timestamp!) {
    evic_by_zip_day(
      where: {
        filed_date: { _gte: $start }
        _and: { filed_date: { _lte: $end } }
      }
    ) {
      count
      defendant_zip
      filed_date
    }
  }
`;

export const EVIC_BY_PLAINTIFF_QUERY = gql`
  query EvicByPlaintiff($start: timestamp!, $end: timestamp!) {
    evict_by_plaintiff(
      where: {
        filed_date: { _gte: $start }
        _and: { filed_date: { _lte: $end } }
      }
    ) {
      count
      filed_date
      party_one
    }
  }
`;

export const PLAINTIFF_DETAIL_QUERY = gql`
  query PlaintiffDetail($name: String!) {
    cases(
      where: { party_one: { _ilike: $name } }
      order_by: { filed_date: desc }
    ) {
      _id
      created_at
      filed_date
      party_one
      precinct
      status
      type
      updated_at
      defendant_zip
      plaintiff_zip
      plaintiff_city
      plaintiff_state
    }
  }
`;
