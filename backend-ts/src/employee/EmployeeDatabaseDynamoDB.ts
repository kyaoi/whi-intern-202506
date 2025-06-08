import {
  type DynamoDBClient,
  GetItemCommand,
  type GetItemCommandInput,
  ScanCommand,
  type ScanCommandInput,
} from '@aws-sdk/client-dynamodb';
import { isLeft } from 'fp-ts/Either';

import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { type Employee, EmployeeT, type FilterDetail } from './Employee';
import type { EmployeeDatabase } from './EmployeeDatabase';

export class EmployeeDatabaseDynamoDB implements EmployeeDatabase {
  private client: DynamoDBClient;
  private tableName: string;

  constructor(client: DynamoDBClient, tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    const input: GetItemCommandInput = {
      TableName: this.tableName,
      Key: {
        id: { S: id },
      },
    };
    const output = await this.client.send(new GetItemCommand(input));
    const item = output.Item;
    if (item == null) {
      return;
    }
    const employee = {
      id: id,
      name: item['name'].S,
      age: mapNullable(item['age'].N, (value) => Number.parseInt(value, 10)),
    };
    const decoded = EmployeeT.decode(employee);
    if (isLeft(decoded)) {
      throw new Error(
        `Employee ${id} is missing some fields. ${JSON.stringify(employee)}`,
      );
    } else {
      return decoded.right;
    }
  }

  async addEmployee(employee: Employee): Promise<void> {
    await this.client.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: {
          id: { S: employee.id },
          name: { S: employee.name },
          age: { N: employee.age.toString() },
        },
      }),
    );
  }
  // TODO: 詳細検索こっちはやってない
  async getEmployees(
    filterName: string,
    filterDetail: FilterDetail,
  ): Promise<Employee[]> {
    const input: ScanCommandInput = {
      TableName: this.tableName,
    };
    const output = await this.client.send(new ScanCommand(input));
    const items = output.Items;
    if (items == null) {
      return [];
    }
    return items
      .filter((item) => {
        const name = item['name']?.S?.toLowerCase();
        return filterName === '' || name?.includes(filterName.toLowerCase());
      })
      .map((item) => {
        return {
          id: item['id'].S,
          name: item['name'].S,
          age: mapNullable(item['age'].N, (value) =>
            Number.parseInt(value, 10),
          ),
        };
      })
      .flatMap((employee) => {
        const decoded = EmployeeT.decode(employee);
        if (isLeft(decoded)) {
          console.error(
            `Employee ${
              employee.id
            } is missing some fields and skipped. ${JSON.stringify(employee)}`,
          );
          return [];
        } else {
          return [decoded.right];
        }
      });
  }
}

function mapNullable<T, U>(
  value: T | null | undefined,
  mapper: (value: T) => U,
): U | undefined {
  if (value != null) {
    return mapper(value);
  }
}
