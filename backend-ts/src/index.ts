import cors from "cors";
import express, { type Request, type Response } from "express";
import { type FilterDetail, convertToArray } from "./employee/Employee";
import { EmployeeDatabaseInMemory } from "./employee/EmployeeDatabaseInMemory";
const app = express();
app.use(cors());
const port = process.env.PORT ?? 8080;
const database = new EmployeeDatabaseInMemory();

app.get("/api/employees", async (req: Request, res: Response) => {
  const filterName = req.query.filterName ?? "";
  const filterDepartment = req.query.department ?? "";
  const filterPosition = req.query.position ?? "";
  const filterSkill = req.query.skill ?? "";
  // req.query is parsed by the qs module.
  // https://www.npmjs.com/package/qs
  if (Array.isArray(filterName)) {
    // Multiple filterName is not supported
    res.status(400).send();
    return;
  }
  if (
    typeof filterName !== "string" ||
    typeof filterDepartment !== "string" ||
    typeof filterPosition !== "string" ||
    typeof filterSkill !== "string"
  ) {
    // Nested query object is not supported
    res.status(400).send();
    return;
  }
  const filterDetail: FilterDetail = {
    department: convertToArray(filterDepartment),
    position: convertToArray(filterPosition),
    skill: convertToArray(filterSkill),
  };

  try {
    const employees = await database.getEmployees(filterName, filterDetail);
    res.status(200).send(JSON.stringify(employees));
  } catch (e) {
    console.error(`Failed to load the users filtered by ${filterName}.`, e);
    res.status(500).send();
  }
});

app.get("/api/employees/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const employee = await database.getEmployee(userId);
    if (employee == undefined) {
      res.status(404).send();
      return;
    }
    res.status(200).send(JSON.stringify(employee));
  } catch (e) {
    console.error(`Failed to load the user ${userId}.`, e);
    res.status(500).send();
  }
});

// TODO: ここは別のディレクトリ移動する
// TODO: アーキテクチャに沿ったやり方に変更
app.get("/api/attributes", async (req: Request, res: Response) => {
  try {
    const attribute = await database.getAttributes();
    res.status(200).send(JSON.stringify(attribute));
  } catch (e) {
    console.error("Failed to load the attributes", e);
    res.status(500).send();
  }
});

// TODO: ここは別のディレクトリ移動する
// TODO: アーキテクチャに沿ったやり方に変更
app.get("/api/attributes", async (req: Request, res: Response) => {
  try {
    const attribute = await database.getAttributes();
    res.status(200).send(JSON.stringify(attribute));
  } catch (e) {
    console.error("Failed to load the attributes", e);
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log(`App listening on the port ${port}`);
});

app.post(
  "/api/add_employee",
  express.json(),
  async (req: Request, res: Response) => {
    //社員を追加するAPI
    const decodeResult = EmployeeT.decode(req.body);
    if (decodeResult._tag === "Left") {
      res.status(400).json({ message: "Invalid employee data" });
      return;
    }
    try {
      await database.addEmployee(decodeResult.right);
      res.status(201).json({ message: "Employee added" });
    } catch (e) {
      console.error("Failed to add employee", e);
      res.status(500).json({ message: "Failed to add employee" });
    }
  }
);
