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
