"use client";
import { type FilterOptions, employeeKeys } from "@/types/employee";
import {
	Box,
	Button,
	Checkbox,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	FormGroup,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { EmployeeListContainer } from "./EmployeeListContainer";

export function SearchEmployees() {
	const [searchKeyword, setSearchKeyword] = useState("");
	const [searchDetail, setSearchDetail] = useState<FilterOptions[]>([]);

	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleAccept = (data: FilterOptions[]) => {
		setOpen(false);
		setSearchDetail(data);
	};
	const handleCancel = () => {
		setOpen(false);
	};

	return (
		<Paper
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 2,
				flex: 1,
				p: 2,
			}}
		>
			<Container
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<TextField
					placeholder="検索したい名前を入力してください"
					value={searchKeyword}
					onChange={(e) => setSearchKeyword(e.target.value)}
					fullWidth
					margin="normal"
				/>
				<Button variant="text" onClick={handleClickOpen}>
					詳細検索
				</Button>
			</Container>
			<SearchModal
				handleAccept={handleAccept}
				handleCancel={handleCancel}
				open={open}
			/>
			<EmployeeListContainer
				key="employeesContainer"
				filterName={searchKeyword}
				filterDetail={searchDetail}
			/>
		</Paper>
	);
}

type SearchModalProps = {
	handleAccept: (data: FilterOptions[]) => void;
	handleCancel: () => void;
	open: boolean;
};

const SearchModal = ({
	open,
	handleAccept,
	handleCancel,
}: SearchModalProps) => {
	const [selectedFilters, setSelectedFilters] = useState<FilterOptions[]>([]);

	return (
		<Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
			<DialogTitle>詳細検索</DialogTitle>
			<SearchModalContent
				selectedFilters={selectedFilters}
				setSelectedFilters={setSelectedFilters}
			/>
			<DialogActions>
				<Button onClick={handleCancel} variant="outlined">
					キャンセル
				</Button>
				<Button
					onClick={() => handleAccept(selectedFilters)}
					variant="contained"
				>
					検索
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const attributesFetcher = async (url: string): Promise<FilterOptions[]> => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch employees at ${url}`);
	}
	const body = await response.json();
	return body;
};

type SearchModalContentProps = {
	selectedFilters: FilterOptions[];
	setSelectedFilters: React.Dispatch<React.SetStateAction<FilterOptions[]>>;
};

const mockData = [
	{ key: "department", value: ["Development", "Sales", "マーケティング"] },
	{ key: "position", value: ["マネージャー", "デザイナー"] },
	{ key: "skill", value: ["React", "Vue", "Go", "Photoshop", "Leadership"] },
];

const SearchModalContent = ({
	selectedFilters,
	setSelectedFilters,
}: SearchModalContentProps) => {
	// FIXME: replace mock data
	const [filterOptions, setFilterOptions] = useState<FilterOptions[]>(mockData);

	const { data, error, isLoading } = useSWR<FilterOptions[], Error>(
		"/api/attributes",
		attributesFetcher,
	);
	useEffect(() => {
		if (error != null) {
			console.error("Failed to fetch employees filtered by filterName", error);
		}
	}, [error]);
	if (data != null) {
		setFilterOptions(data);
	}

	if (isLoading) {
		return <p>Loading...</p>;
	}

	const handleCheck = (key: string, value: string) => {
		setSelectedFilters((prev) => {
			const existing = prev.find((f) => f.key === key);
			if (existing) {
				const alreadySelected = existing.value.includes(value);
				const newValues = alreadySelected
					? existing.value.filter((v) => v !== value)
					: [...existing.value, value];

				if (newValues.length === 0) {
					return prev.filter((f) => f.key !== key);
				}

				return prev.map((f) =>
					f.key === key ? { ...f, value: newValues } : f,
				);
			}
			return [...prev, { key, value: [value] }];
		});
	};

	return (
		<DialogContent>
			{employeeKeys.map(({ key, label }) => (
				<Box key={key} mb={2}>
					<Typography variant="subtitle1" gutterBottom>
						{label}
					</Typography>
					<FormGroup>
						{filterOptions
							?.find((opt) => opt.key === key)
							?.value.map((v) => (
								<FormControlLabel
									key={v}
									control={
										<Checkbox
											checked={
												selectedFilters.find(
													(f) => f.key === key && f.value.includes(v),
												) !== undefined
											}
											onChange={() => handleCheck(key, v)}
										/>
									}
									label={v}
								/>
							))}
					</FormGroup>
				</Box>
			))}
		</DialogContent>
	);
};
