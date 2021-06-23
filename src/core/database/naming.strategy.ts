import { NamingStrategyInterface } from "typeorm/naming-strategy/NamingStrategyInterface";
import { DefaultNamingStrategy } from "typeorm/naming-strategy/DefaultNamingStrategy";
import { Table } from "typeorm/schema-builder/table/Table";

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {

    primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
        const columnName = CustomNamingStrategy.getColumnName(columnNames);
        const tableName = CustomNamingStrategy.getTableName(tableOrName);
        return `${tableName}_${columnName}_primary`
    }

    foreignKeyName(tableOrName: Table | string, columnNames: string[], _referencedTablePath?: string, _referencedColumnNames?: string[]): string {
        const columnName = CustomNamingStrategy.getColumnName(columnNames);
        const tableName = CustomNamingStrategy.getTableName(tableOrName);
        return `${tableName}_${columnName}_foreign`;
    }

    uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
        const columnName = CustomNamingStrategy.getColumnName(columnNames);
        const tableName = CustomNamingStrategy.getTableName(tableOrName);
        return `${tableName}_${columnName}_unique`;
    }

    defaultConstraintName(tableOrName: Table | string, columnName: string): string {
        const tableName = CustomNamingStrategy.getTableName(tableOrName);
        return `${tableName}_${columnName}_default`;
    }

    checkConstraintName(tableOrName: Table | string, expression: string, isEnum?: boolean): string {
        const tableName = CustomNamingStrategy.getTableName(tableOrName);
        const name = `${tableName}_${expression}_check`;
        return isEnum ? `${name}_ENUM` : name;
    }

    exclusionConstraintName(tableOrName: Table | string, expression: string): string {
        const tableName = CustomNamingStrategy.getTableName(tableOrName);
        return `${tableName}_${expression}_exclusion`;
    }

    indexName(tableOrName: Table | string, columnNames: string[], where?: string): string {
        const columnName = CustomNamingStrategy.getColumnName(columnNames);
        const tableName = CustomNamingStrategy.getTableName(tableOrName);
        let key = `${tableName}_${columnName}`;
        if (where) key += `_${where}`;

        return `${key}_index`;
    }

    columnNameCustomized(customName: string): string {
        return customName;
    }

    relationName(propertyName: string): string {
        return propertyName;
    }

    static getTableName(tableOrName: Table | string) {
        return (tableOrName instanceof Table ? tableOrName.name : tableOrName).replace(".", "_");
    }

    static getColumnName(columnNames: string[]) {
        return [...columnNames].sort().join("_");
    }
}
