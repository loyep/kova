import { FindConditions, FindManyOptions, Repository, SelectQueryBuilder } from "typeorm"
import { IPaginationOptions, IPaginationLinks, IPaginationMeta } from "./paginate.interface"

export class Pagination<PaginationObject> {
  constructor(
    /**
     * a list of items to be returned
     */
    public readonly items: PaginationObject[],
    /**
     * associated meta information (e.g., counts)
     */
    public readonly meta: IPaginationMeta,
    /**
     * associated links
     */
    public readonly links?: IPaginationLinks,
  ) { }
}

export type IPaginatorOptions = IPaginationOptions | number

export async function paginate<T>(
  repository: Repository<T>,
  options: IPaginatorOptions,
  searchOptions?: FindConditions<T> | FindManyOptions<T>,
): Promise<Pagination<T>>
export async function paginate<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginatorOptions,
): Promise<Pagination<T>>

export async function paginate<T>(
  repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
  options: IPaginatorOptions,
  searchOptions?: FindConditions<T> | FindManyOptions<T>,
) {
  const paginator: IPaginationOptions =
    typeof options !== "number" ? options : { page: options, pageSize: 20 }
  return repositoryOrQueryBuilder instanceof Repository
    ? paginateRepository<T>(repositoryOrQueryBuilder, paginator, searchOptions)
    : paginateQueryBuilder(repositoryOrQueryBuilder, paginator)
}

async function paginateRepository<T>(
  repository: Repository<T>,
  options: IPaginationOptions,
  searchOptions?: FindConditions<T> | FindManyOptions<T>,
): Promise<Pagination<T>> {
  const [page, limit, route] = resolveOptions(options)

  if (page < 1) {
    return createPaginationObject([], 0, page, limit, route)
  }

  const [items, total] = await repository.findAndCount({
    skip: limit * (page - 1),
    take: limit,
    ...searchOptions,
  })

  return createPaginationObject<T>(items, total, page, limit, route)
}

async function paginateQueryBuilder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
): Promise<Pagination<T>> {
  const [page, limit, route] = resolveOptions(options)

  const st = new Date();
  const [items, total] = await Promise.all([
    queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getMany(),
    queryBuilder
      .getCount()
  ])
  console.log('time:', new Date().getTime() - st.getTime())
  // const [items, total] = await queryBuilder
  //   .take(limit)
  //   .skip((page - 1) * limit)
  //   .distinct(false)
  //   .getManyAndCount()

  return createPaginationObject<T>(items, total, page, limit, route)
}

export function resolveOptions(options: IPaginationOptions): [number, number, string] {
  const page = options.page
  const pageSize = options.pageSize
  const route = options.route

  return [page, pageSize, route]
}

export function createPaginationObject<T>(
  items: T[],
  total: number,
  currentPage: number,
  pageSize: number,
  route?: string,
): Pagination<T> {
  const totalPages = Math.ceil(total / pageSize)

  const hasFirstPage = route
  const hasPreviousPage = route && currentPage > 1
  const hasNextPage = route && currentPage < totalPages
  const hasLastPage = route

  const symbol = route && new RegExp(/\?/).test(route) ? "&" : "?"

  const routes: IPaginationLinks = {
    first: hasFirstPage ? `${route}${symbol}pageSize=${pageSize}` : "",
    previous: hasPreviousPage
      ? `${route}${symbol}page=${currentPage - 1}&pageSize=${pageSize}`
      : "",
    next: hasNextPage ? `${route}${symbol}page=${currentPage + 1}&pageSize=${pageSize}` : "",
    last: hasLastPage ? `${route}${symbol}page=${totalPages}&pageSize=${pageSize}` : "",
  }

  const meta: IPaginationMeta = {
    total,
    itemCount: items.length,
    pageSize,
    totalPages: totalPages,
    currentPage: currentPage,
  }

  return new Pagination(items, meta, route && routes)
}
