"use client";
import { MenuItem, Paper, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Container, Box, Typography, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";
import { EmployeeListContainer } from "./EmployeeListContainer";
import { employeeKeys, FilterOptions } from "@/types/employee";


export function SearchEmployees() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchDetail, setSearchDetail] = useState<FilterOptions | undefined>(undefined);
  const [open, setOpen] = useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (data: FilterOptions) => {
    setOpen(false);
    setSearchDetail(data)
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
      <Container sx={{ display: "flex", flexDirection: "column",  alignItems: "center", justifyContent: "center"}}>
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
      <SearchModal handleClose={handleClose} open={open}/>
      <EmployeeListContainer
        key="employeesContainer"
        filterText={searchKeyword}
        filterDetail={searchDetail}
      />
    </Paper>
  );
}

type SearchModalProps = {
  handleClose: (data: FilterOptions) => void;
  open: boolean;
}


const SearchModal = ({ open, handleClose }: SearchModalProps) => {
  // 仮データ
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    department: ["開発", "営業", "人事"],
    position: ["リーダー", "メンバー"],
    skill: ["React", "Vue", "Go"],
  });

  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});

  console.log(selectedFilters);
  

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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>詳細検索</DialogTitle>
      <DialogContent>
        {Object.entries(employeeKeys).map(([key, label]) => (
          <Box key={key} mb={2}>
            <Typography variant="subtitle1" gutterBottom>
              {label}
            </Typography>
            <FormGroup>
              {filterOptions[key as keyof typeof employeeKeys]?.map((option) => (
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
              ))}
            </FormGroup>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
            handleClose(selectedFilters);
          }}>
          キャンセル
        </Button>
        <Button
          onClick={() => {
            handleClose(selectedFilters);
          }}
          variant="contained"
        >
          検索
        </Button>
      </DialogActions>
    </Dialog>
  );
};
