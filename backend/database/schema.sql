CREATE DATABASE IF NOT EXISTS `asri_portfolio` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `asri_portfolio`;

CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'admin',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_admin_email (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `admin_sessions` (
  `id` CHAR(36) PRIMARY KEY,
  `admin_id` INT NOT NULL,
  `expires_at` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE,
  INDEX idx_admin_sessions_admin (`admin_id`),
  INDEX idx_admin_sessions_expiry (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `data_migrations` (
  `migration_key` VARCHAR(120) PRIMARY KEY,
  `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `personal_info` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(255) NOT NULL,
  `headline` VARCHAR(255) DEFAULT NULL,
  `bio` TEXT,
  `email` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(100) DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `linkedin` VARCHAR(255) DEFAULT NULL,
  `github` VARCHAR(255) DEFAULT NULL,
  `resume_url` VARCHAR(255) DEFAULT NULL,
  `hero_video_url` VARCHAR(255) DEFAULT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `summary` TEXT,
  `description` TEXT,
  `project_type` VARCHAR(100) DEFAULT NULL,
  `featured_image` VARCHAR(255) DEFAULT NULL,
  `link_url` VARCHAR(255) DEFAULT NULL,
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_projects_slug (`slug`),
  INDEX idx_projects_published (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `project_technologies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` INT NOT NULL,
  `technology_name` VARCHAR(120) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  INDEX idx_project_tech_project (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `project_details` (
  `project_id` INT PRIMARY KEY,
  `completion_status` VARCHAR(80) NOT NULL DEFAULT 'Completed',
  `problem_statement` TEXT,
  `proposed_solution` TEXT,
  `objectives` LONGTEXT,
  `features` LONGTEXT,
  `frontend_details` TEXT,
  `backend_details` TEXT,
  `database_details` TEXT,
  `screenshots` LONGTEXT,
  `architecture` TEXT,
  `database_structure` TEXT,
  `challenges` TEXT,
  `role_contributions` TEXT,
  `github_url` VARCHAR(512) DEFAULT NULL,
  `live_demo_url` VARCHAR(512) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `skills` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `category` VARCHAR(120) DEFAULT 'General',
  `level` INT DEFAULT 80,
  `description` TEXT,
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_skills_category (`category`),
  INDEX idx_skills_published (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `certifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `organization` VARCHAR(255) DEFAULT NULL,
  `description` TEXT,
  `issued_date` VARCHAR(100) DEFAULT NULL,
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_certifications_published (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `experience` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `start_date` VARCHAR(100) DEFAULT NULL,
  `end_date` VARCHAR(100) DEFAULT NULL,
  `description` TEXT,
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `education` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `degree` VARCHAR(255) NOT NULL,
  `institution` VARCHAR(255) DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `start_date` VARCHAR(100) DEFAULT NULL,
  `end_date` VARCHAR(100) DEFAULT NULL,
  `description` TEXT,
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `icon` VARCHAR(120) DEFAULT NULL,
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(180) NOT NULL,
  `role` VARCHAR(180) DEFAULT NULL,
  `quote` TEXT NOT NULL,
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(50) DEFAULT 'new',
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_contact_messages_status (`status`),
  INDEX idx_contact_messages_read (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `site_name` VARCHAR(255) DEFAULT 'Asri Dev',
  `meta_title` VARCHAR(255) DEFAULT NULL,
  `meta_description` TEXT,
  `contact_email` VARCHAR(255) DEFAULT NULL,
  `contact_phone` VARCHAR(100) DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `primary_color` VARCHAR(50) DEFAULT '#3b82f6',
  `secondary_color` VARCHAR(50) DEFAULT '#f97316',
  `skills_degree_label` VARCHAR(255) NOT NULL DEFAULT 'HND IT',
  `about_degree_title` VARCHAR(255) NOT NULL DEFAULT 'HND Information Technology',
  `is_maintenance_mode` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
