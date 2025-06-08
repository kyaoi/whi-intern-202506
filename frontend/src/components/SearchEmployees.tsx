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
import { useState } from "react";
import { EmployeeListContainer } from "./EmployeeListContainer";

export function SearchEmployees() {
	const [searchKeyword, setSearchKeyword] = useState("");
	const [searchDetail, setSearchDetail] = useState<FilterOptions | undefined>(
		undefined,
	);
	console.log("searchDetail", searchDetail);

	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleAccept = (data: FilterOptions) => {
		console.log("data", data);

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
	handleAccept: (data: FilterOptions) => void;
	handleCancel: () => void;
	open: boolean;
};

const SearchModal = ({
	open,
	handleAccept,
	handleCancel,
}: SearchModalProps) => {
	// 仮データ
	const [filterOptions, setFilterOptions] = useState<FilterOptions>({
		department: ["Development", "Sales", "マーケティング"],
		position: ["マネージャー", "デザイナー"],
		skill: ["React", "Vue", "Go", "Photoshop", "Leadership"],
	});

	const [selectedFilters, setSelectedFilters] = useState<{
		[key: string]: string[];
	}>({});

	const handleCheck = (key: string, value: string) => {
		setSelectedFilters((prev) => {
			const current = prev[key] ?? [];
			const newValues = current.includes(value)
				? current.filter((v) => v !== value)
				: [...current, value];
			return {
				...prev,
				[key]: newValues,
			};
		});
	};

	return (
		<Dialog
			open={open}
			onClose={() => handleAccept(selectedFilters)}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle>詳細検索</DialogTitle>
			<DialogContent>
				{Object.entries(employeeKeys).map(([key, label]) => (
					<Box key={key} mb={2}>
						<Typography variant="subtitle1" gutterBottom>
							{label}
						</Typography>
						<FormGroup>
							{filterOptions[key as keyof typeof employeeKeys]?.map(
								(option) => (
									<FormControlLabel
										key={option}
										control={
											<Checkbox
												checked={
													selectedFilters[key]?.includes(option) ?? false
												}
												onChange={() => handleCheck(key, option)}
											/>
										}
										label={option}
									/>
								),
							)}
						</FormGroup>
					</Box>
				))}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel} variant="contained">
					キャンセル
				</Button>
				<Button
					onClick={() => {
						console.log("selectedFilters", selectedFilters);
						handleAccept(selectedFilters);
					}}
				>
					検索
				</Button>
			</DialogActions>
		</Dialog>
	);
};
