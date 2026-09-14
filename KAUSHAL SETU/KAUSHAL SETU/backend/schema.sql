-- Kaushal Setu reference schema (PostgreSQL).
-- Your database should already contain these tables; this file documents the
-- expected shape and can be used to bootstrap a fresh environment.

CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verified_skills (
    id                SERIAL PRIMARY KEY,
    user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill             VARCHAR(160) NOT NULL,
    assessment_score  NUMERIC(5, 2),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assessment_attempts (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill           VARCHAR(160) NOT NULL,
    score           NUMERIC(5, 2),
    passed          SMALLINT DEFAULT 0,
    attempt_number  INTEGER NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS learning_progress (
    id                   SERIAL PRIMARY KEY,
    user_id              INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_name           VARCHAR(160) NOT NULL,
    progress_percentage  NUMERIC(5, 2) NOT NULL DEFAULT 0,
    status               VARCHAR(40) NOT NULL DEFAULT 'In Progress',
    completed_at         TIMESTAMPTZ,
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_postings (
    id                 SERIAL PRIMARY KEY,
    job_id             VARCHAR(64) NOT NULL UNIQUE,
    job_title          VARCHAR(255) NOT NULL,
    company            VARCHAR(255) NOT NULL,
    location           VARCHAR(255),
    required_skills    TEXT,
    experience_level   VARCHAR(80),
    employment_type    VARCHAR(80),
    salary_range       VARCHAR(120),
    source             VARCHAR(120),
    posted_date        DATE,
    engineering_field  VARCHAR(160)
);

CREATE TABLE IF NOT EXISTS applications (
    id                  SERIAL PRIMARY KEY,
    user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id              VARCHAR(64) NOT NULL REFERENCES job_postings(job_id),
    application_status  VARCHAR(60) NOT NULL DEFAULT 'Applied',
    applied_date        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, job_id)
);

CREATE TABLE IF NOT EXISTS placement_outcomes (
    id                SERIAL PRIMARY KEY,
    application_id    INTEGER NOT NULL REFERENCES applications(id),
    user_id           INTEGER NOT NULL,
    job_id            VARCHAR(64) NOT NULL,
    placement_status  VARCHAR(60),
    joining_date      DATE,
    salary_offered    NUMERIC(12, 2),
    employer_name     VARCHAR(255),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roles (
    role_id            INTEGER PRIMARY KEY,
    role_name          VARCHAR(160) NOT NULL,
    engineering_field  VARCHAR(160),
    industry           VARCHAR(160),
    demand_level       VARCHAR(60),
    min_experience     VARCHAR(60),
    employment_type    VARCHAR(60)
);

CREATE TABLE IF NOT EXISTS role_requirements (
    id                  SERIAL PRIMARY KEY,
    role_id             INTEGER NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    skill_name          VARCHAR(160) NOT NULL,
    proficiency_level   VARCHAR(60),
    is_mandatory        BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS candidate_profiles (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    target_role_id  INTEGER REFERENCES roles(role_id),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS industry_trends (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255),
    sector      VARCHAR(160),
    description TEXT,
    impact      VARCHAR(80)
);

CREATE TABLE IF NOT EXISTS skill_demand (
    id           SERIAL PRIMARY KEY,
    skill        VARCHAR(160),
    sector       VARCHAR(160),
    demand_index NUMERIC(5, 2),
    growth_rate  VARCHAR(40)
);

CREATE TABLE IF NOT EXISTS course_mappings (
    id           SERIAL PRIMARY KEY,
    skill        VARCHAR(160),
    course_title VARCHAR(255),
    provider     VARCHAR(160),
    duration     VARCHAR(80),
    level        VARCHAR(80)
);

CREATE INDEX IF NOT EXISTS idx_verified_skills_user ON verified_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_user ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
