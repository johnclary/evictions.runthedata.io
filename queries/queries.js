import { gql } from "graphql-request";

export const CASES_BY_EVIC_DATE_QUERY = gql`
  query CasesByEvicDate {
    evic_by_date(where: { filed_date: { _gt: "2020-04-01" } }) {
      count
      filed_date
      precinct
    }
  }
`;

// export const RECENT_FILINGS_QUERY = gql`
//   query RecentFilings {
//     cases(
//       where: { type: { _eq: "Eviction" }, filed_date: { _gt: "2019-05-01" } }
//       order_by: { filed_date: desc }
//     ) {
//       case_number
//       filed_date
//       party_one
//     }
//   }
// `;

// export const QUERY_PLAINTIFF_COUNT = gql`
//   query PlaintiffByDate($filed_date: timestamp!, $party_name: String!) {
//     cases_aggregate(
//       where: {
//         party_one: { _ilike: $party_name }
//         _and: { filed_date: { _gte: $filed_date } }
//       }
//     ) {
//       aggregate {
//         count(columns: case_id)
//       }
//     }
//   }
// `;

export const EVIC_BY_ZIP_DAY_QUERY = gql`
  query EvicByZipDay {
    evic_by_zip_day {
      count
      defendant_zip
      filed_date
    }
  }
`;

export const EVIC_BY_PLAINTIFF_QUERY = gql`
  query EvicByPlaintiff($filed_date: timestamp!) {
    evict_by_plaintiff(where: { filed_date: { _gte: $filed_date } }) {
      count
      filed_date
      party_one
    }
  }
`;
