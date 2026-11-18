import { database, query } from '../config/database.js';

export const defaultEducation = [
  {
    degree: 'Higher National Diploma in Information Technology (HND IT)',
    institution: 'SLIATE Anuradhapura',
    location: 'Anuradhapura',
    start_date: '2024',
    end_date: 'Present',
    description: 'Database Management Systems\nSoftware Engineering & System Analysis\nNetworking & Cybersecurity Fundamentals'
  },
  {
    degree: 'G.C.E. Advanced Level (Technology Stream)',
    institution: 'Dharus Salam Arabic College - Oddamavadi',
    location: 'Oddamavadi',
    start_date: '2022',
    end_date: '2023',
    description: 'Engineering Technology subjects\nIntroductory programming foundation\nStrong communication skill-building'
  },
  {
    degree: 'G.C.E. Ordinary Level',
    institution: 'Dharus Salam Arabic College - Oddamavadi',
    location: 'Oddamavadi',
    start_date: '',
    end_date: '2019',
    description: 'General Science & Math basics\nOutstanding language & communication skills\nComputer literacy & hardware basics'
  }
];

export async function ensureDefaultEducation() {
  const connection = await database.getConnection();
  try {
    await connection.beginTransaction();
    const [migrationResult] = await connection.execute(
      'INSERT IGNORE INTO data_migrations (migration_key) VALUES (?)',
      ['legacy_education_timeline_v1']
    );
    if (!migrationResult.affectedRows) {
      await connection.rollback();
      return;
    }

    for (const item of defaultEducation) {
      const [existing] = await connection.execute(
        'SELECT id FROM education WHERE degree = ? AND institution = ? LIMIT 1',
        [item.degree, item.institution]
      );
      if (existing.length) continue;

      await connection.execute(
        'INSERT INTO education (degree, institution, location, start_date, end_date, description, is_published) VALUES (?, ?, ?, ?, ?, ?, 1)',
        [item.degree, item.institution, item.location, item.start_date, item.end_date, item.description]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function listEducation(req, res) {
  try {
    const rows = await query('SELECT * FROM education ORDER BY id DESC');
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load education.', error: error.message });
  }
}

export async function createEducation(req, res) {
  try {
    const { degree, institution, location, start_date, end_date, description, is_published } = req.body || {};
    if (!String(degree || '').trim()) {
      return res.status(400).json({ message: 'Education title is required.' });
    }

    const result = await query(
      'INSERT INTO education (degree, institution, location, start_date, end_date, description, is_published) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [degree.trim(), institution || '', location || '', start_date || '', end_date || '', description || '', is_published === false ? 0 : 1]
    );
    return res.status(201).json({ id: result.insertId, message: 'Education created successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create education.', error: error.message });
  }
}

export async function updateEducation(req, res) {
  try {
    const { id } = req.params;
    const { degree, institution, location, start_date, end_date, description, is_published } = req.body || {};
    if (!String(degree || '').trim()) {
      return res.status(400).json({ message: 'Education title is required.' });
    }

    const existing = await query('SELECT id FROM education WHERE id = ? LIMIT 1', [id]);
    if (!existing.length) {
      return res.status(404).json({ message: 'Education record not found.' });
    }

    await query(
      'UPDATE education SET degree = ?, institution = ?, location = ?, start_date = ?, end_date = ?, description = ?, is_published = ? WHERE id = ?',
      [degree.trim(), institution || '', location || '', start_date || '', end_date || '', description || '', is_published === false ? 0 : 1, id]
    );
    return res.json({ message: 'Education updated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update education.', error: error.message });
  }
}

