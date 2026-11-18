import { query } from '../config/database.js';

export async function listSkills(req, res) {
  try {
    const rows = await query('SELECT * FROM skills ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load skills.', error: error.message });
  }
}

export async function createSkill(req, res) {
  try {
    const { name, category, level, description, is_published } = req.body || {};
    if (!name) {
      return res.status(400).json({ message: 'Skill name is required.' });
    }

    const result = await query(
      'INSERT INTO skills (name, category, level, description, is_published) VALUES (?, ?, ?, ?, ?)',
      [name, category || 'General', level || 80, description || '', is_published === false ? 0 : 1]
    );

    return res.status(201).json({ id: result.insertId, message: 'Skill created successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create skill.', error: error.message });
  }
}

export async function updateSkill(req, res) {
  try {
    const { id } = req.params;
    const { name, category, level, description, is_published } = req.body || {};
    await query(
      'UPDATE skills SET name = ?, category = ?, level = ?, description = ?, is_published = ? WHERE id = ?',
      [name || '', category || 'General', level || 80, description || '', is_published === false ? 0 : 1, id]
    );
    res.json({ message: 'Skill updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update skill.', error: error.message });
  }
}

export async function deleteSkill(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM skills WHERE id = ?', [id]);
    res.json({ message: 'Skill deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete skill.', error: error.message });
  }
}
