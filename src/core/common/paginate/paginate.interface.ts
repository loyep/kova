export interface IPaginationOptions {
  /**
   * the amount of items to be requested per page
   */
  pageSize: number
  /**
   * the page that is requested
   */
  page: number
  /**
   * a babasesic route for generating links (i.e., WITHOUT query params)
   */
  route?: string
}

export interface IPaginationMeta {
  /**
   * the amount of items on this specific page
   */
  itemCount: number
  /**
   * the total amount of items
   */
  total: number
  /**
   * the amount of items that were requested per page
   */
  pageSize: number
  /**
   * the total amount of pages in this paginator
   */
  totalPages: number
  /**
   * the current page this paginator "points" to
   */
  currentPage: number
}

export interface IPaginationLinks {
  /**
   * a link to the "first" page
   */
  first?: string
  /**
   * a link to the "previous" page
   */
  previous?: string
  /**
   * a link to the "next" page
   */
  next?: string
  /**
   * a link to the "last" page
   */
  last?: string
}
