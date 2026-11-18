import { database, query } from '../config/database.js';

const projectSelect = `
  SELECT projects.*,
    COALESCE(project_details.completion_status, 'Completed') AS completion_status,
    project_details.problem_statement,
    project_details.proposed_solution,
    project_details.objectives,
    project_details.features,
    project_details.frontend_details,
    project_details.backend_details,
    project_details.database_details,
    project_details.screenshots,
    project_details.architecture,
    project_details.database_structure,
    project_details.challenges,
    project_details.role_contributions,
    project_details.github_url,
    project_details.live_demo_url
  FROM projects
  LEFT JOIN project_details ON project_details.project_id = projects.id`;

const projectFields = {
  title: 'title',
  slug: 'slug',
  summary: 'summary',
  description: 'description',
  project_type: 'project_type',
  featured_image: 'featured_image',
  link_url: 'link_url',
  is_published: 'is_published'
};

const detailFields = {
  completion_status: 'completion_status',
  problem_statement: 'problem_statement',
  proposed_solution: 'proposed_solution',
  objectives: 'objectives',
  features: 'features',
  frontend_details: 'frontend_details',
  backend_details: 'backend_details',
  database_details: 'database_details',
  screenshots: 'screenshots',
  architecture: 'architecture',
  database_structure: 'database_structure',
  challenges: 'challenges',
  role_contributions: 'role_contributions',
  github_url: 'github_url',
  live_demo_url: 'live_demo_url'
};

const arrayFields = new Set(['objectives', 'features', 'screenshots']);

function parseArray(value) {
  if (!value) return [];
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error('Stored project list data is invalid.');
  return parsed;
}

function toProject(project) {
  return {
    ...project,
    is_published: Boolean(project.is_published),
    objectives: parseArray(project.objectives),
    features: parseArray(project.features),
    screenshots: parseArray(project.screenshots),
    technologies: project.technologies || []
  };
}

async function attachTechnologies(projects) {
  if (!projects.length) return [];

  const projectIds = projects.map((project) => project.id);
  const placeholders = projectIds.map(() => '?').join(', ');
  const rows = await query(
    `SELECT project_id, technology_name FROM project_technologies
     WHERE project_id IN (${placeholders}) ORDER BY id ASC`,
    projectIds
  );
  const technologyMap = new Map(projectIds.map((id) => [id, []]));
  for (const row of rows) {
    technologyMap.get(row.project_id)?.push(row.technology_name);
  }

  return projects.map((project) => toProject({
    ...project,
    technologies: technologyMap.get(project.id) || []
  }));
}

export async function fetchProjects({ publishedOnly = false } = {}) {
  const filter = publishedOnly ? 'WHERE projects.is_published = 1' : '';
  const projects = await query(`${projectSelect} ${filter} ORDER BY projects.id DESC`);
  return attachTechnologies(projects);
}

export async function fetchProjectById(id) {
  const projects = await query(`${projectSelect} WHERE projects.id = ? LIMIT 1`, [id]);
  if (!projects.length) return null;
  return (await attachTechnologies(projects))[0];
}

export async function fetchPublicProjectBySlug(slug) {
  const projects = await query(
    `${projectSelect} WHERE projects.slug = ? AND projects.is_published = 1 LIMIT 1`,
    [slug]
  );
  if (!projects.length) return null;

  const project = (await attachTechnologies(projects))[0];
  const candidates = await query(
    `${projectSelect}
     WHERE projects.is_published = 1 AND projects.id <> ?
     ORDER BY (projects.project_type = ?) DESC, projects.id DESC
     LIMIT 3`,
    [project.id, project.project_type]
  );
  project.relatedProjects = await attachTechnologies(candidates);
  return project;
}

export async function listProjects(req, res) {
  try {
    return res.json(await fetchProjects());
  } catch (error) {
    console.error('Unable to load admin projects:', error);
    return res.status(500).json({ message: 'Unable to load projects.' });
  }
}

export async function getProject(req, res) {
  try {
    const project = await fetchProjectById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    return res.json(project);
  } catch (error) {
    console.error('Unable to load admin project:', error);
    return res.status(500).json({ message: 'Unable to load project.' });
  }
}

function validateList(value, fieldName) {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string')) {
    throw new Error(`${fieldName} must be a list of text values.`);
  }
  return value.map((entry) => entry.trim()).filter(Boolean);
}

function normalizeProjectFields(body, creating) {
  const normalized = {};
  const maxLengths = {
    title: 255,
    slug: 255,
    project_type: 100,
    featured_image: 255,
    link_url: 255
  };
  for (const field of Object.keys(projectFields)) {
    if (body[field] === undefined) continue;
    if (field === 'is_published') {
      if (typeof body[field] !== 'boolean') throw new Error('Published status must be true or false.');
      normalized[field] = body[field] ? 1 : 0;
      continue;
    }
    if (typeof body[field] !== 'string') throw new Error(`${field} must be text.`);
    normalized[field] = body[field].trim();
    if (maxLengths[field] && normalized[field].length > maxLengths[field]) {
      throw new Error(`${field} must be ${maxLengths[field]} characters or fewer.`);
    }
  }

  if (creating) {
    if (!normalized.title || !normalized.slug || !normalized.featured_image) {
      throw new Error('Project title, slug, and thumbnail URL are required.');
    }
    normalized.summary = normalized.summary || '';
    normalized.description = normalized.description || '';
    normalized.project_type = normalized.project_type || 'Portfolio';
    normalized.link_url = normalized.link_url || null;
    normalized.is_published = normalized.is_published ?? 1;
  }

  if (normalized.title !== undefined && !normalized.title) {
    throw new Error('Project title is required.');
  }
  if (normalized.slug !== undefined) {
    normalized.slug = normalized.slug.toLowerCase();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized.slug)) {
      throw new Error('Project slug must use lowercase letters, numbers, and single hyphens.');
    }
  }
  if (normalized.featured_image !== undefined && !normalized.featured_image) {
    throw new Error('Project thumbnail URL is required.');
  }

  return normalized;
}

