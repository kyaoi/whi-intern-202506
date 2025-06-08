import * as t from "io-ts";

export const EmployeeT = t.type({
  id: t.string,
  name: t.string, // 名前
  age: t.number, // 年齢
  department: t.string, // 所属
  position: t.string, // 役職
  skill: t.array(t.string), // スキル
});

export type Employee = t.TypeOf<typeof EmployeeT>;
export const employeeKeys = Object.keys(EmployeeT.props) as Array<
  keyof Employee
>;

export type FilterDetail = {
  department: string[];
  position: string[];
  skill: string[];
};

export const convertToArray = (param: string): string[] => {
  return param
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
};
