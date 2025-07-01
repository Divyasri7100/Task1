
import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";


const prisma = new PrismaClient();
const app = express();
const port = 4000;

app.use(express.json());

// Home
app.get("/", (req, res) => {
  res.send("Hello from Express + Prisma + TypeScript!");
});


app.post("/employees", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, salary } = req.body;

    if (!name || salary === undefined || isNaN(Number(salary))) {
      res.status(400).json({ error: "Name and valid salary required" });
      return;
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        salary: parseFloat(salary),
      },
    });

    res.status(201).json(employee);
  } catch (err) {
    console.error("POST error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Get all
app.get("/employees", async (req, res) => {
  const employees = await prisma.employee.findMany();
  res.json(employees);
});



// Update
app.patch("/employees/:id", async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const { name, salary } = req.body;

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid employee ID" });
    return;
  }

  try {
    const updateData: { name?: string; salary?: number } = {};
    if (name) updateData.name = name;
    if (salary !== undefined && !isNaN(Number(salary))) updateData.salary = parseFloat(salary);

    const updated = await prisma.employee.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (err: any) {
    console.error("Update error:", err);
    res.status(404).json({ error: "Employee not found or invalid input" });
  }
});


// Delete
app.delete("/employees/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.employee.delete({ where: { id } });
    res.json({ message: "Employee deleted" });
  } catch {
    res.status(404).json({ error: "Employee not found" });
  }
});

app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});