function normalizeDetailFields(body, creating) {
  const normalized = {};
  const maxLengths = { completion_status: 80, github_url: 512, live_demo_url: 512 };
  for (const field of Object.keys(detailFields)) {
    if (body[field] === undefined && !creating) continue;
    const value = body[field];
    if (arrayFields.has(field)) {
      normalized[field] = JSON.stringify(value === undefined ? [] : validateList(value, field));
    } else {
      if (value !== undefined && value !== null && typeof value !== 'string') {
        throw new Error(`${field} must be text.`);
      }
      normalized[field] = value || (field === 'completion_status' ? 'Completed' : '');
      if (maxLengths[field] && normalized[field].length > maxLengths[field]) {
        throw new Error(`${field} must be ${maxLengths[field]} characters or fewer.`);
      }
    }
  }
  return normalized;
}

function normalizeTechnologies(value) {
  if (!Array.isArray(value) || value.length > 50 || value.some((entry) => typeof entry !== 'string')) {
    throw new Error('Technologies must be a list of up to 50 text values.');
  }
  return [...new Set(value.map((entry) => entry.trim()).filter(Boolean))];
}

async function replaceTechnologies(connection, projectId, technologies) {
  await connection.execute('DELETE FROM project_technologies WHERE project_id = ?', [projectId]);
  for (const technology of technologies) {
    if (technology.length > 120) throw new Error('Technology names must be 120 characters or fewer.');
    await connection.execute(
      'INSERT INTO project_technologies (project_id, technology_name) VALUES (?, ?)',
      [projectId, technology]
    );
  }
}

async function saveProjectDetails(connection, projectId, details) {
  const fields = Object.keys(details);
  if (!fields.length) return;
  const columns = fields.map((field) => detailFields[field]);
  const values = fields.map((field) => details[field]);
  const updates = columns.map((column) => `\`${column}\` = VALUES(\`${column}\`)`);
  await connection.execute(
    `INSERT INTO project_details (project_id, ${columns.map((column) => `\`${column}\``).join(', ')})
     VALUES (?, ${columns.map(() => '?').join(', ')})
     ON DUPLICATE KEY UPDATE ${updates.join(', ')}`,
    [projectId, ...values]
  );
}

async function withTransaction(callback) {
  const connection = await database.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

function handleWriteError(res, error, action) {
  if (error.message && /required|must be|slug|thumbnail|technology/i.test(error.message)) {
    return res.status(400).json({ message: error.message });
  }
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'A project with this slug already exists.' });
  }
  console.error(`${action} failed:`, error);
  return res.status(500).json({ message: `Unable to ${action} project.` });
}

export async function createProject(req, res) {
  let projectFieldsToSave;
  let detailValues;
  let technologies;
  try {
    const body = req.body || {};
    projectFieldsToSave = normalizeProjectFields(body, true);
    detailValues = normalizeDetailFields(body, true);
    technologies = normalizeTechnologies(body.technologies || []);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const id = await withTransaction(async (connection) => {
      const [result] = await connection.execute(
        `INSERT INTO projects (${Object.keys(projectFields).map((field) => `\`${projectFields[field]}\``).join(', ')})
         VALUES (${Object.keys(projectFields).map(() => '?').join(', ')})`,
        Object.keys(projectFields).map((field) => projectFieldsToSave[field])
      );
      await saveProjectDetails(connection, result.insertId, detailValues);
      await replaceTechnologies(connection, result.insertId, technologies);
      return result.insertId;
    });
    return res.status(201).json({ id, message: 'Project created successfully.' });
  } catch (error) {
    return handleWriteError(res, error, 'create');
  }
}

export async function updateProject(req, res) {
  let projectFieldsToSave;
  let detailValues;
  let technologies;
  try {
    const body = req.body || {};
    projectFieldsToSave = normalizeProjectFields(body, false);
    detailValues = normalizeDetailFields(body, false);
    if (body.technologies !== undefined) technologies = normalizeTechnologies(body.technologies);
    if (!Object.keys(projectFieldsToSave).length && !Object.keys(detailValues).length && !technologies) {
      return res.status(400).json({ message: 'No project fields were provided.' });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  try {
    await withTransaction(async (connection) => {
      const [existing] = await connection.execute('SELECT id FROM projects WHERE id = ? LIMIT 1', [req.params.id]);
      if (!existing.length) {
        const notFound = new Error('Project not found.');
        notFound.statusCode = 404;
        throw notFound;
      }

      const fields = Object.keys(projectFieldsToSave);
      if (fields.length) {
        await connection.execute(
          `UPDATE projects SET ${fields.map((field) => `\`${projectFields[field]}\` = ?`).join(', ')} WHERE id = ?`,
          [...fields.map((field) => projectFieldsToSave[field]), req.params.id]
        );
      }
      await saveProjectDetails(connection, req.params.id, detailValues);
      if (technologies) await replaceTechnologies(connection, req.params.id, technologies);
    });
    return res.json({ message: 'Project updated successfully.' });
  } catch (error) {
    if (error.statusCode === 404) return res.status(404).json({ message: error.message });
    return handleWriteError(res, error, 'update');
  }
}

export async function deleteProject(req, res) {
  try {
    await query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Project deletion failed:', error);
    return res.status(500).json({ message: 'Unable to delete project.' });
  }
}
