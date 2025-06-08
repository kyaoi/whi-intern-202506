"use client";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import PeopleIcon from "@mui/icons-material/People";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useRouter, usePathname } from "next/navigation";

export interface GlobalHeaderProps {
  title: string;
}

export function GlobalHeader({ title }: GlobalHeaderProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (event: SelectChangeEvent) => {
    const selectedLocale = event.target.value;
    // 言語コードをURLに含めて遷移
    router.push(`/${selectedLocale}${pathname}`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar
          variant="dense"
          sx={{
            background:
              "linear-gradient(45deg, rgb(0, 91, 172), rgb(94, 194, 198))",
            justifyContent: "space-between",
          }}
        >
          {/* ロゴとタイトル */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link
              href="/"
              style={{
                color: "inherit",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <PeopleIcon fontSize="large" style={{ marginRight: 8 }} />
            </Link>

            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              <Typography variant="h6" component="h1">
                {t(title)}
              </Typography>
            </Link>
          </Box>

          {/* 言語選択プルダウン */}
          <Select
            size="small"
            variant="outlined"
            onChange={handleLanguageChange}
            sx={{ backgroundColor: "#fff", color: "#000", minWidth: 100 }}
          >
            <MenuItem value="ja">日本語</MenuItem>
            <MenuItem value="en">English</MenuItem>
          </Select>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
