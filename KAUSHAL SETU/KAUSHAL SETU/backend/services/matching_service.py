"""Job-to-skill matching service shared by multiple route modules."""

from config.database import get_db_connection


def normalize_skill(value: str) -> str:
    return str(value).strip().lower()


def get_user_skill_set(connection, user_id):
    """Return the set of lowercased skill names the user has verified."""
    cursor = connection.cursor()
    cursor.execute(
        """
        SELECT skill
        FROM verified_skills
        WHERE user_id = %s
        """,
        (user_id,),
    )
    rows = cursor.fetchall()
    cursor.close()

    return {
        normalize_skill(row[0])
        for row in rows
        if row[0]
    }


def split_required_skills(raw):
    """Split a job's required_skills column into a clean list."""
    if not raw:
        return []

    if isinstance(raw, list):
        return [str(skill).strip() for skill in raw if str(skill).strip()]

    return [
        skill.strip()
        for skill in str(raw).split(",")
        if skill.strip()
    ]


def compute_match(required_skills, user_skills):
    """Compute matched/missing skills and a 0-100 match score."""
    matched = [
        skill
        for skill in required_skills
        if normalize_skill(skill) in user_skills
    ]
    missing = [
        skill
        for skill in required_skills
        if normalize_skill(skill) not in user_skills
    ]

    score = (
        round((len(matched) / len(required_skills)) * 100, 2)
        if required_skills
        else 0
    )

    return matched, missing, score


def build_job_matches(connection, user_id):
    """Return every job annotated with match data, highest score first."""
    user_skills = get_user_skill_set(connection, user_id)

    cursor = connection.cursor()
    cursor.execute(
        """
        SELECT
            id,
            job_id,
            job_title,
            company,
            location,
            required_skills,
            experience_level,
            employment_type,
            salary_range,
            engineering_field
        FROM job_postings
        ORDER BY id
        """
    )
    rows = cursor.fetchall()
    cursor.close()

    matches = []

    for row in rows:
        required_skills = split_required_skills(row[5])
        matched, missing, score = compute_match(required_skills, user_skills)

        matches.append({
            "id": row[0],
            "job_id": row[1],
            "title": row[2],
            "company": row[3],
            "location": row[4],
            "required_skills": required_skills,
            "matched_skills": matched,
            "missing_skills": missing,
            "match_score": score,
            "experience": row[6],
            "job_type": row[7],
            "salary": row[8],
            "engineering_field": row[9],
        })

    matches.sort(key=lambda job: job["match_score"], reverse=True)

    return matches
