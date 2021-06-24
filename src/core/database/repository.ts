import { ObjectLiteral, Repository } from "typeorm"

export function getColumnNames<T extends ObjectLiteral>(repo: Repository<T>) {
  const columnNames = repo.metadata.columns.map((column) => column.propertyName) as [keyof T]
  return columnNames
}

export function getAllColumnNames<T extends ObjectLiteral>(repo: Repository<T>) {
  const columnNames = repo.metadata.columns.map((column) => column.propertyName) as [keyof T]
  return columnNames
}

export function selectColumns<T extends ObjectLiteral>(
  repo: Repository<T>,
  select: { [P in keyof T]?: boolean },
) {
  const selectColumns: { [P in keyof T]?: boolean } = Object.assign(
    {},
    getSelectColumns(repo),
    select,
  )
  const selectFields: (keyof T)[] = []
  for (const column in selectColumns) {
    if (selectColumns.hasOwnProperty(column) && selectColumns[column]) {
      selectFields.push(column)
    }
  }
  return selectFields
}

export function getSelectColumns<T extends ObjectLiteral>(repo: Repository<T>) {
  const selectColumns: { [P in keyof T]?: boolean } = repo.metadata.columns.reduce(
    (select, column) => {
      select[column.propertyName] = column.isSelect
      return select
    },
    {},
  )
  return selectColumns
}
