import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type {
	LambdaFunctionURLEvent,
	LambdaFunctionURLResult,
} from "aws-lambda";
import {
	type Employee,
	type FilterDetail,
	convertToArray,
} from "./employee/Employee";
import type { EmployeeDatabase } from "./employee/EmployeeDatabase";
import { EmployeeDatabaseDynamoDB } from "./employee/EmployeeDatabaseDynamoDB";

const getEmployeeHandler = async (
	database: EmployeeDatabase,
	id: string,
): Promise<LambdaFunctionURLResult> => {
	const employee: Employee | undefined = await database.getEmployee(id);
	if (employee == null) {
		console.log("A user is not found.");
		return { statusCode: 404 };
	}
	return {
		statusCode: 200,
		body: JSON.stringify(employee),
	};
};

const getEmployeesHandler = async (
	database: EmployeeDatabase,
	filterName: string,
	filterDetail: FilterDetail,
): Promise<LambdaFunctionURLResult> => {
	const employees: Employee[] = await database.getEmployees(
		filterName,
		filterDetail,
	);
	return {
		statusCode: 200,
		body: JSON.stringify(employees),
	};
};

export const handle = async (
	event: LambdaFunctionURLEvent,
): Promise<LambdaFunctionURLResult> => {
	console.log("event", event);
	try {
		const tableName = process.env.EMPLOYEE_TABLE_NAME;
		if (tableName == null) {
			throw new Error(
				"The environment variable EMPLOYEE_TABLE_NAME is not specified.",
			);
		}
		const client = new DynamoDBClient();
		const database = new EmployeeDatabaseDynamoDB(client, tableName);
		// https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/urls-invocation.html
		const path = normalizePath(event.requestContext.http.path);
		const query = event.queryStringParameters;
		const filterName = query?.filterName ?? "";
		const filterDepartment = query?.department ?? "";
		const filterPosition = query?.position ?? "";
		const filterSkill = query?.skill ?? "";
		const filterDetail: FilterDetail = {
			department: convertToArray(filterDepartment),
			position: convertToArray(filterPosition),
			skill: convertToArray(filterSkill),
		};

		if (path === "/api/employees") {
			return getEmployeesHandler(database, filterName, filterDetail);
		} else if (path.startsWith("/api/employees/")) {
			const id = path.substring("/api/employees/".length);
			return getEmployeeHandler(database, id);
		} else {
			console.log("Invalid path", path);
			return { statusCode: 400 };
		}
	} catch (e) {
		console.error("Internal Server Error", e);
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: "Internal Server Error",
			}),
		};
	}
};

function normalizePath(path: string): string {
	return path.endsWith("/") ? path.slice(0, -1) : path;
}
