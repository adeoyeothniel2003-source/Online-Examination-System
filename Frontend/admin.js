
document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // GET LOGIN TOKEN
    // =========================================

    const token =
        localStorage.getItem("token");


    // =========================================
    // CHECK ADMIN LOGIN
    // =========================================

    if (!token) {

        window.location.href =
            "admin-login.html";

        return;
    }


    // =========================================
    // DASHBOARD ELEMENTS
    // =========================================

    const dashboardContent =
        document.getElementById("dashboardContent");

    const manageExamsSection =
        document.getElementById("manageExamsSection");

    const manageQuestionsSection =
        document.getElementById("manageQuestionsSection");

    const studentsSection =
        document.getElementById("studentsSection");

    const examRegistrationSection =
        document.getElementById("examRegistrationSection");

    const resultsSection =
        document.getElementById("resultsSection");


    const dashboardBtn =
        document.getElementById("dashboardBtn");

    const manageExamsBtn =
        document.getElementById("manageExamsBtn");

    const manageQuestionsBtn =
        document.getElementById("manageQuestionsBtn");

    const viewStudentsBtn =
        document.getElementById("viewStudentsBtn");

    const examRegistrationBtn =
        document.getElementById("examRegistrationBtn");

    const viewResultsBtn =
        document.getElementById("viewResultsBtn");


    // =========================================
    // API REQUEST HELPER
    // =========================================

    async function apiRequest(url, options = {}) {

        const requestOptions = {

            ...options,

            headers: {

                ...(options.headers || {}),

                "Authorization":
                    `Bearer ${token}`

            }

        };


        const response =
            await fetch(
                url,
                requestOptions
            );


        let data = {};

        try {

            data =
                await response.json();

        } catch (error) {

            data = {};

        }


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            alert(
                data.message ||
                "You are not authorized to perform this action."
            );

            localStorage.removeItem("token");

            localStorage.removeItem("user");

            window.location.href =
                "admin-login.html";

            throw new Error(
                "Authentication failed"
            );
        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Request failed"
            );
        }


        return data;
    }


    // =========================================
    // SHOW DASHBOARD
    // =========================================

    function showDashboard() {

        dashboardContent.style.display =
            "block";

        manageExamsSection.style.display =
            "none";

        manageQuestionsSection.style.display =
            "none";

        studentsSection.style.display =
            "none";

        examRegistrationSection.style.display =
            "none";

        resultsSection.style.display =
            "none";

    }


    // =========================================
    // LOAD ADMIN INFORMATION
    // =========================================

    async function loadAdminInformation() {

        try {

            const data =
                await apiRequest(
                    "/api/auth/me"
                );


            if (
                !data.user ||
                data.user.role !== "admin"
            ) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                window.location.href =
                    "login.html";

                return;
            }


            const adminName =
                document.getElementById(
                    "adminName"
                );


            if (adminName) {

                adminName.textContent =
                    data.user.name;
            }

        } catch (error) {

            console.error(
                "Admin information error:",
                error
            );
        }
    }


    // =========================================
    // MANAGE EXAMS
    // =========================================

    manageExamsBtn.addEventListener(
        "click",
        async function () {

            dashboardContent.style.display =
                "none";

            manageQuestionsSection.style.display =
                "none";

            studentsSection.style.display =
                "none";

            examRegistrationSection.style.display =
                "none";

            resultsSection.style.display =
                "none";

            manageExamsSection.style.display =
                "block";

            await displayExams();

        }
    );


    // =========================================
    // BACK TO DASHBOARD
    // =========================================

    document
        .getElementById("backToDashboardBtn")
        .addEventListener(
            "click",
            showDashboard
        );


    // =========================================
    // ADD EXAM
    // =========================================

    document
        .getElementById("addExamBtn")
        .addEventListener(
            "click",
            function () {

                document
                    .getElementById(
                        "examFormContainer"
                    )
                    .style.display =
                    "block";


                document
                    .getElementById(
                        "examFormTitle"
                    )
                    .textContent =
                    "Add New Exam";


                document
                    .getElementById(
                        "examForm"
                    )
                    .reset();


                document
                    .getElementById(
                        "examId"
                    )
                    .value =
                    "";

            }
        );


    // =========================================
    // CANCEL EXAM
    // =========================================

    document
        .getElementById("cancelExamBtn")
        .addEventListener(
            "click",
            function () {

                document
                    .getElementById(
                        "examFormContainer"
                    )
                    .style.display =
                    "none";

            }
        );


    // =========================================
    // SAVE EXAM
    // =========================================

    document
        .getElementById("examForm")
        .addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const id =
                    document
                        .getElementById("examId")
                        .value;


                const title =
                    document
                        .getElementById("examTitle")
                        .value
                        .trim();


                const description =
                    document
                        .getElementById(
                            "examDescription"
                        )
                        .value
                        .trim();


                const duration =
                    Number(
                        document
                            .getElementById(
                                "examDuration"
                            )
                            .value
                    );


                if (!title || !duration) {

                    alert(
                        "Exam title and duration are required."
                    );

                    return;
                }


                try {

                    if (id) {

                        await apiRequest(
                            `/api/exams/${id}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        title,
                                        description,
                                        duration_minutes:
                                            duration
                                    })
                            }
                        );


                        alert(
                            "Exam updated successfully."
                        );

                    } else {

                        await apiRequest(
                            "/api/exams",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        title,
                                        description,
                                        duration_minutes:
                                            duration
                                    })
                            }
                        );


                        alert(
                            "Exam added successfully."
                        );
                    }


                    document
                        .getElementById("examForm")
                        .reset();


                    document
                        .getElementById(
                            "examFormContainer"
                        )
                        .style.display =
                        "none";


                    await displayExams();


                } catch (error) {

                    console.error(
                        "Save exam error:",
                        error
                    );

                    alert(
                        error.message
                    );

                }

            }
        );


    // =========================================
    // GET ALL EXAMS
    // =========================================

    async function getExams() {

        const data =
            await apiRequest(
                "/api/exams"
            );

        return data.exams || [];
    }


    // =========================================
    // DISPLAY EXAMS
    // =========================================

    async function displayExams() {

        const tableBody =
            document.getElementById(
                "examTableBody"
            );


        tableBody.innerHTML = "";


        try {

            const exams =
                await getExams();


            if (exams.length === 0) {

                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align:center;">
                            No exams available.
                        </td>
                    </tr>
                `;

                return;
            }


            exams.forEach(
                function (exam) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>
                            ${escapeHTML(
                                exam.title
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                exam.description || ""
                            )}
                        </td>

                        <td>
                            ${exam.duration_minutes}
                            minutes
                        </td>

                        <td>
                            ${escapeHTML(
                                exam.status
                            )}
                        </td>

                        <td>

                            <button
                                class="btn btn-warning"
                                onclick="editExam(${exam.id})"
                            >
                                Edit
                            </button>

                            <button
                                class="btn btn-danger"
                                onclick="deleteExam(${exam.id})"
                            >
                                Delete
                            </button>

                            <button
                                class="btn btn-success"
                                onclick="toggleExamStatus(${exam.id})"
                            >
                                ${
                                    exam.status === "published"
                                    ? "Unpublish"
                                    : "Publish"
                                }
                            </button>

                        </td>

                    `;


                    tableBody.appendChild(
                        row
                    );

                }
            );

        } catch (error) {

            console.error(
                "Display exams error:",
                error
            );

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;">
                        Unable to load exams.
                    </td>
                </tr>
            `;

        }
    }


    // =========================================
    // EDIT EXAM
    // =========================================

    window.editExam = async function (id) {

        try {

            const data =
                await apiRequest(
                    `/api/exams/${id}`
                );


            const exam =
                data.exam;


            document
                .getElementById(
                    "examFormContainer"
                )
                .style.display =
                "block";


            document
                .getElementById(
                    "examFormTitle"
                )
                .textContent =
                "Edit Exam";


            document
                .getElementById(
                    "examId"
                )
                .value =
                exam.id;


            document
                .getElementById(
                    "examTitle"
                )
                .value =
                exam.title;


            document
                .getElementById(
                    "examDescription"
                )
                .value =
                exam.description ||
                "";


            document
                .getElementById(
                    "examDuration"
                )
                .value =
                exam.duration_minutes;

        } catch (error) {

            console.error(
                "Edit exam error:",
                error
            );

            alert(
                error.message
            );

        }
    };


    // =========================================
    // DELETE EXAM
    // =========================================

    window.deleteExam = async function (id) {

        try {

            const data =
                await apiRequest(
                    `/api/exams/${id}`
                );


            const confirmed =
                confirm(
                    `Are you sure you want to delete "${data.exam.title}"?`
                );


            if (!confirmed) {

                return;
            }


            await apiRequest(
                `/api/exams/${id}`,
                {
                    method: "DELETE"
                }
            );


            alert(
                "Exam deleted successfully."
            );


            await displayExams();

        } catch (error) {

            console.error(
                "Delete exam error:",
                error
            );

            alert(
                error.message
            );

        }
    };


    // =========================================
    // PUBLISH / UNPUBLISH EXAM
    // =========================================

    window.toggleExamStatus =
        async function (id) {

            try {

                const data =
                    await apiRequest(
                        `/api/exams/${id}`
                    );


                const newStatus =
                    data.exam.status ===
                    "published"
                    ? "draft"
                    : "published";


                await apiRequest(
                    `/api/exams/${id}/status`,
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                status:
                                    newStatus
                            })
                    }
                );


                alert(
                    newStatus === "published"
                    ? "Exam published successfully."
                    : "Exam unpublished successfully."
                );


                await displayExams();

            } catch (error) {

                console.error(
                    "Update exam status error:",
                    error
                );

                alert(
                    error.message
                );

            }
        };


    // =========================================
    // MANAGE QUESTIONS
    // =========================================

    manageQuestionsBtn.addEventListener(
        "click",
        async function () {

            dashboardContent.style.display =
                "none";

            manageExamsSection.style.display =
                "none";

            studentsSection.style.display =
                "none";

            examRegistrationSection.style.display =
                "none";

            resultsSection.style.display =
                "none";

            manageQuestionsSection.style.display =
                "block";


            await loadQuestionExamDropdown();

        }
    );


    // =========================================
    // BACK FROM QUESTIONS
    // =========================================

    document
        .getElementById("backFromQuestionsBtn")
        .addEventListener(
            "click",
            showDashboard
        );


    // =========================================
    // LOAD EXAMS INTO QUESTION DROPDOWN
    // =========================================

    async function loadQuestionExamDropdown() {

        const select =
            document.getElementById(
                "questionExamSelect"
            );


        select.innerHTML = `
            <option value="">
                Select an exam
            </option>
        `;


        try {

            const exams =
                await getExams();


            exams.forEach(
                function (exam) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        exam.id;


                    option.textContent =
                        exam.title;


                    select.appendChild(
                        option
                    );

                }
            );


            await displayQuestions();

        } catch (error) {

            console.error(
                "Load question exams error:",
                error
            );

            alert(
                error.message
            );

        }
    }


    // =========================================
    // SELECT EXAM FOR QUESTIONS
    // =========================================

    document
        .getElementById(
            "questionExamSelect"
        )
        .addEventListener(
            "change",
            function () {

                displayQuestions();

            }
        );


    // =========================================
    // ADD QUESTION
    // =========================================

    document
        .getElementById(
            "addQuestionBtn"
        )
        .addEventListener(
            "click",
            function () {

                const examId =
                    document
                        .getElementById(
                            "questionExamSelect"
                        )
                        .value;


                if (!examId) {

                    alert(
                        "Please select an exam first."
                    );

                    return;
                }


                document
                    .getElementById(
                        "questionFormContainer"
                    )
                    .style.display =
                    "block";


                document
                    .getElementById(
                        "questionFormTitle"
                    )
                    .textContent =
                    "Add Question";


                document
                    .getElementById(
                        "questionForm"
                    )
                    .reset();


                document
                    .getElementById(
                        "questionId"
                    )
                    .value =
                    "";

            }
        );


    // =========================================
    // CANCEL QUESTION
    // =========================================

    document
        .getElementById(
            "cancelQuestionBtn"
        )
        .addEventListener(
            "click",
            function () {

                document
                    .getElementById(
                        "questionFormContainer"
                    )
                    .style.display =
                    "none";

            }
        );


    // =========================================
    // SAVE QUESTION
    // =========================================

    document
        .getElementById(
            "questionForm"
        )
        .addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const id =
                    document
                        .getElementById(
                            "questionId"
                        )
                        .value;


                const examId =
                    document
                        .getElementById(
                            "questionExamSelect"
                        )
                        .value;


                const questionText =
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


                const correctAnswer =
                    document
                        .getElementById(
                            "correctAnswer"
                        )
                        .value;


                const marks =
                    Number(
                        document
                            .getElementById(
                                "questionMarks"
                            )
                            .value
                    );


                if (
                    !examId ||
                    !questionText ||
                    !optionA ||
                    !optionB ||
                    !optionC ||
                    !optionD ||
                    !correctAnswer
                ) {

                    alert(
                        "Please complete all question fields."
                    );

                    return;
                }


                try {

                    if (id) {

                        await apiRequest(
                            `/api/questions/${id}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        question_text:
                                            questionText,

                                        option_a:
                                            optionA,

                                        option_b:
                                            optionB,

                                        option_c:
                                            optionC,

                                        option_d:
                                            optionD,

                                        is_correct:
                                            correctAnswer,

                                        marks:
                                            marks || 1

                                    })
                            }
                        );


                        alert(
                            "Question updated successfully."
                        );

                    } else {

                        await apiRequest(
                            `/api/questions/exam/${examId}`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        question_text:
                                            questionText,

                                        option_a:
                                            optionA,

                                        option_b:
                                            optionB,

                                        option_c:
                                            optionC,

                                        option_d:
                                            optionD,

                                        is_correct:
                                            correctAnswer,

                                        marks:
                                            marks || 1

                                    })
                            }
                        );


                        alert(
                            "Question added successfully."
                        );
                    }


                    document
                        .getElementById(
                            "questionForm"
                        )
                        .reset();


                    document
                        .getElementById(
                            "questionFormContainer"
                        )
                        .style.display =
                        "none";


                    await displayQuestions();

                } catch (error) {

                    console.error(
                        "Save question error:",
                        error
                    );

                    alert(
                        error.message
                    );

                }

            }
        );


    // =========================================
    // DISPLAY QUESTIONS
    // =========================================

    async function displayQuestions() {

        const tableBody =
            document.getElementById(
                "questionTableBody"
            );


        const examId =
            document.getElementById(
                "questionExamSelect"
            ).value;


        tableBody.innerHTML = "";


        if (!examId) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;">
                        Select an exam to view questions.
                    </td>
                </tr>
            `;

            return;
        }


        try {

            const data =
                await apiRequest(
                    `/api/questions/exam/${examId}`
                );


            const questions =
                data.questions || [];


            if (questions.length === 0) {

                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4" style="text-align:center;">
                            No questions added yet.
                        </td>
                    </tr>
                `;

                return;
            }


            questions.forEach(
                function (question) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>
                            ${escapeHTML(
                                question.question_text
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                question.is_correct ||
                                ""
                            )}
                        </td>

                        <td>
                            ${question.marks}
                        </td>

                        <td>

                            <button
                                class="btn btn-warning"
                                onclick="editQuestion(${question.id})"
                            >
                                Edit
                            </button>

                            <button
                                class="btn btn-danger"
                                onclick="deleteQuestion(${question.id})"
                            >
                                Delete
                            </button>

                        </td>

                    `;


                    tableBody.appendChild(
                        row
                    );

                }
            );

        } catch (error) {

            console.error(
                "Display questions error:",
                error
            );

            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;">
                        Unable to load questions.
                    </td>
                </tr>
            `;

        }
    }


    // =========================================
    // EDIT QUESTION
    // =========================================

    window.editQuestion =
        async function (id) {

            try {

                const data =
                    await apiRequest(
                        `/api/questions/${id}`
                    );


                const question =
                    data.question;


                document
                    .getElementById(
                        "questionFormContainer"
                    )
                    .style.display =
                    "block";


                document
                    .getElementById(
                        "questionFormTitle"
                    )
                    .textContent =
                    "Edit Question";


                document
                    .getElementById(
                        "questionId"
                    )
                    .value =
                    question.id;


                document
                    .getElementById(
                        "questionText"
                    )
                    .value =
                    question.question_text;


                document
                    .getElementById(
                        "optionA"
                    )
                    .value =
                    question.option_a;


                document
                    .getElementById(
                        "optionB"
                    )
                    .value =
                    question.option_b;


                document
                    .getElementById(
                        "optionC"
                    )
                    .value =
                    question.option_c;


                document
                    .getElementById(
                        "optionD"
                    )
                    .value =
                    question.option_d;


                document
                    .getElementById(
                        "correctAnswer"
                    )
                    .value =
                    question.is_correct;


                document
                    .getElementById(
                        "questionMarks"
                    )
                    .value =
                    question.marks;

            } catch (error) {

                console.error(
                    "Edit question error:",
                    error
                );

                alert(
                    error.message
                );

            }
        };


    // =========================================
    // DELETE QUESTION
    // =========================================

    window.deleteQuestion =
        async function (id) {

            const confirmed =
                confirm(
                    "Are you sure you want to delete this question?"
                );


            if (!confirmed) {

                return;
            }


            try {

                await apiRequest(
                    `/api/questions/${id}`,
                    {
                        method: "DELETE"
                    }
                );


                alert(
                    "Question deleted successfully."
                );


                await displayQuestions();

            } catch (error) {

                console.error(
                    "Delete question error:",
                    error
                );

                alert(
                    error.message
                );

            }
        };


    // =========================================
    // STUDENTS
    // =========================================

    viewStudentsBtn.addEventListener(
        "click",
        async function () {

            dashboardContent.style.display =
                "none";

            manageExamsSection.style.display =
                "none";

            manageQuestionsSection.style.display =
                "none";

            examRegistrationSection.style.display =
                "none";

            resultsSection.style.display =
                "none";

            studentsSection.style.display =
                "block";


            await displayStudents();

        }
    );


    // =========================================
    // BACK FROM STUDENTS
    // =========================================

    document
        .getElementById(
            "backFromStudentsBtn"
        )
        .addEventListener(
            "click",
            showDashboard
        );


    // =========================================
    // REGISTER STUDENT
    // =========================================

    document
        .getElementById(
            "registerStudentBtn"
        )
        .addEventListener(
            "click",
            function () {

                document
                    .getElementById(
                        "studentFormContainer"
                    )
                    .style.display =
                    "block";


                document
                    .getElementById(
                        "studentForm"
                    )
                    .reset();

            }
        );


    // =========================================
    // CANCEL STUDENT
    // =========================================

    document
        .getElementById(
            "cancelStudentBtn"
        )
        .addEventListener(
            "click",
            function () {

                document
                    .getElementById(
                        "studentFormContainer"
                    )
                    .style.display =
                    "none";

            }
        );


    // =========================================
    // REGISTER STUDENT
    // =========================================

    document
        .getElementById(
            "studentForm"
        )
        .addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const name =
                    document
                        .getElementById(
                            "studentName"
                        )
                        .value
                        .trim();


                const studentNumber =
                    document
                        .getElementById(
                            "studentNumber"
                        )
                        .value
                        .trim();


                const email =
                    document
                        .getElementById(
                            "studentEmail"
                        )
                        .value
                        .trim();


                const department =
                    document
                        .getElementById(
                            "studentDepartment"
                        )
                        .value
                        .trim();


                const level =
                    document
                        .getElementById(
                            "studentLevel"
                        )
                        .value
                        .trim();


                const passwordElement =
                    document.getElementById(
                        "studentPassword"
                    );


                if (!passwordElement) {

                    alert(
                        "The student password field has not been added to admin.html yet."
                    );

                    return;
                }


                const password =
                    passwordElement.value;


                if (
                    !name ||
                    !studentNumber ||
                    !email ||
                    !department ||
                    !level ||
                    !password
                ) {

                    alert(
                        "Please complete all student information."
                    );

                    return;
                }


                try {

                    const data =
                        await apiRequest(
                            "/api/auth/register-student",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        name,

                                        email,

                                        password,

                                        student_id:
                                            studentNumber,

                                        department,

                                        level

                                    })
                            }
                        );


                    alert(
                        data.message ||
                        "Student registered successfully."
                    );


                    document
                        .getElementById(
                            "studentForm"
                        )
                        .reset();


                    document
                        .getElementById(
                            "studentFormContainer"
                        )
                        .style.display =
                        "none";


                    await displayStudents();


                } catch (error) {

                    console.error(
                        "Register student error:",
                        error
                    );

                    alert(
                        error.message
                    );

                }

            }
        );


    // =========================================
    // DISPLAY STUDENTS
    // =========================================

    async function displayStudents(
        searchTerm = ""
    ) {

        const tableBody =
            document.getElementById(
                "studentsTableBody"
            );


        tableBody.innerHTML = "";


        try {

            const url =
                searchTerm
                ? `/api/students?search=${encodeURIComponent(searchTerm)}`
                : "/api/students";


            const data =
                await apiRequest(
                    url
                );


            const students =
                data.students || [];


            if (students.length === 0) {

                tableBody.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align:center;">
                            No students found.
                        </td>
                    </tr>
                `;

                return;
            }


            students.forEach(
                function (student) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>
                            ${escapeHTML(
                                student.name
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                student.student_id
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                student.email
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                student.department
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                student.level
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                student.status
                            )}
                        </td>

                        <td>

                            <button
                                class="btn btn-danger"
                                onclick="toggleStudentStatus(
                                    ${student.id},
                                    '${student.status}'
                                )"
                            >
                                ${
                                    student.status ===
                                    "active"
                                    ? "Deactivate"
                                    : "Activate"
                                }
                            </button>

                        </td>

                    `;


                    tableBody.appendChild(
                        row
                    );

                }
            );

        } catch (error) {

            console.error(
                "Display students error:",
                error
            );

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;">
                        Unable to load students.
                    </td>
                </tr>
            `;

        }
    }


    // =========================================
    // STUDENT SEARCH
    // =========================================

    document
        .getElementById(
            "studentSearch"
        )
        .addEventListener(
            "input",
            function () {

                displayStudents(
                    this.value
                );

            }
        );


    // =========================================
    // ACTIVATE / DEACTIVATE STUDENT
    // =========================================

    window.toggleStudentStatus =
        async function (
            id,
            currentStatus
        ) {

            const newStatus =
                currentStatus ===
                "active"
                ? "inactive"
                : "active";


            try {

                await apiRequest(
                    `/api/students/${id}/status`,
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                status:
                                    newStatus
                            })
                    }
                );


                alert(
                    newStatus === "active"
                    ? "Student activated successfully."
                    : "Student deactivated successfully."
                );


                await displayStudents(
                    document
                        .getElementById(
                            "studentSearch"
                        )
                        .value
                );

            } catch (error) {

                console.error(
                    "Student status error:",
                    error
                );

                alert(
                    error.message
                );

            }
        };


    // =========================================
    // EXAM REGISTRATION
    // =========================================

    examRegistrationBtn.addEventListener(
        "click",
        async function () {

            dashboardContent.style.display =
                "none";

            manageExamsSection.style.display =
                "none";

            manageQuestionsSection.style.display =
                "none";

            studentsSection.style.display =
                "none";

            resultsSection.style.display =
                "none";

            examRegistrationSection.style.display =
                "block";


            await loadRegistrationStudents();

            await loadRegistrationExams();

            await displayExamAssignments();

        }
    );


    // =========================================
    // BACK FROM REGISTRATION
    // =========================================

    document
        .getElementById(
            "backFromRegistrationBtn"
        )
        .addEventListener(
            "click",
            showDashboard
        );


    // =========================================
    // LOAD STUDENTS FOR REGISTRATION
    // =========================================

    async function loadRegistrationStudents() {

        const select =
            document.getElementById(
                "registrationStudent"
            );


        select.innerHTML = `
            <option value="">
                Select Student
            </option>
        `;


        try {

            const data =
                await apiRequest(
                    "/api/students"
                );


            const students =
                data.students || [];


            students.forEach(
                function (student) {

                    if (
                        student.status !==
                        "active"
                    ) {

                        return;
                    }


                    const option =
                        document.createElement(
                            "option"
                        );


                    // IMPORTANT:
                    // Backend expects the users.id
                    // not the student's visible
                    // student number.

                    option.value =
                        student.id;


                    option.textContent =
                        `${student.name} - ${student.student_id}`;


                    select.appendChild(
                        option
                    );

                }
            );

        } catch (error) {

            console.error(
                "Load registration students error:",
                error
            );

            alert(
                error.message
            );

        }
    }


    // =========================================
    // LOAD EXAMS FOR REGISTRATION
    // =========================================

    async function loadRegistrationExams() {

        const select =
            document.getElementById(
                "registrationExam"
            );


        select.innerHTML = `
            <option value="">
                Select Exam
            </option>
        `;


        try {

            const exams =
                await getExams();


            exams.forEach(
                function (exam) {

                    if (
                        exam.status !==
                        "published"
                    ) {

                        return;
                    }


                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        exam.id;


                    option.textContent =
                        exam.title;


                    select.appendChild(
                        option
                    );

                }
            );

        } catch (error) {

            console.error(
                "Load registration exams error:",
                error
            );

            alert(
                error.message
            );

        }
    }


    // =========================================
    // ASSIGN EXAM
    // =========================================

    document
        .getElementById(
            "examRegistrationForm"
        )
        .addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const studentId =
                    Number(
                        document
                            .getElementById(
                                "registrationStudent"
                            )
                            .value
                    );


                const examId =
                    Number(
                        document
                            .getElementById(
                                "registrationExam"
                            )
                            .value
                    );


                if (
                    !studentId ||
                    !examId
                ) {

                    alert(
                        "Please select a student and an exam."
                    );

                    return;
                }


                try {

                    const data =
                        await apiRequest(
                            "/api/registrations",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        student_id:
                                            studentId,

                                        exam_id:
                                            examId

                                    })
                            }
                        );


                    alert(
                        data.message ||
                        "Student assigned successfully."
                    );


                    document
                        .getElementById(
                            "examRegistrationForm"
                        )
                        .reset();


                    await displayExamAssignments();

                } catch (error) {

                    console.error(
                        "Exam registration error:",
                        error
                    );

                    alert(
                        error.message
                    );

                }

            }
        );


    // =========================================
    // DISPLAY EXAM ASSIGNMENTS
    // =========================================

    async function displayExamAssignments() {

        const tableBody =
            document.getElementById(
                "examAssignmentsTableBody"
            );


        tableBody.innerHTML = "";


        try {

            const data =
                await apiRequest(
                    "/api/registrations"
                );


            const registrations =
                data.registrations || [];


            if (
                registrations.length === 0
            ) {

                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align:center;">
                            No exam assignments yet.
                        </td>
                    </tr>
                `;

                return;
            }


            registrations.forEach(
                function (
                    registration
                ) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>
                            ${escapeHTML(
                                registration.student_name
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                registration.student_number
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                registration.exam_title
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                registration.status
                            )}
                        </td>

                        <td>

                            <button
                                class="btn btn-danger"
                                onclick="removeExamAssignment(
                                    ${registration.id}
                                )"
                            >
                                Remove
                            </button>

                        </td>

                    `;


                    tableBody.appendChild(
                        row
                    );

                }
            );

        } catch (error) {

            console.error(
                "Display assignments error:",
                error
            );

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;">
                        Unable to load assignments.
                    </td>
                </tr>
            `;

        }
    }


    // =========================================
    // REMOVE EXAM ASSIGNMENT
    // =========================================

    window.removeExamAssignment =
        async function (id) {

            const confirmed =
                confirm(
                    "Are you sure you want to remove this exam assignment?"
                );


            if (!confirmed) {

                return;
            }


            try {

                await apiRequest(
                    `/api/registrations/${id}`,
                    {
                        method: "DELETE"
                    }
                );


                alert(
                    "Student removed from exam successfully."
                );


                await displayExamAssignments();

            } catch (error) {

                console.error(
                    "Remove assignment error:",
                    error
                );

                alert(
                    error.message
                );

            }
        };


    // =========================================
    // RESULTS
    // =========================================

    viewResultsBtn.addEventListener(
        "click",
        async function () {

            dashboardContent.style.display =
                "none";

            manageExamsSection.style.display =
                "none";

            manageQuestionsSection.style.display =
                "none";

            studentsSection.style.display =
                "none";

            examRegistrationSection.style.display =
                "none";

            resultsSection.style.display =
                "block";


            await displayResults();

        }
    );


    // =========================================
    // BACK FROM RESULTS
    // =========================================

    document
        .getElementById(
            "backFromResultsBtn"
        )
        .addEventListener(
            "click",
            showDashboard
        );


    // =========================================
    // DISPLAY RESULTS
    // =========================================

    async function displayResults(
        searchTerm = ""
    ) {

        const tableBody =
            document.getElementById(
                "resultsTableBody"
            );


        tableBody.innerHTML = "";


        try {

            const data =
                await apiRequest(
                    "/api/results"
                );


            const results =
                data.results || [];


            const search =
                searchTerm.toLowerCase();


            const filteredResults =
                results.filter(
                    function (result) {

                        return (

                            result.student_name
                                .toLowerCase()
                                .includes(
                                    search
                                )

                            ||

                            result.student_id
                                .toLowerCase()
                                .includes(
                                    search
                                )

                            ||

                            result.exam_title
                                .toLowerCase()
                                .includes(
                                    search
                                )

                        );

                    }
                );


            if (
                filteredResults.length === 0
            ) {

                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align:center;">
                            No results found.
                        </td>
                    </tr>
                `;

                return;
            }


            filteredResults.forEach(
                function (result) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>
                            ${escapeHTML(
                                result.student_name
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                result.student_id
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                result.exam_title
                            )}
                        </td>

                        <td>
                            ${result.score}
                            /
                            ${result.total_marks}
                        </td>

                        <td>
                            ${result.percentage}%
                        </td>

                        <td>
                            ${escapeHTML(
                                result.status
                            )}
                        </td>

                    `;


                    tableBody.appendChild(
                        row
                    );

                }
            );

        } catch (error) {

            console.error(
                "Display results error:",
                error
            );

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">
                        Unable to load results.
                    </td>
                </tr>
            `;

        }
    }


    // =========================================
    // RESULT SEARCH
    // =========================================

    document
        .getElementById(
            "resultSearch"
        )
        .addEventListener(
            "input",
            function () {

                displayResults(
                    this.value
                );

            }
        );


    // =========================================
    // DISPLAY RECENT RESULTS
    // =========================================

    async function displayRecentResults() {

        const tableBody =
            document.getElementById(
                "recentResultsBody"
            );


        tableBody.innerHTML = "";


        try {

            const data =
                await apiRequest(
                    "/api/results"
                );


            const results =
                data.results || [];


            const recentResults =
                results.slice(
                    0,
                    5
                );


            if (
                recentResults.length === 0
            ) {

                tableBody.innerHTML = `
                    <tr>
                        <td colspan="4" style="text-align:center;">
                            No results yet.
                        </td>
                    </tr>
                `;

                return;
            }


            recentResults.forEach(
                function (result) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>
                            ${escapeHTML(
                                result.student_name
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                result.exam_title
                            )}
                        </td>

                        <td>
                            ${result.score}
                            /
                            ${result.total_marks}
                        </td>

                        <td>
                            ${escapeHTML(
                                result.status
                            )}
                        </td>

                    `;


                    tableBody.appendChild(
                        row
                    );

                }
            );

        } catch (error) {

            console.error(
                "Recent results error:",
                error
            );

        }
    }


    // =========================================
    // DASHBOARD BUTTON
    // =========================================

    dashboardBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showDashboard();

        }
    );


    // =========================================
    // LOGOUT
    // =========================================

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            async function (event) {

                event.preventDefault();


                const confirmed =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (!confirmed) {

                    return;
                }


                try {

                    await apiRequest(
                        "/api/auth/logout",
                        {
                            method: "POST"
                        }
                    );

                } catch (error) {

                    console.error(
                        "Logout error:",
                        error
                    );

                }


                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );


                window.location.href =
                    "admin-login.html";

            }
        );

    }


    // =========================================
    // ESCAPE HTML
    // =========================================

    function escapeHTML(value) {

        return String(
            value ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    // =========================================
    // INITIAL LOAD
    // =========================================

    loadAdminInformation();

    displayRecentResults();

    showDashboard();

});

