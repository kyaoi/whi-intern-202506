import type { Employee, FilterDetail } from "./Employee";
import type { EmployeeDatabase } from "./EmployeeDatabase";

type AttributeItem = {
  key: string;
  label: string;
  value: string[];
};

const attributeLabels = [
  {
    key: "department",
    label: "所属",
  },
  {
    key: "position",
    label: "役職",
  },
  {
    key: "skill",
    label: "スキル",
  },
];

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
      skill: ["React", "TypeScript"],
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

  async getEmployees(
    filterName: string,
    filterDetail: FilterDetail
  ): Promise<Employee[]> {
    const employees = Array.from(this.employees.values());

    // 条件が完全に空の場合は全件返す
    const noFilterText = filterName === "";
    const noFilterDetail = Object.values(filterDetail).every(
      (v) => v.length === 0
    );
    if (noFilterText && noFilterDetail) {
      return employees;
    }

    // 名前検索
    const filterNameEmployees = employees.filter(
      (employee) =>
        noFilterText ||
        employee.name.toLowerCase().includes(filterName.toLowerCase())
    );

    if (noFilterDetail) {
      return filterNameEmployees;
    }

    // 詳細検索
    return filterNameEmployees.filter((employee) => {
      const matchesDetail = Object.entries(filterDetail).some(
        ([key, filterValues]) => {
          if (filterValues.length === 0) return false;

          const value = employee[key as keyof FilterDetail];

          if (Array.isArray(value)) {
            return value.some((v) => filterValues.includes(v));
          }
          return filterValues.includes(value);
        }
      );

      return matchesDetail;
    });
  }

  async getAttributes(): Promise<AttributeItem[]> {
    const employees = Array.from(this.employees.values());

    const attributes: AttributeItem[] = [];

    for (const { key, label } of attributeLabels) {
      const rawValues = employees
        .flatMap((employee) => employee[key as keyof Employee])
        .filter((value): value is string => typeof value === "string");

      const uniqueValues = Array.from(new Set(rawValues));

      attributes.push({
        key,
        label,
        value: uniqueValues,
      });
    }

    return attributes;
  }

  async addEmployee(employee: Employee): Promise<void> {
    if (this.employees.has(employee.id)) {
      throw new Error(`Employee with id ${employee.id} already exists.`);
    }
    this.employees.set(employee.id, employee);
  }
}
