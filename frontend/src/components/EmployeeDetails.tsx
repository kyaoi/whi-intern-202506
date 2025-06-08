import { useTranslation } from "next-i18next";
import PersonIcon from "@mui/icons-material/Person";
import { Avatar, Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import { Employee } from "../models/Employee";
import { useCallback, useState } from "react";

type TabPanelValue = "basicInfo" | "others";

interface TabContentProps {
  value: TabPanelValue;
  selectedValue: TabPanelValue;
  children: React.ReactNode;
}

function TabContent({ value, selectedValue, children }: TabContentProps) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== selectedValue}
      id={`tabpanel-${value}`}
    >
      {children}
    </Box>
  );
}

export type EmployeeDetailsProps = {
  employee: Employee;
};

export function EmployeeDetails({ employee }: EmployeeDetailsProps) {
  // 現在の言語リソースを選択
  const { t } = useTranslation("common");
  const [selectedTabValue, setSelectedTabValue] =
    useState<TabPanelValue>("basicInfo");

  const handleTabValueChange = useCallback(
    (event: React.SyntheticEvent, newValue: TabPanelValue) => {
      setSelectedTabValue(newValue);
    },
    []
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap={1}
      >
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          p={2}
          gap={2}
        >
          <Avatar sx={{ width: 128, height: 128 }}>
            <PersonIcon sx={{ fontSize: 128 }} />
          </Avatar>
          <Typography variant="h5">{employee.name}</Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
          <Tabs value={selectedTabValue} onChange={handleTabValueChange}>
            <Tab label={t("basicInfo")} value="basicInfo" />
            <Tab label={t("others")} value="others" />
          </Tabs>
        </Box>

        <TabContent value="basicInfo" selectedValue={selectedTabValue}>
          <Box p={2} display="flex" flexDirection="column" gap={1}>
            <Typography variant="h6">{t("basicInfo")}</Typography>
            <Typography>
              {t("age")}：{employee.age}
              {t("yearsOld")}
            </Typography>
          </Box>
        </TabContent>

        <TabContent value="others" selectedValue={selectedTabValue}>
          <Box p={2} display="flex" flexDirection="column" gap={1}>
            <Typography variant="h6">{t("others")}</Typography>
          </Box>
        </TabContent>
      </Box>
    </Paper>
  );
}
