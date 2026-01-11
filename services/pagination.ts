import type { ParsedUrlQuery } from 'querystring';

const parsePageValue = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
};

export const getPageFromQuery = (query: ParsedUrlQuery) => {
  return parsePageValue(query.sayfa ?? query.page);
};

export const paginate = <T>(items: T[], page: number, pageSize: number) => {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (currentPage - 1) * pageSize;

  return {
    items: items.slice(startIndex, startIndex + pageSize),
    page: currentPage,
    totalPages,
  };
};
