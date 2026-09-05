document.addEventListener("DOMContentLoaded", function () {


    // ==========================================
    // DASHBOARD ELEMENTS
    // ==========================================

    const dashboardContent =
        document.getElementById("dashboardContent");

    const dashboardCards =
        document.querySelector(".admin-grid");

    const recentResultsSection =
        document.getElementById("recentResultsSection");

    const recentResultsBody =
        document.getElementById("recentResultsBody");


    const dashboardNavBtn =
        document.getElementById("dashboardNavBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");


    const manageExamsBtn =
        document.getElementById("manageExamsBtn");

    const manageQuestionsBtn =
        document.getElementById("manageQuestionsBtn");

    const viewStudentsBtn =
        document.getElementById("viewStudentsBtn");

    const viewResultsBtn =
        document.getElementById("viewResultsBtn");



    // ==========================================
    // SECTIONS
    // ==========================================

    const manageExamsSection =
        document.getElementById("manageExamsSection");

    const manageQuestionsSection =
        document.getElementById("manageQuestionsSection");

    const studentsSection =
        document.getElementById("studentsSection");

    const resultsSection =
        document.getElementById("resultsSection");



    // ==========================================
    // MANAGE EXAMS ELEMENTS
    // ==========================================

    const backToDashboardBtn =
        document.getElementById("backToDashboardBtn");

    const addExamBtn =
        document.getElementById("addExamBtn");

    const cancelExamBtn =
        document.getElementById("cancelExamBtn");

    const examFormContainer =
        document.getElementById("examFormContainer");

    const examForm =
        document.getElementById("examForm");

    const examTableBody =
        document.getElementById("examTableBody");



    // ==========================================
    // MANAGE QUESTIONS ELEMENTS
    // ==========================================

    const backFromQuestionsBtn =
        document.getElementById("backFromQuestionsBtn");

    const addQuestionBtn =
        document.getElementById("addQuestionBtn");

    const cancelQuestionBtn =
        document.getElementById("cancelQuestionBtn");

    const questionFormContainer =
        document.getElementById("questionFormContainer");

    const questionForm =
        document.getElementById("questionForm");

    const questionExamSelect =
        document.getElementById("questionExamSelect");

    const questionTableBody =
        document.getElementById("questionTableBody");



    // ==========================================
    // STUDENT ELEMENTS
    // ==========================================

    const backFromStudentsBtn =
        document.getElementById("backFromStudentsBtn");

    const studentSearch =
        document.getElementById("studentSearch");

    const studentsTableBody =
        document.getElementById("studentsTableBody");



    // ==========================================
    // RESULT ELEMENTS
    // ==========================================

    const backFromResultsBtn =
        document.getElementById("backFromResultsBtn");

    const resultSearch =
        document.getElementById("resultSearch");

    const resultsTableBody =
        document.getElementById("resultsTableBody");



    // ==========================================
    // TEMPORARY FRONTEND DATA
    // ==========================================

    let exams = [];

    let questions = [];


    let students = [

        {
            id: "STU001",
            name: "Example Student",
            email: "student1@example.com",
            status: "Active"
        },

        {
            id: "STU002",
            name: "Example Student 2",
            email: "student2@example.com",
            status: "Active"
        },

        {
            id: "STU003",
            name: "Example Student 3",
            email: "student3@example.com",
            status: "Active"
        }

    ];


    let results = [

        {
            student: "Example Student",
            exam: "Computer Science",
            score: "45/50",
            percentage: 90,
            status: "Pass"
        },

        {
            student: "Example Student 2",
            exam: "Mathematics",
            score: "32/50",
            percentage: 64,
            status: "Pass"
        },

        {
            student: "Example Student 3",
            exam: "English",
            score: "21/50",
            percentage: 42,
            status: "Fail"
        }

    ];



    // ==========================================
    // SECTION NAVIGATION
    // ==========================================

    function hideAllSections() {

        dashboardContent.style.display = "none";

        manageExamsSection.style.display = "none";

        manageQuestionsSection.style.display = "none";

        studentsSection.style.display = "none";

        resultsSection.style.display = "none";

    }



    function showDashboard() {

        hideAllSections();

        dashboardContent.style.display = "block";

        displayRecentResults();

    }



    function showManageExams() {

        hideAllSections();

        manageExamsSection.style.display = "block";

        displayExams();

    }



    function showManageQuestions() {

        hideAllSections();

        manageQuestionsSection.style.display = "block";

        loadExamOptions();

    }



    function showStudents() {

        hideAllSections();

        studentsSection.style.display = "block";

        displayStudents();

    }



    function showResults() {

        hideAllSections();

        resultsSection.style.display = "block";

        displayResults();

    }



    // ==========================================
    // DASHBOARD NAVIGATION
    // ==========================================

    dashboardNavBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showDashboard();

        }
    );



    manageExamsBtn.addEventListener(
        "click",
        function () {

            showManageExams();

        }
    );



    manageQuestionsBtn.addEventListener(
        "click",
        function () {

            showManageQuestions();

        }
    );



    viewStudentsBtn.addEventListener(
        "click",
        function () {

            showStudents();

        }
    );



    viewResultsBtn.addEventListener(
        "click",
        function () {

            showResults();

        }
    );



    // ==========================================
    // LOGOUT
    // ==========================================

    logoutBtn.addEventListener(
        "click",
        function () {

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
    // MANAGE EXAMS
    // ==========================================

    backToDashboardBtn.addEventListener(
        "click",
        function () {

            showDashboard();

        }
    );



    addExamBtn.addEventListener(
        "click",
        function () {

            examForm.reset();

            document.getElementById("examId").value = "";

            document.getElementById(
                "examFormTitle"
            ).textContent =
                "Add New Exam";


            examFormContainer.style.display =
                "block";

        }
    );



    cancelExamBtn.addEventListener(
        "click",
        function () {

            examForm.reset();

            examFormContainer.style.display =
                "none";

        }
    );



    // ==========================================
    // SAVE EXAM
    // ==========================================

    examForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const title =
                document
                    .getElementById("examTitle")
                    .value
                    .trim();


            const description =
                document
                    .getElementById("examDescription")
                    .value
                    .trim();


            const duration =
                document
                    .getElementById("examDuration")
                    .value;


            const examId =
                document
                    .getElementById("examId")
                    .value;



            if (examId === "") {


                const newExam = {

                    id: Date.now(),

                    title: title,

                    description: description,

                    duration: duration,

                    status: "Draft"

                };


                exams.push(newExam);

            }


            else {


                const exam =
                    exams.find(
                        function (item) {

                            return item.id == examId;

                        }
                    );


                if (exam) {

                    exam.title = title;

                    exam.description =
                        description;

                    exam.duration =
                        duration;

                }

            }


            examForm.reset();

            examFormContainer.style.display =
                "none";


            displayExams();

        }
    );



    // ==========================================
    // DISPLAY EXAMS
    // ==========================================

    function displayExams() {

        examTableBody.innerHTML = "";


        if (exams.length === 0) {

            examTableBody.innerHTML = `

                <tr>

                    <td colspan="4">

                        No examinations added yet.

                    </td>

                </tr>

            `;

            return;

        }



        exams.forEach(
            function (exam) {


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>

                        <strong>
                            ${escapeHTML(exam.title)}
                        </strong>

                        <br>

                        <small>
                            ${escapeHTML(exam.description)}
                        </small>

                    </td>


                    <td>
                        ${exam.duration} minutes
                    </td>


                    <td>
                        ${exam.status}
                    </td>


                    <td>

                        <button
                            type="button"
                            class="btn btn-warning edit-exam"
                            data-id="${exam.id}">

                            Edit

                        </button>


                        <button
                            type="button"
                            class="btn btn-success toggle-exam"
                            data-id="${exam.id}">

                            ${
                                exam.status === "Draft"
                                    ? "Publish"
                                    : "Unpublish"
                            }

                        </button>


                        <button
                            type="button"
                            class="btn btn-danger delete-exam"
                            data-id="${exam.id}">

                            Delete

                        </button>

                    </td>

                `;


                examTableBody.appendChild(row);

            }
        );


        attachExamActions();

    }



    // ==========================================
    // EXAM ACTIONS
    // ==========================================

    function attachExamActions() {


        document
            .querySelectorAll(".edit-exam")
            .forEach(
                function (button) {


                    button.addEventListener(
                        "click",
                        function () {


                            const id =
                                this.dataset.id;


                            const exam =
                                exams.find(
                                    function (item) {

                                        return item.id == id;

                                    }
                                );


                            if (!exam) return;


                            document
                                .getElementById("examId")
                                .value =
                                exam.id;


                            document
                                .getElementById("examTitle")
                                .value =
                                exam.title;


                            document
                                .getElementById("examDescription")
                                .value =
                                exam.description;


                            document
                                .getElementById("examDuration")
                                .value =
                                exam.duration;


                            document
                                .getElementById("examFormTitle")
                                .textContent =
                                "Edit Exam";


                            examFormContainer.style.display =
                                "block";

                        }
                    );

                }
            );



        document
            .querySelectorAll(".toggle-exam")
            .forEach(
                function (button) {


                    button.addEventListener(
                        "click",
                        function () {


                            const id =
                                this.dataset.id;


                            const exam =
                                exams.find(
                                    function (item) {

                                        return item.id == id;

                                    }
                                );


                            if (!exam) return;


                            exam.status =
                                exam.status === "Draft"
                                    ? "Published"
                                    : "Draft";


                            displayExams();

                        }
                    );

                }
            );



        document
            .querySelectorAll(".delete-exam")
            .forEach(
                function (button) {


                    button.addEventListener(
                        "click",
                        function () {


                            const id =
                                this.dataset.id;


                            const confirmDelete =
                                confirm(
                                    "Are you sure you want to delete this exam?"
                                );


                            if (!confirmDelete) return;


                            exams =
                                exams.filter(
                                    function (exam) {

                                        return exam.id != id;

                                    }
                                );


                            questions =
                                questions.filter(
                                    function (question) {

                                        return question.examId != id;

                                    }
                                );


                            displayExams();

                        }
                    );

                }
            );

    }



    // ==========================================
    // MANAGE QUESTIONS
    // ==========================================

    backFromQuestionsBtn.addEventListener(
        "click",
        function () {

            showDashboard();

        }
    );



    function loadExamOptions() {

        questionExamSelect.innerHTML = `

            <option value="">
                -- Select an Examination --
            </option>

        `;


        exams.forEach(
            function (exam) {


                const option =
                    document.createElement("option");


                option.value =
                    exam.id;


                option.textContent =
                    exam.title;


                questionExamSelect.appendChild(
                    option
                );

            }
        );


        displayQuestions();

    }



    questionExamSelect.addEventListener(
        "change",
        function () {

            displayQuestions();

        }
    );



    addQuestionBtn.addEventListener(
        "click",
        function () {


            if (
                questionExamSelect.value === ""
            ) {

                alert(
                    "Please select an examination first."
                );

                return;

            }


            questionForm.reset();


            document
                .getElementById("questionId")
                .value = "";


            document
                .getElementById("questionMarks")
                .value = "1";


            document
                .getElementById("questionFormTitle")
                .textContent =
                "Add New Question";


            questionFormContainer.style.display =
                "block";

        }
    );



    cancelQuestionBtn.addEventListener(
        "click",
        function () {

            questionForm.reset();

            questionFormContainer.style.display =
                "none";

        }
    );



    // ==========================================
    // SAVE QUESTION
    // ==========================================

    questionForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const selectedExam =
                questionExamSelect.value;


            if (selectedExam === "") {

                alert(
                    "Please select an examination."
                );

                return;

            }


            const questionId =
                document
                    .getElementById("questionId")
                    .value;


            const questionData = {

                id:
                    questionId === ""
                        ? Date.now()
                        : Number(questionId),

                examId:
                    selectedExam,

                question:
                    document
                        .getElementById("questionText")
                        .value
                        .trim(),

                optionA:
                    document
                        .getElementById("optionA")
                        .value
                        .trim(),

                optionB:
                    document
                        .getElementById("optionB")
                        .value
                        .trim(),

                optionC:
                    document
                        .getElementById("optionC")
                        .value
                        .trim(),

                optionD:
                    document
                        .getElementById("optionD")
                        .value
                        .trim(),

                correctAnswer:
                    document
                        .getElementById("correctAnswer")
                        .value,

                marks:
                    document
                        .getElementById("questionMarks")
                        .value

            };



            if (questionId === "") {

                questions.push(questionData);

            }


            else {

                const existingQuestion =
                    questions.find(
                        function (question) {

                            return question.id == questionId;

                        }
                    );


                if (existingQuestion) {

                    existingQuestion.question =
                        questionData.question;

                    existingQuestion.optionA =
                        questionData.optionA;

                    existingQuestion.optionB =
                        questionData.optionB;

                    existingQuestion.optionC =
                        questionData.optionC;

                    existingQuestion.optionD =
                        questionData.optionD;

                    existingQuestion.correctAnswer =
                        questionData.correctAnswer;

                    existingQuestion.marks =
                        questionData.marks;

                }

            }


            questionForm.reset();

            questionFormContainer.style.display =
                "none";


            displayQuestions();

        }
    );



    // ==========================================
    // DISPLAY QUESTIONS
    // ==========================================

    function displayQuestions() {

        const selectedExam =
            questionExamSelect.value;


        questionTableBody.innerHTML = "";


        if (selectedExam === "") {

            questionTableBody.innerHTML = `

                <tr>

                    <td colspan="6">

                        Select an examination
                        to view questions.

                    </td>

                </tr>

            `;

            return;

        }


        const examQuestions =
            questions.filter(
                function (question) {

                    return question.examId == selectedExam;

                }
            );


        if (examQuestions.length === 0) {

            questionTableBody.innerHTML = `

                <tr>

                    <td colspan="6">

                        No questions added for this
                        examination yet.

                    </td>

                </tr>

            `;

            return;

        }


        examQuestions.forEach(
            function (question, index) {


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>


                    <td>
                        ${escapeHTML(question.question)}
                    </td>


                    <td>

                        A. ${escapeHTML(question.optionA)}
                        <br>

                        B. ${escapeHTML(question.optionB)}
                        <br>

                        C. ${escapeHTML(question.optionC)}
                        <br>

                        D. ${escapeHTML(question.optionD)}

                    </td>


                    <td>
                        ${question.correctAnswer}
                    </td>


                    <td>
                        ${question.marks}
                    </td>


                    <td>

                        <button
                            type="button"
                            class="btn btn-warning edit-question"
                            data-id="${question.id}">

                            Edit

                        </button>


                        <button
                            type="button"
                            class="btn btn-danger delete-question"
                            data-id="${question.id}">

                            Delete

                        </button>

                    </td>

                `;


                questionTableBody.appendChild(row);

            }
        );


        attachQuestionActions();

    }



    // ==========================================
    // QUESTION ACTIONS
    // ==========================================

    function attachQuestionActions() {


        document
            .querySelectorAll(".edit-question")
            .forEach(
                function (button) {


                    button.addEventListener(
                        "click",
                        function () {


                            const id =
                                this.dataset.id;


                            const question =
                                questions.find(
                                    function (item) {

                                        return item.id == id;

                                    }
                                );


                            if (!question) return;


                            document
                                .getElementById("questionId")
                                .value =
                                question.id;


                            document
                                .getElementById("questionText")
                                .value =
                                question.question;


                            document
                                .getElementById("optionA")
                                .value =
                                question.optionA;


                            document
                                .getElementById("optionB")
                                .value =
                                question.optionB;


                            document
                                .getElementById("optionC")
                                .value =
                                question.optionC;


                            document
                                .getElementById("optionD")
                                .value =
                                question.optionD;


                            document
                                .getElementById("correctAnswer")
                                .value =
                                question.correctAnswer;


                            document
                                .getElementById("questionMarks")
                                .value =
                                question.marks;


                            document
                                .getElementById("questionFormTitle")
                                .textContent =
                                "Edit Question";


                            questionFormContainer.style.display =
                                "block";

                        }
                    );

                }
            );



        document
            .querySelectorAll(".delete-question")
            .forEach(
                function (button) {


                    button.addEventListener(
                        "click",
                        function () {


                            const id =
                                this.dataset.id;


                            const confirmDelete =
                                confirm(
                                    "Are you sure you want to delete this question?"
                                );


                            if (!confirmDelete) return;


                            questions =
                                questions.filter(
                                    function (question) {

                                        return question.id != id;

                                    }
                                );


                            displayQuestions();

                        }
                    );

                }
            );

    }



    // ==========================================
    // STUDENTS
    // ==========================================

    backFromStudentsBtn.addEventListener(
        "click",
        function () {

            showDashboard();

        }
    );



    function displayStudents(
        searchTerm = ""
    ) {

        studentsTableBody.innerHTML = "";


        const filteredStudents =
            students.filter(
                function (student) {


                    const search =
                        searchTerm.toLowerCase();


                    return (
                        student.id
                            .toLowerCase()
                            .includes(search)
                        ||
                        student.name
                            .toLowerCase()
                            .includes(search)
                        ||
                        student.email
                            .toLowerCase()
                            .includes(search)
                    );

                }
            );


        if (filteredStudents.length === 0) {

            studentsTableBody.innerHTML = `

                <tr>

                    <td colspan="4">

                        No students found.

                    </td>

                </tr>

            `;

            return;

        }


        filteredStudents.forEach(
            function (student) {


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${escapeHTML(student.id)}
                    </td>

                    <td>
                        ${escapeHTML(student.name)}
                    </td>

                    <td>
                        ${escapeHTML(student.email)}
                    </td>

                    <td>
                        ${escapeHTML(student.status)}
                    </td>

                `;


                studentsTableBody.appendChild(row);

            }
        );

    }



    studentSearch.addEventListener(
        "input",
        function () {

            displayStudents(
                this.value
            );

        }
    );



    // ==========================================
    // RESULTS
    // ==========================================

    backFromResultsBtn.addEventListener(
        "click",
        function () {

            showDashboard();

        }
    );



    function displayResults(
        searchTerm = ""
    ) {

        resultsTableBody.innerHTML = "";


        const search =
            searchTerm.toLowerCase();


        const filteredResults =
            results.filter(
                function (result) {


                    return (

                        result.student
                            .toLowerCase()
                            .includes(search)

                        ||

                        result.exam
                            .toLowerCase()
                            .includes(search)

                        ||

                        result.status
                            .toLowerCase()
                            .includes(search)

                    );

                }
            );


        if (filteredResults.length === 0) {

            resultsTableBody.innerHTML = `

                <tr>

                    <td colspan="5">

                        No results found.

                    </td>

                </tr>

            `;

            return;

        }


        filteredResults.forEach(
            function (result) {


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${escapeHTML(result.student)}
                    </td>

                    <td>
                        ${escapeHTML(result.exam)}
                    </td>

                    <td>
                        ${escapeHTML(result.score)}
                    </td>

                    <td>
                        ${result.percentage}%
                    </td>

                    <td>
                        ${escapeHTML(result.status)}
                    </td>

                `;


                resultsTableBody.appendChild(row);

            }
        );

    }



    resultSearch.addEventListener(
        "input",
        function () {

            displayResults(
                this.value
            );

        }
    );



    // ==========================================
    // RECENT RESULTS
    // ==========================================

    function displayRecentResults() {

        recentResultsBody.innerHTML = "";


        results.slice(0, 5).forEach(
            function (result) {


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${escapeHTML(result.student)}
                    </td>

                    <td>
                        ${escapeHTML(result.exam)}
                    </td>

                    <td>
                        ${escapeHTML(result.score)}
                    </td>

                    <td>
                        ${result.percentage}%
                    </td>

                    <td>
                        ${escapeHTML(result.status)}
                    </td>

                `;


                recentResultsBody.appendChild(row);

            }
        );

    }



    // ==========================================
    // SECURITY HELPER
    // ==========================================

    function escapeHTML(text) {

        const div =
            document.createElement("div");


        div.textContent =
            text;


        return div.innerHTML;

    }



    // ==========================================
    // START DASHBOARD
    // ==========================================

    showDashboard();


});
