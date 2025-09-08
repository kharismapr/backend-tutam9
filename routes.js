// backend/routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const db = require('./database');

// Get all todos
router.get('/todos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM todos ORDER BY deadline ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a todo
router.post('/todos', async (req, res) => {
  const { title, deadline } = req.body;
  if (!title || !deadline) {
    return res.status(400).json({ error: 'Title and deadline are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO todos (title, deadline, completed) VALUES ($1, $2, false) RETURNING *',
      [title, deadline]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle todo completion status
router.patch('/todos/:id/toggle', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'UPDATE todos SET completed = NOT completed WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo
router.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM todos WHERE id = $1', [id]);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;