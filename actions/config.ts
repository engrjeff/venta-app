export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_PAGE = 1

export function getSkip({ limit, page }: { limit?: number; page?: number }) {
  const _limit = limit ?? DEFAULT_PAGE_SIZE
  const _page = page ?? DEFAULT_PAGE

  return _limit * (_page - 1)
}
