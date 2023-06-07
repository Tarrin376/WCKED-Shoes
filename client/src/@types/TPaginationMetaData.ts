
export type TPaginationMetaData = {
  page: number,
  pages: number,
  total_count: number,
  prev_page: number | null,
  next_page: number | null,
  has_next: boolean,
  has_prev: boolean,
}