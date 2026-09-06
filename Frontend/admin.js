document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // DASHBOARD ELEMENTS
    // ==========================================

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



    // ==========================================
    // TEMPORARY EXAM DATA
    // ==========================================

    let exams = [
        {
            id: 1,
            title: "Mathematics Examination",
            description: "Basic Mathematics Examination",
            duration: 30,
            status: "Published"
        },

        {
            id: 2,
            title: "SEN 214 Examination",
            description: "Software Engineering Examination",
            duration: 45,
            status: "Draft"
        }
    ];



    // ==========================================
    // TEMPORARY QUESTION DATA
    // ==========================================

    let questions = [
        {
            id: 1,
            examId: 1,
            question: "What is 2 + 2?",
            optionA: "3",
            optionB: "4",
            optionC: "5",
            optionD: "6",
            correctAnswer: "B",
            marks: 1
        }
    ];



    // ==========================================
    // TEMPORARY STUDENT DATA
    // ==========================================

    let students = [
        {
            id: 1,
            name: "Adeoye Othniel",
            studentNumber: "OAU/SE/001",
            email: "adeoye@example.com",
            department: "Software Engineering",
            level: "400",
            status: "Active"
        },

        {
            id: 2,
            name: "Aaliyah James",
            studentNumber: "OAU/SE/002",
            email: "aaliyah@example.com",
            department: "Computer Science",
            level: "300",
            status: "Active"
        },

        {
            id: 3,
            name: "David John",
            studentNumber: "OAU/SE/003",
            email: "david@example.com",
            department: "Software Engineering",
            level: "400",
            status: "Active"
        }
    ];



    // ==========================================
    // TEMPORARY RESULT DATA
    // ==========================================

    let results = [
        {
            studentName: "Adeoye Othniel",
            studentNumber: "OAU/SE/001",
            exam: "Mathematics Examination",
            score: 18,
            percentage: 90,
            status: "Pass"
        },

        {
            studentName: "Aaliyah James",
            studentNumber: "OAU/SE/002",
            exam: "SEN 214 Examination",
            score: 12,
            percentage: 60,
            status: "Pass"
        }
    ];



    // ==========================================
    // EXAM ASSIGNMENTS
    // ==========================================

    let examAssignments = [];



    // ==========================================
    // GENERATE IDs
    // ==========================================

    let nextExamId = 3;
    let nextQuestionId = 2;
    let nextStudentId = 4;



    // ==========================================
    // SHOW DASHBOARD
    // ==========================================

    function showDashboard() {

        dashboardContent.style.display = "block";

        manageExamsSection.style.display = "none";

        manageQuestionsSection.style.display = "none";

        studentsSection.style.display = "none";

        examRegistrationSection.style.display = "none";

        resultsSection.style.display = "none";
    }



    // ==========================================
    // MANAGE EXAMS SECTION
    // ==========================================

    manageExamsBtn.addEventListener("click", function () {

        dashboardContent.style.display = "none";

        manageQuestionsSection.style.display = "none";

        studentsSection.style.display = "none";

        examRegistrationSection.style.display = "none";

        resultsSection.style.display = "none";

        manageExamsSection.style.display = "block";

        displayExams();
    });



    // BACK TO DASHBOARD

    document
        .getElementById("backToDashboardBtn")
        .addEventListener("click", showDashboard);



    // ADD EXAM

    document
        .getElementById("addExamBtn")
        .addEventListener("click", function () {

            document
                .getElementById("examFormContainer")
                .style.display = "block";

            document
                .getElementById("examFormTitle")
                .textContent = "Add New Exam";

            document
                .getElementById("examForm")
                .reset();

            document
                .getElementById("examId")
                .value = "";
        });



    // CANCEL EXAM

    document
        .getElementById("cancelExamBtn")
        .addEventListener("click", function () {

            document
                .getElementById("examFormContainer")
                .style.display = "none";
        });



    // SAVE EXAM

    document
        .getElementById("examForm")
        .addEventListener("submit", function (event) {

            event.preventDefault();

            const id =
                document.getElementById("examId").value;

            const title =
                document.getElementById("examTitle").value;

            const description =
                document.getElementById("examDescription").value;

            const duration =
                document.getElementById("examDuration").value;



            if (id) {

                const exam = exams.find(
                    function (item) {
                        return item.id === Number(id);
                    }
                );

                exam.title = title;
                exam.description = description;
                exam.duration = duration;

                alert("Exam updated successfully.");

            } else {

                exams.push({

                    id: nextExamId++,

                    title: title,

                    description: description,

                    duration: Number(duration),

                    status: "Draft"

                });

                alert("Exam added successfully.");
            }


            document
                .getElementById("examForm")
                .reset();

            document
                .getElementById("examFormContainer")
                .style.display = "none";

            displayExams();
        });



    // DISPLAY EXAMS

    function displayExams() {

        const tableBody =
            document.getElementById("examTableBody");

        tableBody.innerHTML = "";



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



        exams.forEach(function (exam) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(exam.title)}
                </td>

                <td>
                    ${escapeHTML(exam.description)}
                </td>

                <td>
                    ${exam.duration} minutes
                </td>

                <td>
                    ${escapeHTML(exam.status)}
                </td>

                <td>

                    <button
                        class="btn btn-warning"
                        onclick="editExam(${exam.id})">

                        Edit

                    </button>

                    <button
                        class="btn btn-danger"
                        onclick="deleteExam(${exam.id})">

                        Delete

                    </button>

                    <button
                        class="btn btn-success"
                        onclick="toggleExamStatus(${exam.id})">

                        ${exam.status === "Published"
                            ? "Unpublish"
                            : "Publish"}

                    </button>

                </td>
            `;


            tableBody.appendChild(row);
        });
    }



    // EDIT EXAM

    window.editExam = function (id) {

        const exam =
            exams.find(function (item) {
                return item.id === id;
            });


        if (!exam) {
            return;
        }


        document
            .getElementById("examFormContainer")
            .style.display = "block";


        document
            .getElementById("examFormTitle")
            .textContent = "Edit Exam";


        document
            .getElementById("examId")
            .value = exam.id;


        document
            .getElementById("examTitle")
            .value = exam.title;


        document
            .getElementById("examDescription")
            .value = exam.description;


        document
            .getElementById("examDuration")
            .value = exam.duration;
    };



    // DELETE EXAM

    window.deleteExam = function (id) {

        const exam =
            exams.find(function (item) {
                return item.id === id;
            });


        if (!exam) {
            return;
        }


        const confirmed =
            confirm(
                `Are you sure you want to delete "${exam.title}"?`
            );


        if (!confirmed) {
            return;
        }


        exams =
            exams.filter(function (item) {
                return item.id !== id;
            });


        questions =
            questions.filter(function (item) {
                return item.examId !== id;
            });


        examAssignments =
            examAssignments.filter(function (item) {
                return item.examId !== id;
            });


        displayExams();


        alert("Exam deleted successfully.");
    };



    // PUBLISH / UNPUBLISH EXAM

    window.toggleExamStatus = function (id) {

        const exam =
            exams.find(function (item) {
                return item.id === id;
            });


        if (!exam) {
            return;
        }


        if (exam.status === "Published") {

            exam.status = "Draft";

        } else {

            exam.status = "Published";
        }


        displayExams();
    };



    // ==========================================
    // MANAGE QUESTIONS
    // ==========================================

    manageQuestionsBtn.addEventListener(
        "click",
        function () {

            dashboardContent.style.display = "none";

            manageExamsSection.style.display = "none";

            studentsSection.style.display = "none";

            examRegistrationSection.style.display = "none";

            resultsSection.style.display = "none";

            manageQuestionsSection.style.display = "block";

            loadQuestionExamDropdown();

            displayQuestions();
        }
    );



    // BACK

    document
        .getElementById("backFromQuestionsBtn")
        .addEventListener("click", showDashboard);



    // LOAD EXAMS

    function loadQuestionExamDropdown() {

        const select =
            document.getElementById("questionExamSelect");


        select.innerHTML = `
            <option value="">
                Select an exam
            </option>
        `;


        exams.forEach(function (exam) {

            const option =
                document.createElement("option");

            option.value = exam.id;

            option.textContent = exam.title;

            select.appendChild(option);
        });
    }



    // SELECT EXAM

    document
        .getElementById("questionExamSelect")
        .addEventListener("change", function () {

            displayQuestions();
        });



    // ADD QUESTION

    document
        .getElementById("addQuestionBtn")
        .addEventListener("click", function () {

            const examId =
                document.getElementById("questionExamSelect").value;


            if (!examId) {

                alert("Please select an exam first.");

                return;
            }


            document
                .getElementById("questionFormContainer")
                .style.display = "block";


            document
                .getElementById("questionFormTitle")
                .textContent = "Add Question";


            document
                .getElementById("questionForm")
                .reset();


            document
                .getElementById("questionId")
                .value = "";
        });



    // CANCEL QUESTION

    document
        .getElementById("cancelQuestionBtn")
        .addEventListener("click", function () {

            document
                .getElementById("questionFormContainer")
                .style.display = "none";
        });



    // SAVE QUESTION

    document
        .getElementById("questionForm")
        .addEventListener("submit", function (event) {

            event.preventDefault();


            const id =
                document.getElementById("questionId").value;


            const examId =
                Number(
                    document.getElementById("questionExamSelect").value
                );


            const question =
                document.getElementById("questionText").value;


            const optionA =
                document.getElementById("optionA").value;


            const optionB =
                document.getElementById("optionB").value;


            const optionC =
                document.getElementById("optionC").value;


            const optionD =
                document.getElementById("optionD").value;


            const correctAnswer =
                document.getElementById("correctAnswer").value;


            const marks =
                Number(
                    document.getElementById("questionMarks").value
                );



            if (id) {

                const existingQuestion =
                    questions.find(function (item) {
                        return item.id === Number(id);
                    });


                existingQuestion.question = question;

                existingQuestion.optionA = optionA;

                existingQuestion.optionB = optionB;

                existingQuestion.optionC = optionC;

                existingQuestion.optionD = optionD;

                existingQuestion.correctAnswer =
                    correctAnswer;

                existingQuestion.marks = marks;


                alert("Question updated successfully.");

            } else {

                questions.push({

                    id: nextQuestionId++,

                    examId: examId,

                    question: question,

                    optionA: optionA,

                    optionB: optionB,

                    optionC: optionC,

                    optionD: optionD,

                    correctAnswer: correctAnswer,

                    marks: marks
                });


                alert("Question added successfully.");
            }


            document
                .getElementById("questionForm")
                .reset();


            document
                .getElementById("questionFormContainer")
                .style.display = "none";


            displayQuestions();
        });



    // DISPLAY QUESTIONS

    function displayQuestions() {

        const tableBody =
            document.getElementById("questionTableBody");


        const examId =
            Number(
                document.getElementById("questionExamSelect").value
            );


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


        const examQuestions =
            questions.filter(function (question) {

                return question.examId === examId;

            });


        if (examQuestions.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;">
                        No questions added yet.
                    </td>
                </tr>
            `;

            return;
        }



        examQuestions.forEach(function (question) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(question.question)}
                </td>

                <td>
                    ${escapeHTML(question.correctAnswer)}
                </td>

                <td>
                    ${question.marks}
                </td>

                <td>

                    <button
                        class="btn btn-warning"
                        onclick="editQuestion(${question.id})">

                        Edit

                    </button>

                    <button
                        class="btn btn-danger"
                        onclick="deleteQuestion(${question.id})">

                        Delete

                    </button>

                </td>
            `;


            tableBody.appendChild(row);
        });
    }



    // EDIT QUESTION

    window.editQuestion = function (id) {

        const question =
            questions.find(function (item) {
                return item.id === id;
            });


        if (!question) {
            return;
        }


        document
            .getElementById("questionFormContainer")
            .style.display = "block";


        document
            .getElementById("questionFormTitle")
            .textContent = "Edit Question";


        document
            .getElementById("questionId")
            .value = question.id;


        document
            .getElementById("questionText")
            .value = question.question;


        document
            .getElementById("optionA")
            .value = question.optionA;


        document
            .getElementById("optionB")
            .value = question.optionB;


        document
            .getElementById("optionC")
            .value = question.optionC;


        document
            .getElementById("optionD")
            .value = question.optionD;


        document
            .getElementById("correctAnswer")
            .value = question.correctAnswer;


        document
            .getElementById("questionMarks")
            .value = question.marks;
    };



    // DELETE QUESTION

    window.deleteQuestion = function (id) {

        const confirmed =
            confirm("Are you sure you want to delete this question?");


        if (!confirmed) {
            return;
        }


        questions =
            questions.filter(function (item) {
                return item.id !== id;
            });


        displayQuestions();

        alert("Question deleted successfully.");
    };



    // ==========================================
    // STUDENTS
    // ==========================================

    viewStudentsBtn.addEventListener(
        "click",
        function () {

            dashboardContent.style.display = "none";

            manageExamsSection.style.display = "none";

            manageQuestionsSection.style.display = "none";

            examRegistrationSection.style.display = "none";

            resultsSection.style.display = "none";

            studentsSection.style.display = "block";

            displayStudents();
        }
    );



    // BACK

    document
        .getElementById("backFromStudentsBtn")
        .addEventListener("click", showDashboard);



    // REGISTER STUDENT

    document
        .getElementById("registerStudentBtn")
        .addEventListener("click", function () {

            document
                .getElementById("studentFormContainer")
                .style.display = "block";

            document
                .getElementById("studentForm")
                .reset();
        });



    // CANCEL STUDENT

    document
        .getElementById("cancelStudentBtn")
        .addEventListener("click", function () {

            document
                .getElementById("studentFormContainer")
                .style.display = "none";
        });



    // SAVE STUDENT

    document
        .getElementById("studentForm")
        .addEventListener("submit", function (event) {

            event.preventDefault();


            const name =
                document.getElementById("studentName").value;


            const studentNumber =
                document.getElementById("studentNumber").value;


            const email =
                document.getElementById("studentEmail").value;


            const department =
                document.getElementById("studentDepartment").value;


            const level =
                document.getElementById("studentLevel").value;



            students.push({

                id: nextStudentId++,

                name: name,

                studentNumber: studentNumber,

                email: email,

                department: department,

                level: level,

                status: "Active"

            });


            alert(
                `${name} has been registered successfully.`
            );


            document
                .getElementById("studentForm")
                .reset();


            document
                .getElementById("studentFormContainer")
                .style.display = "none";


            displayStudents();
        });



    // DISPLAY STUDENTS

    function displayStudents(searchTerm = "") {

        const tableBody =
            document.getElementById("studentsTableBody");


        tableBody.innerHTML = "";


        const filteredStudents =
            students.filter(function (student) {

                const search =
                    searchTerm.toLowerCase();


                return (

                    student.name.toLowerCase().includes(search)

                    ||

                    student.studentNumber
                        .toLowerCase()
                        .includes(search)

                    ||

                    student.email
                        .toLowerCase()
                        .includes(search)

                    ||

                    student.department
                        .toLowerCase()
                        .includes(search)

                );

            });



        if (filteredStudents.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;">
                        No students found.
                    </td>
                </tr>
            `;

            return;
        }



        filteredStudents.forEach(function (student) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(student.name)}
                </td>

                <td>
                    ${escapeHTML(student.studentNumber)}
                </td>

                <td>
                    ${escapeHTML(student.email)}
                </td>

                <td>
                    ${escapeHTML(student.department)}
                </td>

                <td>
                    ${escapeHTML(student.level)}
                </td>

                <td>
                    ${escapeHTML(student.status)}
                </td>

                <td>

                    <button
                        class="btn btn-danger"
                        onclick="deactivateStudent(${student.id})">

                        ${student.status === "Active"
                            ? "Deactivate"
                            : "Activate"}

                    </button>

                </td>
            `;


            tableBody.appendChild(row);
        });
    }



    // STUDENT SEARCH

    document
        .getElementById("studentSearch")
        .addEventListener("input", function () {

            displayStudents(this.value);
        });



    // ACTIVATE / DEACTIVATE

    window.deactivateStudent = function (id) {

        const student =
            students.find(function (item) {
                return item.id === id;
            });


        if (!student) {
            return;
        }


        if (student.status === "Active") {

            student.status = "Inactive";

        } else {

            student.status = "Active";
        }


        displayStudents(
            document.getElementById("studentSearch").value
        );
    };



    // ==========================================
    // EXAM REGISTRATION
    // ==========================================

    examRegistrationBtn.addEventListener(
        "click",
        function () {

            dashboardContent.style.display = "none";

            manageExamsSection.style.display = "none";

            manageQuestionsSection.style.display = "none";

            studentsSection.style.display = "none";

            resultsSection.style.display = "none";

            examRegistrationSection.style.display = "block";


            loadRegistrationStudents();

            loadRegistrationExams();

            displayExamAssignments();
        }
    );



    // BACK

    document
        .getElementById("backFromRegistrationBtn")
        .addEventListener("click", showDashboard);



    // LOAD STUDENTS

    function loadRegistrationStudents() {

        const select =
            document.getElementById("registrationStudent");


        select.innerHTML = `
            <option value="">
                Select Student
            </option>
        `;


        students.forEach(function (student) {

            if (student.status !== "Active") {
                return;
            }


            const option =
                document.createElement("option");


            option.value = student.id;


            option.textContent =
                `${student.name} - ${student.studentNumber}`;


            select.appendChild(option);
        });
    }



    // LOAD EXAMS

    function loadRegistrationExams() {

        const select =
            document.getElementById("registrationExam");


        select.innerHTML = `
            <option value="">
                Select Exam
            </option>
        `;


        exams.forEach(function (exam) {

            if (exam.status !== "Published") {
                return;
            }


            const option =
                document.createElement("option");


            option.value = exam.id;


            option.textContent = exam.title;


            select.appendChild(option);
        });
    }



    // ASSIGN EXAM

    document
        .getElementById("examRegistrationForm")
        .addEventListener("submit", function (event) {

            event.preventDefault();


            const studentId =
                Number(
                    document.getElementById(
                        "registrationStudent"
                    ).value
                );


            const examId =
                Number(
                    document.getElementById(
                        "registrationExam"
                    ).value
                );



            const student =
                students.find(function (item) {

                    return item.id === studentId;

                });



            const exam =
                exams.find(function (item) {

                    return item.id === examId;

                });



            if (!student || !exam) {

                alert(
                    "Please select a student and an exam."
                );

                return;
            }



            const alreadyAssigned =
                examAssignments.some(function (assignment) {

                    return (

                        assignment.studentId === studentId

                        &&

                        assignment.examId === examId

                    );

                });



            if (alreadyAssigned) {

                alert(
                    "This student has already been assigned to this exam."
                );

                return;
            }



            examAssignments.push({

                studentId: student.id,

                studentName: student.name,

                studentNumber: student.studentNumber,

                examId: exam.id,

                examTitle: exam.title,

                status: "Assigned"

            });



            alert(
                `${student.name} has been assigned to ${exam.title}.`
            );


            document
                .getElementById("examRegistrationForm")
                .reset();


            displayExamAssignments();
        });



    // DISPLAY ASSIGNMENTS

    function displayExamAssignments() {

        const tableBody =
            document.getElementById(
                "examAssignmentsTableBody"
            );


        tableBody.innerHTML = "";



        if (examAssignments.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;">
                        No exam assignments yet.
                    </td>
                </tr>
            `;

            return;
        }



        examAssignments.forEach(
            function (assignment, index) {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${escapeHTML(
                            assignment.studentName
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            assignment.studentNumber
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            assignment.examTitle
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            assignment.status
                        )}
                    </td>

                    <td>

                        <button
                            class="btn btn-danger"
                            onclick="removeExamAssignment(${index})">

                            Remove

                        </button>

                    </td>
                `;


                tableBody.appendChild(row);
            }
        );
    }



    // REMOVE ASSIGNMENT

    window.removeExamAssignment = function (index) {

        const assignment =
            examAssignments[index];


        if (!assignment) {
            return;
        }


        const confirmed =
            confirm(
                `Remove ${assignment.examTitle} from ${assignment.studentName}?`
            );


        if (!confirmed) {
            return;
        }


        examAssignments.splice(index, 1);


        displayExamAssignments();
    };



    // ==========================================
    // RESULTS
    // ==========================================

    viewResultsBtn.addEventListener(
        "click",
        function () {

            dashboardContent.style.display = "none";

            manageExamsSection.style.display = "none";

            manageQuestionsSection.style.display = "none";

            studentsSection.style.display = "none";

            examRegistrationSection.style.display = "none";

            resultsSection.style.display = "block";

            displayResults();
        }
    );



    // BACK

    document
        .getElementById("backFromResultsBtn")
        .addEventListener("click", showDashboard);



    // DISPLAY RESULTS

    function displayResults(searchTerm = "") {

        const tableBody =
            document.getElementById("resultsTableBody");


        tableBody.innerHTML = "";


        const filteredResults =
            results.filter(function (result) {

                const search =
                    searchTerm.toLowerCase();


                return (

                    result.studentName
                        .toLowerCase()
                        .includes(search)

                    ||

                    result.studentNumber
                        .toLowerCase()
                        .includes(search)

                    ||

                    result.exam
                        .toLowerCase()
                        .includes(search)

                );

            });



        if (filteredResults.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">
                        No results found.
                    </td>
                </tr>
            `;

            return;
        }



        filteredResults.forEach(function (result) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(result.studentName)}
                </td>

                <td>
                    ${escapeHTML(result.studentNumber)}
                </td>

                <td>
                    ${escapeHTML(result.exam)}
                </td>

                <td>
                    ${result.score}
                </td>

                <td>
                    ${result.percentage}%
                </td>

                <td>
                    ${escapeHTML(result.status)}
                </td>

            `;


            tableBody.appendChild(row);
        });
    }



    // RESULT SEARCH

    document
        .getElementById("resultSearch")
        .addEventListener("input", function () {

            displayResults(this.value);
        });



    // ==========================================
    // RECENT RESULTS
    // ==========================================

    function displayRecentResults() {

        const tableBody =
            document.getElementById("recentResultsBody");


        tableBody.innerHTML = "";


        results.slice(0, 5).forEach(
            function (result) {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${escapeHTML(
                            result.studentName
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            result.exam
                        )}
                    </td>

                    <td>
                        ${result.score}
                    </td>

                    <td>
                        ${escapeHTML(
                            result.status
                        )}
                    </td>

                `;


                tableBody.appendChild(row);
            }
        );
    }



    // ==========================================
    // DASHBOARD BUTTON
    // ==========================================

    dashboardBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showDashboard();
        }
    );



    // ==========================================
    // LOGOUT
    // ==========================================

    const logoutBtn =
        document.getElementById("logoutBtn");


    logoutBtn.addEventListener(
        "click",
        function (event) {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {

                event.preventDefault();
            }
        }
    );



    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }



    // ==========================================
    // INITIAL LOAD
    // ==========================================

    displayRecentResults();

    showDashboard();

});
