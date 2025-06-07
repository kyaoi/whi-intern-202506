import type { Employee } from "./Employee";
import type { EmployeeDatabase } from "./EmployeeDatabase";

export class EmployeeDatabaseInMemory implements EmployeeDatabase {
	private employees: Map<string, Employee>;

	constructor() {
		this.employees = new Map<string, Employee>();
		this.employees.set("1", {
			id: "1",
			name: "Jane Doe",
			age: 22,
			department: "Development",
			position: "エンジニア",
			skill: ["JavaScript", "TypeScript"],
		});
		this.employees.set("2", {
			id: "2",
			name: "John Smith",
			age: 28,
			department: "Sales",
			position: "マネージャー",
			skill: ["Leadership", "Communication"],
		});
		this.employees.set("3", {
			id: "3",
			name: "山田 太郎",
			age: 27,
			department: "マーケティング",
			position: "デザイナー",
			skill: ["Photoshop", "Illustrator"],
		});
	}

	async getEmployee(id: string): Promise<Employee | undefined> {
		return this.employees.get(id);
	}

	async getEmployees(filterText: string): Promise<Employee[]> {
		const employees = Array.from(this.employees.values());
		if (filterText === "") {
			return employees;
		}
		return employees.filter((employee) =>
			employee.name.toLowerCase().includes(filterText.toLowerCase()),
		);
	}
}
