from flask import Blueprint, jsonify

from config.database import get_db_connection
from middleware.auth_middleware import get_user_id_from_token, unauthorized

role_bp = Blueprint("role", __name__, url_prefix="/api/roles")


def row_to_dict(row, cursor):
    if isinstance(row, dict):
        return row

    columns = [column[0] for column in cursor.description]
    return dict(zip(columns, row))


def get_role_and_user_skills(role_id, user_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT skill_name, proficiency_level, is_mandatory
        FROM role_requirements
        WHERE role_id = %s
        ORDER BY id
        """,
        (role_id,)
    )

    role_rows = cursor.fetchall()

    cursor.execute(
        """
        SELECT skill, assessment_score
        FROM verified_skills
        WHERE user_id = %s
        """,
        (user_id,)
    )

    user_rows = cursor.fetchall()
    user_columns = [column[0] for column in cursor.description]

    cursor.close()
    connection.close()

    user_skills = {}

    for row in user_rows:
        if isinstance(row, dict):
            skill = row["skill"]
            score = row["assessment_score"]
        else:
            skill = row[user_columns.index("skill")]
            score = row[user_columns.index("assessment_score")]

        user_skills[skill.lower()] = score

    return role_rows, user_skills


# ---------------------------------------------------------
# GET ALL ROLES (career explorer)
# GET /api/roles
# ---------------------------------------------------------
@role_bp.route("", methods=["GET"])
def get_roles():
    connection = get_db_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                role_id,
                role_name,
                engineering_field,
                industry,
                demand_level,
                min_experience,
                employment_type
            FROM roles
            ORDER BY role_id
        """)

        rows = cursor.fetchall()
        cursor.close()

        roles = [
            {
                "role_id": row[0],
                "role_name": row[1],
                "engineering_field": row[2],
                "industry": row[3],
                "demand_level": row[4],
                "min_experience": row[5],
                "employment_type": row[6]
            }
            for row in rows
        ]

        return jsonify({
            "success": True,
            "roles": roles,
            "total": len(roles)
        })

    finally:
        cursor.close()
        connection.close()


@role_bp.route("/<role_id>/requirements", methods=["GET"])
def get_role_requirements(role_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT *
        FROM role_requirements
        WHERE role_id = %s
        ORDER BY id
        """,
        (role_id,)
    )

    rows = cursor.fetchall()
    requirements = [row_to_dict(row, cursor) for row in rows]

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "role_id": role_id,
        "requirements": requirements,
        "total": len(requirements)
    })


@role_bp.route("/<role_id>/competencies", methods=["GET"])
def get_role_competencies(role_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT *
        FROM role_requirements
        WHERE role_id = %s
        ORDER BY id
        """,
        (role_id,)
    )

    rows = cursor.fetchall()
    competencies = [row_to_dict(row, cursor) for row in rows]

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "role_id": role_id,
        "competencies": competencies,
        "total": len(competencies)
    })


