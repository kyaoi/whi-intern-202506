import express, { Request, Response } from "express";
import { EmployeeDatabaseInMemory } from './employee/EmployeeDatabaseInMemory';

const app = express();
const port = process.env.PORT ?? 8080;
const database = new EmployeeDatabaseInMemory();



app.get("/api/employees", async (req: Request, res: Response) => {
    const filterText = req.query.filterText ?? "";
    // FIXME: いい方法考える（一旦パス）
    const filterDepartment = req.query.filterDepartment ?? "";
    const filterPosition = req.query.filterPosition ?? "";
    const filterSkill = req.query.filterSkill ?? "";
    let filterDetail = {
        department: Array.isArray(filterDepartment) ? filterDepartment : [filterDepartment],
        position: Array.isArray(filterPosition) ? filterPosition : [filterPosition],
        skill: Array.isArray(filterSkill) ? filterSkill : [filterSkill],
    };
    console.log("filterText:", filterText);
    console.log("filterDepartment:", filterDepartment);
    console.log("filterPosition:", filterPosition);
    console.log("filterSkill:", filterSkill);
    console.log("filterDetail:", filterDetail);
  
    // req.query is parsed by the qs module.
    // https://www.npmjs.com/package/qs
    if (Array.isArray(filterText)) {
        // Multiple filterText is not supported
        res.status(400).send();
        return;
    }
    if (typeof filterText !== "string" || typeof filterDepartment !== "string" || typeof filterPosition !== "string" || typeof filterSkill !== "string") {
        // Nested query object is not supported
        res.status(400).send();
        return;
    }
    try {
        const employees = await database.getEmployees(filterText, "hoge");
        res.status(200).send(JSON.stringify(employees));
    } catch (e) {
        console.error(`Failed to load the users filtered by ${filterText}.`, e);
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

app.listen(port, () => {
    console.log(`App listening on the port ${port}`);
});
