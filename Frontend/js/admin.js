/* =================================
   ADMIN CMS JAVASCRIPT
================================= */


/* =================================
   DATA
================================= */

let exams =
    JSON.parse(
        localStorage.getItem("exams")
    ) || [

        {
            id: 1,

            name: "PHYS 102 Examination",

            subject: "General Physics II",

            duration: 60,

            questions: 20,

            status: "Active"
        },

        {
            id: 2,

            name: "SEN 106 Examination",

            subject: "Web Technologies",

            duration: 45,

            questions: 15,

            status: "Active"
        }

    ];


let questions =
    JSON.parse(
        localStorage.getItem("questions")
    ) || [];


let students =
    JSON.parse(
        localStorage.getItem("students")
    ) || [

        {
            id: "STU001",

            name: "John Doe",

            email: "john@example.com",

            status: "Active"
        },

        {
            id: "STU002",

            name: "Jane Smith",

            email: "jane@example.com",

            status: "Active"
        },

        {
            id: "STU003",

            name: "Michael Brown",

            email: "michael@example.com",

            status: "Active"
        }

    ];


let results =
    JSON.parse(
        localStorage.getItem("results")
    ) || [

        {
            student: "John Doe",

            exam: "PHYS 102 Examination",

            score: "17/20",

            percentage: "85%",

            date: "2026-09-04"
        },

        {
            student: "Jane Smith",

            exam: "SEN 106 Examination",

            score: "12/15",

            percentage: "80%",

            date: "2026-09-04"
        }

    ];


/* =================================
   SAVE DATA
================================= */

function saveData() {

    localStorage.setItem(
        "exams",
        JSON.stringify(exams)
    );


    localStorage.setItem(
        "questions",
        JSON.stringify(questions)
    );


    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );


    localStorage.setItem(
        "results",
        JSON.stringify(results)
    );

}


/* =================================
   DASHBOARD
================================= */

function loadDashboard() {

    const totalExams =
        document.getElementById(
            "totalExams"
        );


    const totalQuestions =
        document.getElementById(
            "totalQuestions"
        );


    const totalStudents =
        document.getElementById(
            "totalStudents"
        );


    const totalResults =
        document.getElementById(
            "totalResults"
        );


    if (totalExams) {

        totalExams.textContent =
            exams.length;

    }


    if (totalQuestions) {

        totalQuestions.textContent =
            questions.length;

    }


    if (totalStudents) {

        totalStudents.textContent =
            students.length;

    }


    if (totalResults) {

        totalResults.textContent =
            results.length;

    }

}


/* =================================
   EXAMS
================================= */

function loadExams() {

    const table =
        document.getElementById(
            "examTableBody"
        );


    if (!table) {

        return;

    }


    table.innerHTML = "";


    if (exams.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-message"
                >
                    No examinations available.
                </td>

            </tr>

        `;

        return;

    }


    exams.forEach(function(exam) {

        table.innerHTML += `

            <tr>

                <td>
                    ${exam.name}
                </td>

                <td>
                    ${exam.subject}
                </td>

                <td>
                    ${exam.duration} minutes
                </td>

                <td>
                    ${exam.questions}
                </td>

                <td>

                    <span
                        class="status status-active"
                    >
                        ${exam.status}
                    </span>

                </td>

                <td>

                    <button
                        class="btn btn-delete"
                        onclick="deleteExam(${exam.id})"
                    >
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });

}


function addExam(event) {

    event.preventDefault();


    const name =
        document
            .getElementById("examName")
            .value
            .trim();


    const subject =
        document
            .getElementById("examSubject")
            .value
            .trim();


    const duration =
        document
            .getElementById("examDuration")
            .value;


    const numberOfQuestions =
        document
            .getElementById("examQuestions")
            .value;


    const newExam = {

        id: Date.now(),

        name: name,

        subject: subject,

        duration: duration,

        questions: numberOfQuestions,

        status: "Active"

    };


    exams.push(newExam);


    saveData();


    document
        .getElementById("examForm")
        .reset();


    loadExams();


    loadDashboard();


    alert(
        "Examination added successfully."
    );

}


function deleteExam(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this examination?"
        );


    if (!confirmDelete) {

        return;

    }


    exams =
        exams.filter(
            function(exam) {

                return exam.id !== id;

            }
        );


    saveData();


    loadExams();


    loadExamOptions();


    loadDashboard();

}


/* =================================
   QUESTIONS
================================= */

function loadExamOptions() {

    const select =
        document.getElementById(
            "questionExam"
        );


    if (!select) {

        return;

    }


    select.innerHTML = `

        <option value="">
            Select Examination
        </option>

    `;


    exams.forEach(function(exam) {

        select.innerHTML += `

            <option value="${exam.name}">
                ${exam.name}
            </option>

        `;

    });

}


function loadQuestions() {

    const table =
        document.getElementById(
            "questionTableBody"
        );


    if (!table) {

        return;

    }


    table.innerHTML = "";


    if (questions.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty-message"
                >
                    No questions available.
                </td>

            </tr>

        `;

        return;

    }


    questions.forEach(
        function(question) {

            table.innerHTML += `

                <tr>

                    <td>
                        ${question.exam}
                    </td>

                    <td>
                        ${question.text}
                    </td>

                    <td>
                        ${question.correct}
                    </td>

                    <td>

                        <button
                            class="btn btn-delete"
                            onclick="deleteQuestion(${question.id})"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        }
    );

}