@role_bp.route("/<role_id>/mandatory-requirements", methods=["GET"])
def get_mandatory_requirements(role_id):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT *
        FROM role_requirements
        WHERE role_id = %s
          AND is_mandatory = TRUE
        ORDER BY id
        """,
        (role_id,)
    )

    rows = cursor.fetchall()
    mandatory_requirements = [
        row_to_dict(row, cursor) for row in rows
    ]

    cursor.close()
    connection.close()

    return jsonify({
        "success": True,
        "role_id": role_id,
        "mandatory_requirements": mandatory_requirements,
        "total": len(mandatory_requirements)
    })


@role_bp.route("/<role_id>/skill-comparison", methods=["GET"])
def get_skill_comparison(role_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    role_rows, user_skills = get_role_and_user_skills(
        role_id,
        user_id
    )

    comparison = []

    for role in role_rows:
        if isinstance(role, dict):
            skill_name = role["skill_name"]
            required_level = role["proficiency_level"]
            is_mandatory = role["is_mandatory"]
        else:
            skill_name = role[0]
            required_level = role[1]
            is_mandatory = role[2]

        user_score = user_skills.get(skill_name.lower())

        comparison.append({
            "skill_name": skill_name,
            "required_proficiency": required_level,
            "user_score": user_score,
            "is_mandatory": is_mandatory,
            "status": "Matched" if user_score is not None else "Missing"
        })

    return jsonify({
        "success": True,
        "user_id": user_id,
        "role_id": role_id,
        "skill_comparison": comparison,
        "total": len(comparison)
    })


@role_bp.route("/<role_id>/matched-skills", methods=["GET"])
def get_matched_skills(role_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    role_rows, user_skills = get_role_and_user_skills(
        role_id,
        user_id
    )

    matched_skills = []

    for role in role_rows:
        if isinstance(role, dict):
            skill_name = role["skill_name"]
            required_level = role["proficiency_level"]
            is_mandatory = role["is_mandatory"]
        else:
            skill_name = role[0]
            required_level = role[1]
            is_mandatory = role[2]

        user_score = user_skills.get(skill_name.lower())

        if user_score is not None:
            matched_skills.append({
                "skill_name": skill_name,
                "required_proficiency": required_level,
                "user_score": user_score,
                "is_mandatory": is_mandatory,
                "status": "Matched"
            })

    return jsonify({
        "success": True,
        "user_id": user_id,
        "role_id": role_id,
        "matched_skills": matched_skills,
        "total": len(matched_skills)
    })


@role_bp.route("/<role_id>/missing-skills", methods=["GET"])
def get_missing_skills(role_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    role_rows, user_skills = get_role_and_user_skills(
        role_id,
        user_id
    )

    missing_skills = []

    for role in role_rows:
        if isinstance(role, dict):
            skill_name = role["skill_name"]
            required_level = role["proficiency_level"]
            is_mandatory = role["is_mandatory"]
        else:
            skill_name = role[0]
            required_level = role[1]
            is_mandatory = role[2]

        if skill_name.lower() not in user_skills:
            missing_skills.append({
                "skill_name": skill_name,
                "required_proficiency": required_level,
                "is_mandatory": is_mandatory,
                "status": "Missing"
            })

    return jsonify({
        "success": True,
        "user_id": user_id,
        "role_id": role_id,
        "missing_skills": missing_skills,
        "total": len(missing_skills)
    })


@role_bp.route("/<role_id>/job-readiness", methods=["GET"])
def get_job_readiness(role_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    role_rows, user_skills = get_role_and_user_skills(
        role_id,
        user_id
    )

    total_requirements = len(role_rows)
    matched_count = 0
    missing_count = 0
    mandatory_total = 0
    mandatory_matched = 0
    mandatory_missing = 0

    matched_skills = []
    missing_skills = []

    for role in role_rows:
        if isinstance(role, dict):
            skill_name = role["skill_name"]
            required_level = role["proficiency_level"]
            is_mandatory = role["is_mandatory"]
        else:
            skill_name = role[0]
            required_level = role[1]
            is_mandatory = role[2]

        user_score = user_skills.get(skill_name.lower())

        if is_mandatory:
            mandatory_total += 1

        if user_score is not None:
            matched_count += 1

            if is_mandatory:
                mandatory_matched += 1

            matched_skills.append({
                "skill_name": skill_name,
                "required_proficiency": required_level,
                "user_score": user_score,
                "is_mandatory": is_mandatory
            })
        else:
            missing_count += 1

            if is_mandatory:
                mandatory_missing += 1

            missing_skills.append({
                "skill_name": skill_name,
                "required_proficiency": required_level,
                "is_mandatory": is_mandatory
            })

    readiness_score = round(
        (matched_count / total_requirements) * 100,
        2
    ) if total_requirements > 0 else 0

    mandatory_check = mandatory_missing == 0
    ready = mandatory_check and readiness_score >= 75

    return jsonify({
        "success": True,
        "user_id": user_id,
        "role_id": role_id,
        "job_readiness": {
            "readiness_score": readiness_score,
            "total_requirements": total_requirements,
            "matched_requirements": matched_count,
            "missing_requirements": missing_count,
            "mandatory_total": mandatory_total,
            "mandatory_matched": mandatory_matched,
            "mandatory_missing": mandatory_missing,
            "mandatory_check": mandatory_check,
            "ready": ready
        },
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    })


@role_bp.route("/<role_id>/match-score", methods=["GET"])
def get_match_score(role_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    role_rows, user_skills = get_role_and_user_skills(
        role_id,
        user_id
    )

    total_requirements = len(role_rows)
    matched_count = 0
    missing_count = 0

    matched_skills = []
    missing_skills = []

    for role in role_rows:
        if isinstance(role, dict):
            skill_name = role["skill_name"]
            required_level = role["proficiency_level"]
            is_mandatory = role["is_mandatory"]
        else:
            skill_name = role[0]
            required_level = role[1]
            is_mandatory = role[2]

        user_score = user_skills.get(skill_name.lower())

        if user_score is not None:
            matched_count += 1

            matched_skills.append({
                "skill_name": skill_name,
                "required_proficiency": required_level,
                "user_score": user_score,
                "is_mandatory": is_mandatory
            })
        else:
            missing_count += 1

            missing_skills.append({
                "skill_name": skill_name,
                "required_proficiency": required_level,
                "is_mandatory": is_mandatory
            })

    match_score = round(
        (matched_count / total_requirements) * 100,
        2
    ) if total_requirements > 0 else 0

    return jsonify({
        "success": True,
        "user_id": user_id,
        "role_id": role_id,
        "match_score": match_score,
        "total_requirements": total_requirements,
        "matched_count": matched_count,
        "missing_count": missing_count,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    })


@role_bp.route("/<role_id>/mandatory-check", methods=["GET"])
def get_mandatory_check(role_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    role_rows, user_skills = get_role_and_user_skills(
        role_id,
        user_id
    )

    mandatory_total = 0
    mandatory_matched = 0
    mandatory_missing = 0

    matched_mandatory_skills = []
    missing_mandatory_skills = []

    for role in role_rows:
        if isinstance(role, dict):
            skill_name = role["skill_name"]
            required_level = role["proficiency_level"]
            is_mandatory = role["is_mandatory"]
        else:
            skill_name = role[0]
            required_level = role[1]
            is_mandatory = role[2]

        if not is_mandatory:
            continue

        mandatory_total += 1

        user_score = user_skills.get(skill_name.lower())

        if user_score is not None:
            mandatory_matched += 1

            matched_mandatory_skills.append({
                "skill_name": skill_name,
                "required_proficiency": required_level,
                "user_score": user_score
            })
        else:
            mandatory_missing += 1

            missing_mandatory_skills.append({
                "skill_name": skill_name,
                "required_proficiency": required_level
            })

    return jsonify({
        "success": True,
        "user_id": user_id,
        "role_id": role_id,
        "mandatory_check": mandatory_missing == 0,
        "mandatory_total": mandatory_total,
        "mandatory_matched": mandatory_matched,
        "mandatory_missing": mandatory_missing,
        "matched_mandatory_skills": matched_mandatory_skills,
        "missing_mandatory_skills": missing_mandatory_skills
    })


@role_bp.route("/<role_id>/skill-gap", methods=["GET"])
def get_skill_gap(role_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    role_rows, user_skills = get_role_and_user_skills(
        role_id,
        user_id
    )

    skill_gap = []

    for role in role_rows:
        if isinstance(role, dict):
            skill_name = role["skill_name"]
            required_level = role["proficiency_level"]
            is_mandatory = role["is_mandatory"]
        else:
            skill_name = role[0]
            required_level = role[1]
            is_mandatory = role[2]

        user_score = user_skills.get(skill_name.lower())

        if user_score is None:
            gap = 100
            status = "Missing"
        else:
            gap = max(0, 100 - float(user_score))
            status = "Matched"

        skill_gap.append({
            "skill_name": skill_name,
            "required_proficiency": required_level,
            "user_score": user_score,
            "is_mandatory": is_mandatory,
            "gap": gap,
            "status": status
        })

    matched_count = sum(
        1 for item in skill_gap
        if item["status"] == "Matched"
    )

    missing_count = sum(
        1 for item in skill_gap
        if item["status"] == "Missing"
    )

    return jsonify({
        "success": True,
        "user_id": user_id,
        "role_id": role_id,
        "skill_gap": skill_gap,
        "matched_count": matched_count,
        "missing_count": missing_count,
        "total": len(skill_gap)
    })


@role_bp.route("/<role_id>/skill-gap-summary", methods=["GET"])
def get_skill_gap_summary(role_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    role_rows, user_skills = get_role_and_user_skills(
        role_id,
        user_id
    )

    total_skills = len(role_rows)
    matched_count = 0
    missing_count = 0
    mandatory_total = 0
    mandatory_matched = 0
    mandatory_missing = 0
    total_gap = 0

    skill_gaps = []

    for role in role_rows:
        if isinstance(role, dict):
            skill_name = role["skill_name"]
            required_level = role["proficiency_level"]
            is_mandatory = role["is_mandatory"]
        else:
            skill_name = role[0]
            required_level = role[1]
            is_mandatory = role[2]

        user_score = user_skills.get(skill_name.lower())

        if is_mandatory:
            mandatory_total += 1

        if user_score is None:
            gap = 100
            status = "Missing"
            missing_count += 1

            if is_mandatory:
                mandatory_missing += 1
        else:
            gap = max(0, 100 - float(user_score))
            status = "Matched"
            matched_count += 1

            if is_mandatory:
                mandatory_matched += 1

        total_gap += gap

        skill_gaps.append({
            "skill_name": skill_name,
            "required_proficiency": required_level,
            "user_score": user_score,
            "is_mandatory": is_mandatory,
            "gap": gap,
            "status": status
        })

    average_gap = round(
        total_gap / total_skills,
        2
    ) if total_skills > 0 else 0

    coverage_percentage = round(
        (matched_count / total_skills) * 100,
        2
    ) if total_skills > 0 else 0

    return jsonify({
        "success": True,
        "user_id": user_id,
        "role_id": role_id,
        "skill_gap_summary": {
            "total_skills": total_skills,
            "matched_count": matched_count,
            "missing_count": missing_count,
            "average_gap": average_gap,
            "coverage_percentage": coverage_percentage,
            "mandatory_total": mandatory_total,
            "mandatory_matched": mandatory_matched,
            "mandatory_missing": mandatory_missing,
            "mandatory_check": mandatory_missing == 0
        },
        "skill_gaps": skill_gaps
    })


@role_bp.route("/<role_id>/learning-priorities", methods=["GET"])
def get_learning_priorities(role_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    role_rows, user_skills = get_role_and_user_skills(
        role_id,
        user_id
    )

    learning_priorities = []

    for role in role_rows:
        if isinstance(role, dict):
            skill_name = role["skill_name"]
            required_level = role["proficiency_level"]
            is_mandatory = role["is_mandatory"]
        else:
            skill_name = role[0]
            required_level = role[1]
            is_mandatory = role[2]

        user_score = user_skills.get(skill_name.lower())

        if user_score is None:
            gap = 100
            status = "Missing"
        else:
            gap = max(0, 100 - float(user_score))
            status = "Matched"

        if status == "Missing":
            priority = "High" if is_mandatory else "Medium"
        elif gap >= 50:
            priority = "High"
        elif gap > 0:
            priority = "Medium"
        else:
            priority = "Low"

        learning_priorities.append({
            "skill_name": skill_name,
            "required_proficiency": required_level,
            "user_score": user_score,
            "skill_gap": gap,
            "is_mandatory": is_mandatory,
            "priority": priority,
            "status": status
        })

    priority_order = {
        "High": 1,
        "Medium": 2,
        "Low": 3
    }

    learning_priorities.sort(
        key=lambda item: (
            priority_order[item["priority"]],
            -item["skill_gap"]
        )
    )

    for index, item in enumerate(
        learning_priorities,
        start=1
    ):
        item["priority_rank"] = index

    return jsonify({
        "success": True,
        "user_id": user_id,
        "role_id": role_id,
        "learning_priorities": learning_priorities,
        "total": len(learning_priorities)
    })


@role_bp.route("/<role_id>/next-best-skill", methods=["GET"])
def get_next_best_skill(role_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    role_rows, user_skills = get_role_and_user_skills(
        role_id,
        user_id
    )

    candidates = []

    for role in role_rows:
        if isinstance(role, dict):
            skill_name = role["skill_name"]
            required_level = role["proficiency_level"]
            is_mandatory = role["is_mandatory"]
        else:
            skill_name = role[0]
            required_level = role[1]
            is_mandatory = role[2]

        user_score = user_skills.get(skill_name.lower())

        if user_score is None:
            gap = 100
            status = "Missing"
        else:
            gap = max(0, 100 - float(user_score))
            status = "Matched"

        if status == "Missing" and is_mandatory:
            priority = "High"
        elif status == "Missing":
            priority = "Medium"
        elif gap > 0:
            priority = "Medium"
        else:
            priority = "Low"

        candidates.append({
            "skill_name": skill_name,
            "required_proficiency": required_level,
            "user_score": user_score,
            "skill_gap": gap,
            "is_mandatory": is_mandatory,
            "priority": priority,
            "status": status
        })

    priority_order = {
        "High": 1,
        "Medium": 2,
        "Low": 3
    }

    candidates.sort(
        key=lambda item: (
            priority_order[item["priority"]],
            -item["skill_gap"]
        )
    )

    return jsonify({
        "success": True,
        "user_id": user_id,
        "role_id": role_id,
        "next_best_skill": candidates[0] if candidates else None
    })


@role_bp.route("/<role_id>/recommended-skills", methods=["GET"])
def get_recommended_skills(role_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    role_rows, user_skills = get_role_and_user_skills(
        role_id,
        user_id
    )

    recommended_skills = []

    for role in role_rows:
        if isinstance(role, dict):
            skill_name = role["skill_name"]
            required_level = role["proficiency_level"]
            is_mandatory = role["is_mandatory"]
        else:
            skill_name = role[0]
            required_level = role[1]
            is_mandatory = role[2]

        user_score = user_skills.get(skill_name.lower())

        if user_score is None:
            gap = 100
            status = "Missing"
        else:
            gap = max(0, 100 - float(user_score))
            status = "Matched"

        if status == "Missing" and is_mandatory:
            priority = "High"
        elif status == "Missing":
            priority = "Medium"
        elif gap > 0:
            priority = "Medium"
        else:
            priority = "Low"

        if status == "Missing" or gap > 0:
            recommended_skills.append({
                "skill_name": skill_name,
                "required_proficiency": required_level,
                "user_score": user_score,
                "skill_gap": gap,
                "is_mandatory": is_mandatory,
                "priority": priority,
                "status": status
            })

    priority_order = {
        "High": 1,
        "Medium": 2,
        "Low": 3
    }

    recommended_skills.sort(
        key=lambda item: (
            priority_order[item["priority"]],
            -item["skill_gap"]
        )
    )

    for index, item in enumerate(
        recommended_skills,
        start=1
    ):
        item["recommendation_rank"] = index

    return jsonify({
        "success": True,
        "user_id": user_id,
        "role_id": role_id,
        "recommended_skills": recommended_skills,
        "total": len(recommended_skills)
    })


@role_bp.route("/<role_id>/roadmap", methods=["GET"])
def get_learning_roadmap(role_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    role_rows, user_skills = get_role_and_user_skills(
        role_id,
        user_id
    )

    roadmap = []

    for role in role_rows:
        if isinstance(role, dict):
            skill_name = role["skill_name"]
            required_level = role["proficiency_level"]
            is_mandatory = role["is_mandatory"]
        else:
            skill_name = role[0]
            required_level = role[1]
            is_mandatory = role[2]

        user_score = user_skills.get(skill_name.lower())

        if user_score is None:
            gap = 100
            status = "Missing"
        else:
            gap = max(0, 100 - float(user_score))
            status = "Matched"

        if status == "Missing" and is_mandatory:
            priority = "High"
        elif status == "Missing":
            priority = "Medium"
        elif gap > 0:
            priority = "Medium"
        else:
            priority = "Low"

        roadmap.append({
            "skill_name": skill_name,
            "required_proficiency": required_level,
            "user_score": user_score,
            "skill_gap": gap,
            "is_mandatory": is_mandatory,
            "priority": priority,
            "status": status
        })

    priority_order = {
        "High": 1,
        "Medium": 2,
        "Low": 3
    }

    roadmap.sort(
        key=lambda item: (
            priority_order[item["priority"]],
            -item["skill_gap"]
        )
    )

    for index, item in enumerate(roadmap, start=1):
        item["step"] = index

    return jsonify({
        "success": True,
        "user_id": user_id,
        "role_id": role_id,
        "roadmap": roadmap,
        "total": len(roadmap)
    })


@role_bp.route("/<role_id>/recommended-path", methods=["GET"])
def get_recommended_path(role_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    role_rows, user_skills = get_role_and_user_skills(
        role_id,
        user_id
    )

    recommended_path = []

    for role in role_rows:
        if isinstance(role, dict):
            skill_name = role["skill_name"]
            required_level = role["proficiency_level"]
            is_mandatory = role["is_mandatory"]
        else:
            skill_name = role[0]
            required_level = role[1]
            is_mandatory = role[2]

        user_score = user_skills.get(skill_name.lower())

        if user_score is None:
            gap = 100
            status = "Missing"
        else:
            gap = max(0, 100 - float(user_score))
            status = "Matched"

        if status == "Missing" and is_mandatory:
            priority = "High"
        elif status == "Missing":
            priority = "Medium"
        elif gap > 0:
            priority = "Medium"
        else:
            priority = "Low"

        # Fully completed skills are not part of the learning path.
        if status == "Matched" and gap == 0:
            continue

        recommended_path.append({
            "skill_name": skill_name,
            "required_proficiency": required_level,
            "user_score": user_score,
            "skill_gap": gap,
            "is_mandatory": is_mandatory,
            "priority": priority,
            "status": status
        })

    priority_order = {
        "High": 1,
        "Medium": 2,
        "Low": 3
    }

    recommended_path.sort(
        key=lambda item: (
            priority_order[item["priority"]],
            -item["skill_gap"]
        )
    )

    for index, item in enumerate(
        recommended_path,
        start=1
    ):
        item["path_step"] = index

    return jsonify({
        "success": True,
        "user_id": user_id,
        "role_id": role_id,
        "recommended_path": recommended_path,
        "total": len(recommended_path)
    })

@role_bp.route("/<role_id>/milestones", methods=["GET"])
def get_milestones(role_id):

    user_id = get_user_id_from_token()

    if not user_id:
        return unauthorized()

    role_rows, user_skills = get_role_and_user_skills(
        role_id,
        user_id
    )

    milestones = []

    for role in role_rows:

        if isinstance(role, dict):
            skill_name = role["skill_name"]
            required_level = role["proficiency_level"]
            is_mandatory = role["is_mandatory"]
        else:
            skill_name = role[0]
            required_level = role[1]
            is_mandatory = role[2]

        user_score = user_skills.get(skill_name.lower())

        if user_score is None:
            gap = 100
            status = "Missing"
        else:
            gap = max(0, 100 - float(user_score))
            status = "Matched"

        if status == "Missing" and is_mandatory:
            priority = "High"
        elif status == "Missing":
            priority = "Medium"
        elif gap > 0:
            priority = "Medium"
        else:
            priority = "Low"

        if gap == 0:
            milestone_status = "Completed"
        elif user_score is not None:
            milestone_status = "In Progress"
        else:
            milestone_status = "Not Started"

        milestones.append({
            "skill_name": skill_name,
            "required_proficiency": required_level,
            "user_score": user_score,
            "skill_gap": gap,
            "is_mandatory": is_mandatory,
            "priority": priority,
            "status": status,
            "milestone_status": milestone_status
        })

    priority_order = {
        "High": 1,
        "Medium": 2,
        "Low": 3
    }

    milestones.sort(
        key=lambda item: (
            priority_order[item["priority"]],
            -item["skill_gap"]
        )
    )

    for index, milestone in enumerate(milestones, start=1):
        milestone["milestone"] = index

    return jsonify({
        "success": True,
        "user_id": user_id,
        "role_id": role_id,
        "milestones": milestones,
        "total": len(milestones)
    })
# ============================================================
# CAREER PROGRESSION
# ============================================================

@role_bp.get("/<role_id>/career-progression")
def get_career_progression(role_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Get current role
        cur.execute(
            """
            SELECT
                role_id,
                role_name,
                engineering_field,
                industry,
                demand_level,
                min_experience,
                employment_type
            FROM roles
            WHERE role_id = %s
            """,
            (role_id,)
        )

        role = cur.fetchone()

        if not role:
            cur.close()
            conn.close()

            return {
                "success": False,
                "message": "Role not found"
            }, 404

        # Get other roles in the same engineering field
        cur.execute(
            """
            SELECT
                role_id,
                role_name,
                demand_level,
                min_experience
            FROM roles
            WHERE engineering_field = %s
              AND role_id != %s
            ORDER BY role_id
            """,
            (role[2], role_id)
        )

        rows = cur.fetchall()

        cur.close()
        conn.close()

        progression = []

        for row in rows:
            progression.append({
                "role_id": row[0],
                "role_name": row[1],
                "demand_level": row[2],
                "min_experience": row[3]
            })

        return {
            "success": True,
            "current_role": {
                "role_id": role[0],
                "role_name": role[1],
                "engineering_field": role[2],
                "industry": role[3],
                "demand_level": role[4],
                "min_experience": role[5],
                "employment_type": role[6]
            },
            "career_progression": progression
        }, 200

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500


# ============================================================
# NEXT ROLES
# ============================================================

@role_bp.get("/<role_id>/next-roles")
def get_next_roles(role_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Get current role
        cur.execute(
            """
            SELECT engineering_field
            FROM roles
            WHERE role_id = %s
            """,
            (role_id,)
        )

        current_role = cur.fetchone()

        if not current_role:
            cur.close()
            conn.close()

            return {
                "success": False,
                "message": "Role not found"
            }, 404

        engineering_field = current_role[0]

        # Get other roles in the same engineering field
        cur.execute(
            """
            SELECT
                role_id,
                role_name,
                demand_level,
                min_experience
            FROM roles
            WHERE engineering_field = %s
              AND role_id != %s
            ORDER BY role_id
            """,
            (engineering_field, role_id)
        )

        rows = cur.fetchall()

        cur.close()
        conn.close()

        next_roles = []

        for row in rows:
            next_roles.append({
                "role_id": row[0],
                "role_name": row[1],
                "demand_level": row[2],
                "min_experience": row[3]
            })

        return {
            "success": True,
            "current_role_id": role_id,
            "next_roles": next_roles
        }, 200

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500


# ============================================================
# CAREER PATHWAYS
# ============================================================

@role_bp.get("/<role_id>/career-pathways")
def get_career_pathways(role_id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Get current role
        cur.execute(
            """
            SELECT
                role_id,
                role_name,
                engineering_field
            FROM roles
            WHERE role_id = %s
            """,
            (role_id,)
        )

        current_role = cur.fetchone()

        if not current_role:
            cur.close()
            conn.close()

            return {
                "success": False,
                "message": "Role not found"
            }, 404

        # Get other roles in same engineering field
        cur.execute(
            """
            SELECT
                role_id,
                role_name,
                demand_level,
                min_experience
            FROM roles
            WHERE engineering_field = %s
              AND role_id != %s
            ORDER BY role_id
            """,
            (current_role[2], role_id)
        )

        rows = cur.fetchall()

        cur.close()
        conn.close()

        pathways = []

        for row in rows:
            pathways.append({
                "from_role": {
                    "role_id": current_role[0],
                    "role_name": current_role[1]
                },
                "to_role": {
                    "role_id": row[0],
                    "role_name": row[1],
                    "demand_level": row[2],
                    "min_experience": row[3]
                }
            })

        return {
            "success": True,
            "current_role": {
                "role_id": current_role[0],
                "role_name": current_role[1]
            },
            "career_pathways": pathways
        }, 200

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500