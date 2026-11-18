import { query } from '../config/database.js';

export async function getSettings(req, res) {
  try {
    const rows = await query('SELECT * FROM site_settings ORDER BY id DESC LIMIT 1');
    res.json(rows[0] || {});
  } catch (error) {
    res.status(500).json({ message: 'Unable to load site settings.', error: error.message });
  }
}

export async function upsertSettings(req, res) {
  try {
    const current = await query('SELECT * FROM site_settings ORDER BY id DESC LIMIT 1');
    const payload = req.body || {};
    const degreeFields = ['skills_degree_label', 'about_degree_title'];
    for (const field of degreeFields) {
      if (payload[field] !== undefined && (
        typeof payload[field] !== 'string' ||
        !payload[field].trim() ||
        payload[field].trim().length > 255
      )) {
        return res.status(400).json({ message: `${field} must be between 1 and 255 characters.` });
      }
    }

    if (current[0]) {
      const skillsDegreeLabel = payload.skills_degree_label === undefined
        ? current[0].skills_degree_label || 'HND IT'
        : payload.skills_degree_label.trim();
      const aboutDegreeTitle = payload.about_degree_title === undefined
        ? current[0].about_degree_title || 'HND Information Technology'
        : payload.about_degree_title.trim();
      await query(
        'UPDATE site_settings SET site_name = ?, meta_title = ?, meta_description = ?, contact_email = ?, contact_phone = ?, location = ?, primary_color = ?, secondary_color = ?, skills_degree_label = ?, about_degree_title = ?, is_maintenance_mode = ? WHERE id = ?',
        [
          payload.site_name || current[0].site_name,
          payload.meta_title || current[0].meta_title,
          payload.meta_description || current[0].meta_description,
          payload.contact_email || current[0].contact_email,
          payload.contact_phone || current[0].contact_phone,
          payload.location || current[0].location,
          payload.primary_color || current[0].primary_color,
          payload.secondary_color || current[0].secondary_color,
          skillsDegreeLabel,
          aboutDegreeTitle,
          payload.is_maintenance_mode === true ? 1 : 0,
          current[0].id
        ]
      );
      return res.json({ message: 'Site settings updated successfully.' });
    }

    const result = await query(
      'INSERT INTO site_settings (site_name, meta_title, meta_description, contact_email, contact_phone, location, primary_color, secondary_color, skills_degree_label, about_degree_title, is_maintenance_mode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        payload.site_name || 'Asri Dev',
        payload.meta_title || '',
        payload.meta_description || '',
        payload.contact_email || '',
        payload.contact_phone || '',
        payload.location || '',
        payload.primary_color || '#3b82f6',
        payload.secondary_color || '#f97316',
        payload.skills_degree_label?.trim() || 'HND IT',
        payload.about_degree_title?.trim() || 'HND Information Technology',
        payload.is_maintenance_mode === true ? 1 : 0
      ]
    );

    return res.status(201).json({ id: result.insertId, message: 'Site settings created successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to save site settings.', error: error.message });
  }
}
