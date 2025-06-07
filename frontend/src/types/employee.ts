// NOTE: 新しく追加したときにはここにも追加する
export const employeeKeys = {
  department: "所属",
  position: "役職",
  skill: "スキル",
}

export type FilterOptions = {
  [K in keyof typeof employeeKeys]?: string[];
};


