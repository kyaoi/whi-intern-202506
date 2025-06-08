"use client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export function BackToRootButton() {
  const router = useRouter();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => router.push("/")} // ルートディレクトリに遷移
    >
      ホームに戻る
    </Button>
  );
}
