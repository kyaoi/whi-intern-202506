import type { Employee, FilterDetail } from './Employee';

export interface EmployeeDatabase {
  getEmployee(id: string): Promise<Employee | undefined>;
  getEmployees(
    filterName: string,
    filterDetail: FilterDetail,
  ): Promise<Employee[]>;
}
