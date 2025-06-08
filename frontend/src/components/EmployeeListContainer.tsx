'use client';
import type { FilterOptions } from '@/types/employee';
import { isLeft } from 'fp-ts/Either';
import * as t from 'io-ts';
import { useEffect } from 'react';
import useSWR from 'swr';
import { type Employee, EmployeeT } from '../models/Employee';
import { EmployeeListItem } from './EmployeeListItem';

export type EmployeesContainerProps = {
  filterName: string;
  filterDetail: FilterOptions[];
};

const EmployeesT = t.array(EmployeeT);

const employeesFetcher = async (url: string): Promise<Employee[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch employees at ${url}`);
  }
  const body = await response.json();
  const decoded = EmployeesT.decode(body);
  if (isLeft(decoded)) {
    throw new Error(`Failed to decode employees ${JSON.stringify(body)}`);
  }
  return decoded.right;
};

export function EmployeeListContainer({
  filterName,
  filterDetail,
}: EmployeesContainerProps) {
  const searchParams = new URLSearchParams();
  searchParams.append('filterName', filterName);
  filterDetail.forEach(({ key, value }) => {
    if (value.length > 0) {
      searchParams.append(key, value.join(','));
    }
  });

  const queryString = searchParams.toString();

  const { data, error, isLoading } = useSWR<Employee[], Error>(
    `/api/employees?${queryString}`,
    employeesFetcher,
  );
  useEffect(() => {
    if (error != null) {
      console.error('Failed to fetch employees filtered by filterName', error);
    }
  }, [error]);
  if (data != null) {
    return data.map((employee) => (
      <EmployeeListItem employee={employee} key={employee.id} />
    ));
  }
  if (isLoading) {
    return <p>Loading employees...</p>;
  }
}
