document.addEventListener("DOMContentLoaded", function () {

    const dashboardCards = document.querySelector(".admin-grid");
    const recentResults = document.querySelector(".card");

    const manageExamsBtn = document.getElementById("manageExamsBtn");
    const manageQuestionsBtn = document.getElementById("manageQuestionsBtn");
    const viewStudentsBtn = document.getElementById("viewStudentsBtn");
    const viewResultsBtn = document.getElementById("viewResultsBtn");

    const manageExamsSection =
        document.getElementById("manageExamsSection");

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


    // Temporary exam storage
    let exams = [];


    // Show dashboard
    function showDashboard() {

        dashboardCards.style.display = "grid";

        recentResults.style.display = "block";

        manageExamsSection.style.display = "none";
    }


    // Show Manage Exams
    function showManageExams() {

        dashboardCards.style.display = "none";

        recentResults.style.display = "none";

        manageExamsSection.style.display = "block";

        displayExams();
    }


    // Manage Exams button
    manageExamsBtn.addEventListener("click", function () {

        showManageExams();

    });


    // Back to dashboard
    backToDashboardBtn.addEventListener("click", function () {

        showDashboard();

    });


    // Add exam button
    addExamBtn.addEventListener("click", function () {

        examForm.reset();

        document.getElementById("examId").value = "";

        document.getElementById("examFormTitle").textContent =
            "Add New Exam";

        examFormContainer.style.display = "block";

    });


    // Cancel exam form
    cancelExamBtn.addEventListener("click", function () {

        examForm.reset();

        examFormContainer.style.display = "none";

    });


    // Save exam
    examForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const title =
            document.getElementById("examTitle").value.trim();

        const description =
            document.getElementById("examDescription").value.trim();

        const duration =
            document.getElementById("examDuration").value;

        const examId =
            document.getElementById("examId").value;


        if (examId === "") {

            // Create new exam
            const newExam = {

                id: Date.now(),

                title: title,

                description: description,

                duration: duration,

                status: "Draft"

            };

            exams.push(newExam);

        } else {

            // Edit existing exam
            const exam = exams.find(
                function (item) {
                    return item.id == examId;
                }
            );

            if (exam) {

                exam.title = title;

                exam.description = description;

                exam.duration = duration;

            }

        }


        examForm.reset();

        examFormContainer.style.display = "none";

        displayExams();

    });


    // Display exams
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


        exams.forEach(function (exam) {

            const row = document.createElement("tr");

            row.innerHTML = `

                <td>
                    <strong>${escapeHTML(exam.title)}</strong>
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
                        data-id="${exam.id}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="btn btn-success toggle-exam"
                        data-id="${exam.id}"
                    >
                        ${exam.status === "Draft"
                            ? "Publish"
                            : "Unpublish"}
                    </button>

                    <button
                        type="button"
                        class="btn btn-danger delete-exam"
                        data-id="${exam.id}"
                    >
                        Delete
                    </button>

                </td>

            `;

            examTableBody.appendChild(row);

        });


        attachExamActions();

    }


    // Exam actions
    function attachExamActions() {

        // Edit
        document
            .querySelectorAll(".edit-exam")
            .forEach(function (button) {

                button.addEventListener("click", function () {

                    const id = this.dataset.id;

                    const exam = exams.find(
                        function (item) {
                            return item.id == id;
                        }
                    );

                    if (!exam) return;

                    document.getElementById("examId").value =
                        exam.id;

                    document.getElementById("examTitle").value =
                        exam.title;

                    document.getElementById("examDescription").value =
                        exam.description;

                    document.getElementById("examDuration").value =
                        exam.duration;

                    document.getElementById("examFormTitle").textContent =
                        "Edit Exam";

                    examFormContainer.style.display =
                        "block";

                });

            });


        // Publish / Unpublish
        document
            .querySelectorAll(".toggle-exam")
            .forEach(function (button) {

                button.addEventListener("click", function () {

                    const id = this.dataset.id;

                    const exam = exams.find(
                        function (item) {
                            return item.id == id;
                        }
                    );

                    if (!exam) return;

                    if (exam.status === "Draft") {

                        exam.status = "Published";

                    } else {

                        exam.status = "Draft";

                    }

                    displayExams();

                });

            });


        // Delete
        document
            .querySelectorAll(".delete-exam")
            .forEach(function (button) {

                button.addEventListener("click", function () {

                    const id = this.dataset.id;

                    const confirmDelete =
                        confirm(
                            "Are you sure you want to delete this exam?"
                        );

                    if (!confirmDelete) return;

                    exams = exams.filter(
                        function (exam) {
                            return exam.id != id;
                        }
                    );

                    displayExams();

                });

            });

    }


    // Temporary messages for other sections

    manageQuestionsBtn.addEventListener("click", function () {

        alert("Manage Questions section will be added next.");

    });


    viewStudentsBtn.addEventListener("click", function () {

        alert("Students section will be added next.");

    });


    viewResultsBtn.addEventListener("click", function () {

        alert("Results section will be added next.");

    });


    // Prevent HTML injection
    function escapeHTML(text) {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }

});