function addQuestion(event) {

    event.preventDefault();


    const exam =
        document
            .getElementById(
                "questionExam"
            )
            .value;


    const text =
        document
            .getElementById(
                "questionText"
            )
            .value
            .trim();


    const optionA =
        document
            .getElementById(
                "optionA"
            )
            .value
            .trim();


    const optionB =
        document
            .getElementById(
                "optionB"
            )
            .value
            .trim();


    const optionC =
        document
            .getElementById(
                "optionC"
            )
            .value
            .trim();


    const optionD =
        document
            .getElementById(
                "optionD"
            )
            .value
            .trim();


    const correct =
        document
            .getElementById(
                "correctAnswer"
            )
            .value;


    const newQuestion = {

        id: Date.now(),

        exam: exam,

        text: text,

        optionA: optionA,

        optionB: optionB,

        optionC: optionC,

        optionD: optionD,

        correct: correct

    };


    questions.push(newQuestion);


    saveData();


    document
        .getElementById(
            "questionForm"
        )
        .reset();


    loadQuestions();


    loadDashboard();


    alert(
        "Question added successfully."
    );

}


function deleteQuestion(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this question?"
        );


    if (!confirmDelete) {

        return;

    }


    questions =
        questions.filter(
            function(question) {

                return question.id !== id;

            }
        );


    saveData();


    loadQuestions();


    loadDashboard();

}


/* =================================
   STUDENTS
================================= */

function loadStudents() {

    const table =
        document.getElementById(
            "studentTableBody"
        );


    if (!table) {

        return;

    }


    displayStudents(students);

}


function displayStudents(studentList) {

    const table =
        document.getElementById(
            "studentTableBody"
        );


    table.innerHTML = "";


    if (studentList.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-message"
                >
                    No students found.
                </td>

            </tr>

        `;

        return;

    }


    studentList.forEach(
        function(student) {

            table.innerHTML += `

                <tr>

                    <td>
                        ${student.id}
                    </td>

                    <td>
                        ${student.name}
                    </td>

                    <td>
                        ${student.email}
                    </td>

                    <td>

                        <span
                            class="status status-active"
                        >
                            ${student.status}
                        </span>

                    </td>

                    <td>

                        <button
                            class="btn btn-delete"
                            onclick="deleteStudent('${student.id}')"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        }
    );

}


function searchStudents() {

    const search =
        document
            .getElementById(
                "studentSearch"
            )
            .value
            .toLowerCase();


    const filtered =
        students.filter(
            function(student) {

                return (

                    student.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    student.email
                        .toLowerCase()
                        .includes(search)

                    ||

                    student.id
                        .toLowerCase()
                        .includes(search)

                );

            }
        );


    displayStudents(filtered);

}


function deleteStudent(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmDelete) {

        return;

    }


    students =
        students.filter(
            function(student) {

                return student.id !== id;

            }
        );


    saveData();


    loadStudents();


    loadDashboard();

}


/* =================================
   RESULTS
================================= */

function loadResults() {

    const table =
        document.getElementById(
            "resultTableBody"
        );


    if (!table) {

        return;

    }


    displayResults(results);

}


function displayResults(resultList) {

    const table =
        document.getElementById(
            "resultTableBody"
        );


    table.innerHTML = "";


    if (resultList.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-message"
                >
                    No results found.
                </td>

            </tr>

        `;

        return;

    }


    resultList.forEach(
        function(result, index) {

            table.innerHTML += `

                <tr>

                    <td>
                        ${result.student}
                    </td>

                    <td>
                        ${result.exam}
                    </td>

                    <td>
                        ${result.score}
                    </td>

                    <td>
                        ${result.percentage}
                    </td>

                    <td>
                        ${result.date}
                    </td>

                    <td>

                        <button
                            class="btn btn-delete"
                            onclick="deleteResult(${index})"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        }
    );

}


function searchResults() {

    const search =
        document
            .getElementById(
                "resultSearch"
            )
            .value
            .toLowerCase();


    const filtered =
        results.filter(
            function(result) {

                return (

                    result.student
                        .toLowerCase()
                        .includes(search)

                    ||

                    result.exam
                        .toLowerCase()
                        .includes(search)

                );

            }
        );


    displayResults(filtered);

}


function deleteResult(index) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this result?"
        );


    if (!confirmDelete) {

        return;

    }


    results.splice(index, 1);


    saveData();


    loadResults();


    loadDashboard();

}


/* =================================
   PAGE LOADING
================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {


        loadDashboard();


        loadExams();


        loadExamOptions();


        loadQuestions();


        loadStudents();


        loadResults();


        /* Exam form */

        const examForm =
            document.getElementById(
                "examForm"
            );


        if (examForm) {

            examForm.addEventListener(
                "submit",
                addExam
            );

        }


        /* Question form */

        const questionForm =
            document.getElementById(
                "questionForm"
            );


        if (questionForm) {

            questionForm.addEventListener(
                "submit",
                addQuestion
            );

        }


        /* Student search */

        const studentSearch =
            document.getElementById(
                "studentSearch"
            );


        if (studentSearch) {

            studentSearch.addEventListener(
                "input",
                searchStudents
            );

        }


        /* Result search */

        const resultSearch =
            document.getElementById(
                "resultSearch"
            );


        if (resultSearch) {

            resultSearch.addEventListener(
                "input",
                searchResults
            );

        }

    }
)