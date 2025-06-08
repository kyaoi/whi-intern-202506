// NOTE: 新しく追加したときにはここにも追加する
export const employeeKeys = [
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

export type FilterOptions = {
	key: string;
	value: string[];
};
