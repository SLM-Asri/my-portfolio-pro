import bcrypt from 'bcryptjs';
import { database, ensureDatabase, query } from '../config/database.js';
import environment from '../config/environment.js';
import validator from 'validator';
import { ensureDefaultEducation } from '../controllers/educationController.js';

const existingPortfolioProjects = [
  {
    title: 'AI-Powered Cybersecurity Awareness Chatbot',
    slug: 'cybersecurity-chatbot',
    summary: 'A conversational cybersecurity learning platform with interactive quizzes and awareness content.',
    description: 'A cybersecurity awareness chatbot built with Python, Flask, HTML, CSS, JavaScript, and MySQL. The platform delivers interactive quizzes and awareness content to help users learn safe digital practices through a friendly, conversational interface.',
    project_type: 'Cybersecurity & AI',
    featured_image: '/assets/images/chatbot-banner.jpg',
    technologies: ['Python', 'Flask', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
    details: {
      completion_status: 'Completed',
      problem_statement: 'Users need accessible, engaging ways to learn cybersecurity awareness and safe digital practices.',
      proposed_solution: 'A friendly conversational interface combines cybersecurity awareness content with interactive quizzes.',
      objectives: ['Help users learn safe digital practices through awareness content and quizzes.'],
      features: [
        'Conversational chatbot interface',
        'User registration and authentication',
        'Cybersecurity quizzes and awareness content',
        'MySQL-backed user and learning data'
      ],
      frontend_details: 'HTML, CSS, and JavaScript provide the chatbot interface.',
      backend_details: 'Python and Flask power the application backend.',
      database_details: 'MySQL stores user accounts, quiz data, and learning progress.',
      architecture: 'Browser interface (HTML, CSS, and JavaScript) communicates with a Flask backend, which connects to MySQL.',
      database_structure: 'MySQL persists user accounts, quiz content, and progress data.',
      role_contributions: 'Founder and developer; built the chatbot, learning features, and authentication flow.'
    }
  },
  {
    title: 'Gamified Student Knowledge Assessment System',
    slug: 'knowledge-assessment',
    summary: 'A web-based student assessment platform with gamified quizzes, progress tracking, and dashboards.',
    description: 'A web-based student knowledge assessment system built with HTML, CSS, JavaScript, Node.js, Express.js, and MySQL. Gamified quizzes, scoring, levels, and progress tracking support student engagement, while JWT authentication and dashboards support secure access and performance monitoring.',
    project_type: 'Education',
    featured_image: '/assets/images/logo.jpg',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express.js', 'MySQL', 'JWT'],
    details: {
      completion_status: 'Completed',
      problem_statement: 'Students need an engaging way to assess knowledge levels and follow their learning progress.',
      proposed_solution: 'A web-based assessment system uses gamified quizzes, scoring, levels, and dashboards to support assessment and progress tracking.',
      objectives: [
        'Identify student knowledge levels through assessments.',
        'Encourage engagement with scoring, levels, and progress tracking.'
      ],
      features: [
        'Gamified quizzes with scoring and levels',
        'Student progress tracking',
        'Student and administrator dashboards',
        'JWT authentication',
        'MySQL-backed assessment data'
      ],
      frontend_details: 'HTML, CSS, and JavaScript provide the web interface.',
      backend_details: 'Node.js and Express.js provide the application API and JWT-protected access.',
      database_details: 'MySQL stores user, quiz, and assessment result data.',
      architecture: 'Browser client (HTML, CSS, and JavaScript) communicates with a Node.js/Express.js backend and MySQL database.',
      database_structure: 'MySQL stores account, quiz, and assessment result records.',
      role_contributions: 'Designed and built the student knowledge assessment system, including its gamified assessment flow and dashboards.'
    }
  }
];

async function seedInitialAdmin() {
  const adminCount = await query('SELECT COUNT(*) as total FROM admins');
  if (Number(adminCount[0]?.total || 0) > 0) {
    return;
  }

  const email = environment.ADMIN_EMAIL.trim().toLowerCase();
  const passwordBytes = Buffer.byteLength(environment.ADMIN_PASSWORD, 'utf8');
  if (!validator.isEmail(email) || email.length > 254) {
    throw new Error('Set a valid ADMIN_EMAIL in backend/.env before creating the initial admin.');
  }
  if (passwordBytes < 12 || passwordBytes > 72) {
    throw new Error('Set an ADMIN_PASSWORD between 12 and 72 UTF-8 bytes before creating the initial admin.');
  }

  const passwordHash = await bcrypt.hash(environment.ADMIN_PASSWORD, 12);
  await query(
    'INSERT INTO admins (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, 1)',
    [environment.ADMIN_NAME, email, passwordHash, 'admin']
  );
}

async function seedExistingProjects() {
  for (const project of existingPortfolioProjects) {
    const existing = await query('SELECT id FROM projects WHERE slug = ? LIMIT 1', [project.slug]);
    if (existing.length) continue;

    const connection = await database.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.execute(
        'INSERT INTO projects (title, slug, summary, description, project_type, featured_image, is_published) VALUES (?, ?, ?, ?, ?, ?, 1)',
        [project.title, project.slug, project.summary, project.description, project.project_type, project.featured_image]
      );
      for (const technology of project.technologies) {
        await connection.execute(
          'INSERT INTO project_technologies (project_id, technology_name) VALUES (?, ?)',
          [result.insertId, technology]
        );
      }

      const detailFields = Object.keys(project.details);
      await connection.execute(
        `INSERT INTO project_details (project_id, ${detailFields.map((field) => `\`${field}\``).join(', ')})
         VALUES (?, ${detailFields.map(() => '?').join(', ')})`,
        [
          result.insertId,
          ...detailFields.map((field) => (
            Array.isArray(project.details[field])
              ? JSON.stringify(project.details[field])
              : project.details[field]
          ))
        ]
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

async function seedPortfolioDefaults() {
  const personalCount = await query('SELECT COUNT(*) as total FROM personal_info');
  if (Number(personalCount[0]?.total || 0) === 0) {
    await query(
      `INSERT INTO personal_info (full_name, headline, bio, email, phone, location, linkedin, github, resume_url, hero_video_url, avatar_url, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        'Sulaiman Lebbe Muhammad Asri',
        "Full-Stack Web Developer",
        "I am a highly motivated HND IT student with a strong foundation in software engineering, full-stack web development, mobile application development, and desktop application development. Proficient in HTML5, CSS3, JavaScript, Node.js, Electron, MySQL, Flutter, and Object-Oriented Programming (OOP), I enjoy designing responsive web applications and database-driven systems. I'm currently expanding my knowledge in Artificial Intelligence, Deep Learning, and Computer Vision through practical projects, and I approach every challenge with a quick-learning, problem-solving, and team-first mindset.",
        'mohammadasri553@gmail.com',
        '+94 76 896 7587',
        'Anuradhapura, Sri Lanka',
        'https://www.linkedin.com/in/muhammad-asri-37a192329',
        'https://github.com/SLM-Asri',
        '/assets/documents/Asri_Resume.pdf',
        '/assets/videos/Say_this_Hello_welcome_to_my.mp4',
        '/assets/images/logo.jpg'
      ]
    );
  }

  const settingsCount = await query('SELECT COUNT(*) as total FROM site_settings');
  if (Number(settingsCount[0]?.total || 0) === 0) {
    await query(
      `INSERT INTO site_settings (site_name, meta_title, meta_description, contact_email, contact_phone, location, primary_color, secondary_color)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Asri Dev',
        'Sulaiman Lebbe Muhammad Asri | Full-Stack & Software Engineering Student',
        'Professional Portfolio of Sulaiman Lebbe Muhammad Asri - Full-Stack Web Developer, Mobile & Desktop App Developer, and AI/Cybersecurity Enthusiast.',
        'mohammadasri553@gmail.com',
        '+94 76 896 7587',
        'Anuradhapura, Sri Lanka',
        '#3b82f6',
        '#f97316'
      ]
    );
  }

  const skillsCount = await query('SELECT COUNT(*) as total FROM skills');
  if (Number(skillsCount[0]?.total || 0) === 0) {
    const defaultSkills = [
      ['HTML5, CSS3 & JavaScript', 'Web Fundamentals', 95, 'Responsive layouts and semantic UI'],
      ['Node.js & Express.js', 'Backend', 90, 'REST APIs and secure services'],
      ['MySQL & Database Management', 'Database', 88, 'Relational database design and optimization'],
      ['Flutter & Dart', 'Mobile', 82, 'Cross-platform mobile app development'],
      ['Electron', 'Desktop', 80, 'Desktop application development'],
      ['Cybersecurity Fundamentals', 'Security', 78, 'Security awareness and secure architecture']
    ];

    for (const [name, category, level, description] of defaultSkills) {
      await query(
        'INSERT INTO skills (name, category, level, description, is_published) VALUES (?, ?, ?, ?, 1)',
        [name, category, level, description]
      );
    }
  }

  const certCount = await query('SELECT COUNT(*) as total FROM certifications');
  if (Number(certCount[0]?.total || 0) === 0) {
    const entries = [
      ['PYTHON FOR BEGINNERS', 'University of Moratuwa', 'Foundational Python programming certification.', '2023'],
      ['PYTHON PROGRAMMING USING VS CODE', 'Microsoft Learn Student Ambassador', 'Practical Python development in Visual Studio Code.', '2024'],
      ['SPOKEN ENGLISH', 'Vidura Faculty of English', 'Professional communication skills.', '2024'],
      ['PSYCHOLOGY & MOULAVI CERTIFICATION', 'NKB Studies / Dharus Salam', 'Psychology and Islamic studies certification.', '2021']
    ];

    for (const [title, organization, description, issuedDate] of entries) {
      await query(
        'INSERT INTO certifications (title, organization, description, issued_date, is_published) VALUES (?, ?, ?, ?, 1)',
        [title, organization, description, issuedDate]
      );
    }
  }
}

async function main() {
  try {
    await ensureDatabase();
    await seedInitialAdmin();
    await ensureDefaultEducation();
    await seedExistingProjects();
    await seedPortfolioDefaults();
    console.log('Database seeding completed.');
  } finally {
    await database.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
