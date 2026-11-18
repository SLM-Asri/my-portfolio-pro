import { query } from '../config/database.js';

export async function listMessages(req, res) {
  try {
    const rows = await query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load contact messages.', error: error.message });
  }
}

export async function markMessageAsRead(req, res) {
  try {
    const { id } = req.params;
    await query('UPDATE contact_messages SET is_read = 1, status = ? WHERE id = ?', ['read', id]);
    res.json({ message: 'Message marked as read.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update message status.', error: error.message });
  }
}

export async function deleteMessage(req, res) {
  try {
    const { id } = req.params;
    await query('DELETE FROM contact_messages WHERE id = ?', [id]);
    res.json({ message: 'Message deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to delete message.', error: error.message });
  }
}
