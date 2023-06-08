export interface PaginationResponse {
  total: number;
  limit: number;
}
export interface APIResponsePaging<T> {
  data: {
    result: {
      currentPage: number;
      total: number;
      data: T[];
    };
  };
}
