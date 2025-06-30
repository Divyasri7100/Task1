const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 7000;

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'employee'
});

db.connect(err => {
  if (err) throw err;
  console.log(' MySQL connected');
});

app.use(express.json());

// INSERT: Add new employee
app.post('/employees', (req, res) => {
  const { name, salary } = req.body;
  const sql = 'INSERT INTO employees (name, salary) VALUES (?, ?)';
  db.query(sql, [name, salary], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, name, salary });
  });
});

// GET: View all employees
app.get('/employees', (req, res) => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// GET single employee by ID
app.get('/employees/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM employees WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.json(result[0] || { message: 'Employee not found' });
  });
});

// PATCH: Update employee by ID
app.patch('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { name, salary } = req.body;
  const sql = 'UPDATE employees SET name = ?, salary = ? WHERE id = ?';
  db.query(sql, [name, salary, id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Employee updated successfully' });
  });
});

// DELETE: Remove employee by ID
app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM employees WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Employee deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});