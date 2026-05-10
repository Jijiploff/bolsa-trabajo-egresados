export interface PaginationOptions {
  page: number;
  limit: number;
}

export const getPaginationOptions = (query: any): PaginationOptions => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  return { page, limit };
};

export const getPaginationMeta = (total: number, page: number, limit: number) => {
  const lastPage = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    lastPage,
    hasNextPage: page < lastPage,
    hasPreviousPage: page > 1,
  };
};