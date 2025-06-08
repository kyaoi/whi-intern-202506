"use client";
import { Paper, TextField, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Employee } from "../models/Employee";

export function AddEmployeeForm() {
  const [employee, setEmployee] = useState<Employee>({
    id: "",
    name: "",
    age: 0,
    department: "",
    position: "",
    skill: [],
  });

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEmployee((prev) => {
      if (name === "age") {
        const parsed = parseInt(value, 10);
        return { ...prev, age: isNaN(parsed) ? 0 : parsed };
      } else if (name === "skill") {
        // カンマ区切りで配列に変換
        return {
          ...prev,
          skill: value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const handleSubmit = async () => {
    if (
      !employee.id ||
      !employee.name ||
      employee.age <= 0 ||
      !employee.department ||
      !employee.position
    ) {
      setError("すべての項目を正しく入力してください。");
      return;
    }

    try {
      const checkRes = await fetch(`/api/employees/${employee.id}`);
      if (checkRes.ok) {
        setError("このIDは既に存在しています。別のIDを使用してください。");
        return;
      }

      const res = await fetch("/api/add_employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee),
      });
      if (!res.ok) {
        throw new Error("登録に失敗しました");
      }
      setEmployee({
        id: "",
        name: "",
        age: 0,
        department: "",
        position: "",
        skill: [],
      });
      setError("");
      alert("社員を追加しました");
    } catch (e: any) {
      setError(e.message ?? "登録に失敗しました");
    }
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
        <TextField
          label="所属"
          name="department"
          value={employee.department}
          onChange={handleChange}
        />
        <TextField
          label="役職"
          name="position"
          value={employee.position}
          onChange={handleChange}
        />
        <TextField
          label="スキル（カンマ区切り）"
          name="skill"
          value={employee.skill.join(", ")}
          onChange={handleChange}
        />

        <Button variant="contained" onClick={handleSubmit}>
          追加
        </Button>
      </Stack>
    </Paper>
  );
}
