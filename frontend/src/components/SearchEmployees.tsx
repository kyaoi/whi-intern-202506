"use client";
import type { AttributesOptions, SelectOptions } from "@/types/employee";
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
	const [searchDetail, setSearchDetail] = useState<SelectOptions[]>([]);

	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleAccept = (data: SelectOptions[]) => {
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
	handleAccept: (data: SelectOptions[]) => void;
	handleCancel: () => void;
	open: boolean;
};

const SearchModal = ({
	open,
	handleAccept,
	handleCancel,
}: SearchModalProps) => {
	const [selectedFilters, setSelectedFilters] = useState<SelectOptions[]>([]);

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

const attributesFetcher = async (url: string): Promise<AttributesOptions[]> => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch employees at ${url}`);
	}
	const body = await response.json();
	console.log("Fetched attributes:", body);

	return body;
};

type SearchModalContentProps = {
	selectedFilters: SelectOptions[];
	setSelectedFilters: React.Dispatch<React.SetStateAction<SelectOptions[]>>;
};

const SearchModalContent = ({
	selectedFilters,
	setSelectedFilters,
}: SearchModalContentProps) => {
	const [attributesOptions, setAttributesOptions] = useState<
		AttributesOptions[]
	>([]);

	const { data, error, isLoading } = useSWR<AttributesOptions[], Error>(
		"/api/attributes",
		attributesFetcher,
	);

	useEffect(() => {
		if (data) {
			console.log("Fetched filter options:", data);
			setAttributesOptions(data);
		}
	}, [data]);

	useEffect(() => {
		if (error != null) {
			console.error("Failed to fetch employees filtered by filterName", error);
		}
	}, [error]);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (!attributesOptions || attributesOptions.length === 0) {
		return (
			<Typography variant="body1">No filter options available.</Typography>
		);
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
			{attributesOptions.map(({ key, label, value }) => (
				<Box key={key} mb={2}>
					<Typography variant="subtitle1" gutterBottom>
						{label}
					</Typography>
					<FormGroup>
						{value.map((v) => (
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
