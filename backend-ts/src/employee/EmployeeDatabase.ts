import type { Employee, FilterDetail } from "./Employee";

export interface EmployeeDatabase {
  addEmployee(employee: Employee): Promise<void>;
  getEmployee(id: string): Promise<Employee | undefined>;
  getEmployees(
    filterName: string,
    filterDetail: FilterDetail
  ): Promise<Employee[]>;
}
