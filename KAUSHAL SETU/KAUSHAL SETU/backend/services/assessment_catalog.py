"""Assessment catalog: question banks with server-side answer keys.

Questions never reach the client with their answers attached; the
submit endpoint grades submissions here on the server.
"""

ASSESSMENT_CATALOG = {
    "asmt-01": {
        "id": "asmt-01",
        "title": "Power Systems & Circuit Analysis",
        "discipline": "Electrical Engineering",
        "duration": "30 mins",
        "level": "Intermediate",
        "primarySkill": "Power Systems",
        "skillsCovered": [
            "Power Systems",
            "Circuit Design",
            "Electrical Machines",
        ],
        "questions": [
            {
                "id": 1,
                "skill": "Power Systems",
                "question": "In a three-phase distribution network, which transformer configuration provides a stable neutral point for single-phase loads while isolating harmonic currents?",
                "options": [
                    "Delta - Delta",
                    "Delta - Star with grounded neutral",
                    "Star - Star ungrounded",
                    "Open Delta (V - V)",
                ],
                "correctAnswer": 1,
                "explanation": "Delta-Star with grounded neutral provides a neutral wire for single-phase loads while the delta primary traps triplen harmonics.",
            },
            {
                "id": 2,
                "skill": "Circuit Design",
                "question": "A 230 V single-phase load draws 10 A at 0.8 lagging power factor. What is the real power consumed?",
                "options": ["1.84 kW", "2.30 kW", "1.60 kW", "2.88 kW"],
                "correctAnswer": 0,
                "explanation": "P = V x I x cos(phi) = 230 x 10 x 0.8 = 1840 W = 1.84 kW.",
            },
            {
                "id": 3,
                "skill": "Electrical Machines",
                "question": "Which loss in a transformer remains constant regardless of the load?",
                "options": [
                    "Copper loss",
                    "Eddy current loss in windings",
                    "Core (iron) loss",
                    "Stray load loss",
                ],
                "correctAnswer": 2,
                "explanation": "Core loss depends on voltage and frequency, which stay constant, so it is present even at no load.",
            },
            {
                "id": 4,
                "skill": "Power Systems",
                "question": "Per-unit impedance of a transformer does NOT change when which quantity changes?",
                "options": [
                    "Base MVA of the system",
                    "Winding connections",
                    "Voltage base on either side",
                    "Frequency of the supply",
                ],
                "correctAnswer": 1,
                "explanation": "Per-unit impedance is independent of the winding connection; it only changes with the chosen base quantities.",
            },
            {
                "id": 5,
                "skill": "Circuit Design",
                "question": "In an RLC series circuit at resonance, the power factor is:",
                "options": ["0.5 lagging", "Unity", "0.707 lagging", "Zero"],
                "correctAnswer": 1,
                "explanation": "At resonance inductive and capacitive reactances cancel, leaving a purely resistive circuit with unity power factor.",
            },
        ],
    },
    "asmt-02": {
        "id": "asmt-02",
        "title": "PLC Programming & Industrial Automation",
        "discipline": "Electrical & Instrumentation",
        "duration": "40 mins",
        "level": "Advanced",
        "primarySkill": "PLC Programming",
        "skillsCovered": [
            "PLC Programming",
            "SCADA",
            "Embedded Systems",
        ],
        "questions": [
            {
                "id": 1,
                "skill": "PLC Programming",
                "question": "Which control algorithm is primarily used in PLC ladder logic for precise temperature and motor velocity regulation?",
                "options": [
                    "Bang-bang on/off controller",
                    "Proportional-Integral-Derivative (PID) loop",
                    "Open-loop relay sequencing",
                    "Feed-forward static attenuator",
                ],
                "correctAnswer": 1,
                "explanation": "PID loops dynamically compute error and apply proportional, integral and derivative corrections for stable control.",
            },
            {
                "id": 2,
                "skill": "SCADA",
                "question": "In a SCADA architecture, which component collects field data from remote terminal units and passes it to the master station?",
                "options": [
                    "HMI server",
                    "Historian database",
                    "Communication front-end processor",
                    "Safety instrumented system",
                ],
                "correctAnswer": 2,
                "explanation": "The front-end processor (or communication processor) polls RTUs and mediates the link to the master station.",
            },
            {
                "id": 3,
                "skill": "PLC Programming",
                "question": "A scan cycle of a PLC consists of which sequence of operations?",
                "options": [
                    "Read inputs, execute logic, write outputs",
                    "Write outputs, read inputs, execute logic",
                    "Execute logic, read inputs, write outputs",
                    "Read inputs, write outputs, execute logic",
                ],
                "correctAnswer": 0,
                "explanation": "The standard scan is input read, logic solve, then output write, repeated continuously.",
            },
            {
                "id": 4,
                "skill": "Embedded Systems",
                "question": "Which industrial bus uses a differential pair and supports up to 1 Mbit/s over 40 m, making it common in factory sensor networks?",
                "options": [
                    "RS-232",
                    "CAN",
                    "I2C",
                    "SPI",
                ],
                "correctAnswer": 1,
                "explanation": "CAN is a differential, multi-master bus rated up to 1 Mbit/s over short distances and is robust in electrically noisy plants.",
            },
            {
                "id": 5,
                "skill": "SCADA",
                "question": "The Modbus protocol communicates primarily using which model?",
                "options": [
                    "Producer-consumer multicast",
                    "Master-slave request/response",
                    "Token passing ring",
                    "Publish-subscribe broker",
                ],
                "correctAnswer": 1,
                "explanation": "Modbus is master-slave: the master issues requests and slaves respond; there is no broker or token.",
            },
        ],
    },
    "asmt-03": {
        "id": "asmt-03",
        "title": "AutoCAD & Technical Engineering Drafting",
        "discipline": "Civil & Mechanical",
        "duration": "35 mins",
        "level": "Intermediate",
        "primarySkill": "AutoCAD",
        "skillsCovered": [
            "AutoCAD",
            "Geometric Dimensioning",
            "3D Modeling",
        ],
        "questions": [
            {
                "id": 1,
                "skill": "AutoCAD",
                "question": "Which AutoCAD command creates parallel copies of a line or polyline at a specified distance?",
                "options": ["ARRAY", "OFFSET", "MIRROR", "FILLET"],
                "correctAnswer": 1,
                "explanation": "OFFSET creates a parallel copy at a set distance from the original object.",
            },
            {
                "id": 2,
                "skill": "Geometric Dimensioning",
                "question": "In GD&T, what does a datum feature symbol establish?",
                "options": [
                    "The tightest tolerance in the drawing",
                    "A theoretical reference feature for measurements",
                    "The surface finish requirement",
                    "A welding specification",
                ],
                "correctAnswer": 1,
                "explanation": "Datum features are the theoretical reference points, axes or planes from which measurements are taken.",
            },
            {
                "id": 3,
                "skill": "3D Modeling",
                "question": "Which 3D modeling method builds parts by combining primitive solids with boolean operations?",
                "options": [
                    "NURBS surface modeling",
                    "Constructive solid geometry",
                    "Wireframe modeling",
                    "Point-cloud modeling",
                ],
                "correctAnswer": 1,
                "explanation": "Constructive solid geometry (CSG) unions, subtracts and intersects primitives to form solids.",
            },
            {
                "id": 4,
                "skill": "AutoCAD",
                "question": "What is the primary purpose of using layers in a technical drawing?",
                "options": [
                    "To increase file compression",
                    "To organize objects by function and control visibility",
                    "To convert 2D views into 3D",
                    "To lock the drawing scale",
                ],
                "correctAnswer": 1,
                "explanation": "Layers group objects by role (dimensions, hatch, centerlines) so visibility, color and linetype can be controlled per layer.",
            },
            {
                "id": 5,
                "skill": "Geometric Dimensioning",
                "question": "A dimension of 50 +/- 0.2 mm defines which total tolerance band?",
                "options": ["0.1 mm", "0.2 mm", "0.4 mm", "0.5 mm"],
                "correctAnswer": 2,
                "explanation": "The band spans 49.8 to 50.2 mm, a total width of 0.4 mm.",
            },
        ],
    },
    "asmt-04": {
        "id": "asmt-04",
        "title": "Full-Stack Architecture & RESTful APIs",
        "discipline": "Computer Science & IT",
        "duration": "45 mins",
        "level": "Advanced",
        "primarySkill": "Python",
        "skillsCovered": [
            "Python",
            "Flask",
            "React",
            "SQL Databases",
        ],
        "questions": [
            {
                "id": 1,
                "skill": "Flask",
                "question": "In Flask, which decorator registers a function to run before every request?",
                "options": [
                    "@app.route",
                    "@app.before_request",
                    "@app.teardown_appcontext",
                    "@app.errorhandler",
                ],
                "correctAnswer": 1,
                "explanation": "before_request hooks run before each request and are commonly used for auth and context setup.",
            },
            {
                "id": 2,
                "skill": "SQL Databases",
                "question": "Which SQL clause filters rows AFTER grouping has been applied?",
                "options": ["WHERE", "HAVING", "ORDER BY", "DISTINCT"],
                "correctAnswer": 1,
                "explanation": "WHERE filters before grouping; HAVING filters aggregate results after GROUP BY.",
            },
            {
                "id": 3,
                "skill": "React",
                "question": "In React, what happens when state is updated with a new object reference?",
                "options": [
                    "Nothing, React ignores object updates",
                    "The component re-renders",
                    "The DOM is replaced entirely",
                    "All sibling components unmount",
                ],
                "correctAnswer": 1,
                "explanation": "React compares references; a new state object triggers a re-render of the component tree from that node.",
            },
            {
                "id": 4,
                "skill": "Python",
                "question": "What is the main security purpose of hashing passwords with Werkzeug's generate_password_hash?",
                "options": [
                    "To compress the password for storage",
                    "To make the password irreversible and salted before storage",
                    "To encrypt the password so it can be decrypted later",
                    "To shorten the password to 64 characters",
                ],
                "correctAnswer": 1,
                "explanation": "Password hashes are one-way and salted; plaintext is never stored and cannot be recovered.",
            },
            {
                "id": 5,
                "skill": "Flask",
                "question": "Which HTTP status code should a REST API return when a POST creates a new resource?",
                "options": ["200", "201", "204", "302"],
                "correctAnswer": 1,
                "explanation": "201 Created indicates the request succeeded and a new resource was created.",
            },
        ],
    },
}


def get_assessment_meta(assessment_id: str):
    """Return the full catalog entry for an assessment, or None."""
    return ASSESSMENT_CATALOG.get(assessment_id)


def get_assessment_list():
    """Return catalog metadata without questions (for listings)."""
    items = []

    for meta in ASSESSMENT_CATALOG.values():
        item = {key: value for key, value in meta.items() if key != "questions"}
        items.append(item)

    return items
