import { query } from '../config/database.js';

export async function listCertifications(req, res) {
  try {
    const rows = await query('SELECT * FROM certifications ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load certifications.', error: error.message });
  }
}

export async function createCertification(req, res) {
  try {
    const { title, organization, description, issued_date, is_published } = req.body || {};
    if (!title) {
      return res.status(400).json({ message: 'Certification title is required.' });
    }

    const result = await query(
      'INSERT INTO certifications (title, organization, description, issued_date, is_published) VALUES (?, ?, ?, ?, ?)',
      [title, organization || '', description || '', issued_date || '', is_published === false ? 0 : 1]
    );

    return res.status(201).json({ id: result.insertId, message: 'Certification created successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create certification.', error: error.message });
  }
}

export async function updateCertification(req, res) {
  try {
    const { id } = req.params;
    const { title, organization, description, issued_date, is_published } = req.body || {};
    await query(
      'UPDATE certifications SET title = ?, organization = ?, description = ?, issued_date = ?, is_published = ? WHERE id = ?',
      [title || '', organization || '', description || '', issued_date || '', is_published === false ? 0 : 1, id]
    );
    res.json({ message: 'Certification updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update certification.', error: error.message });
  }
}

export async function deleteCertification(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM certifications WHERE id = ?', [id]);
    res.json({ message: 'Certification deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete certification.', error: error.message });
  }
}
