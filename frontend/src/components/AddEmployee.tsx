"use client";
import { Paper, TextField, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Employee } from "../models/Employee";
export function AddEmployeeForm() {
  const [employee, setEmployee] = useState<Employee>({
    id: "",
    name: "",
    age: 0,
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEmployee((prev) => {
      if (name === "age") {
        const parsed = parseInt(value, 10);
        return { ...prev, age: isNaN(parsed) ? 0 : parsed };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const handleSubmit = () => {
    if (!employee.id || !employee.name || employee.age <= 0) {
      setError("すべての項目を正しく入力してください。");
      return;
    }

    console.log("追加された社員:", employee);
    alert("社員が追加されました！");
    setEmployee({ id: "", name: "", age: 0 });
    setError("");
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">社員を追加</Typography>

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <TextField
          label="ID"
          name="id"
          value={employee.id}
          onChange={handleChange}
        />
        <TextField
          label="名前"
          name="name"
          value={employee.name}
          onChange={handleChange}
        />
        <TextField
          label="年齢"
          name="age"
          type="number"
          value={employee.age === 0 ? "" : employee.age}
          onChange={handleChange}
        />

        <Button variant="contained" onClick={handleSubmit}>
          追加
        </Button>
      </Stack>
    </Paper>
  );
}
