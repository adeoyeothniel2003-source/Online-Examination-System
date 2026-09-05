document.addEventListener("DOMContentLoaded", function () {

    // Get all admin dashboard buttons
    const buttons = document.querySelectorAll(".admin-card .btn");

    // Manage Exams
    buttons[0].addEventListener("click", function () {
        alert("Manage Exams section will be available here.");
    });

    // Manage Questions
    buttons[1].addEventListener("click", function () {
        alert("Manage Questions section will be available here.");
    });

    // View Students
    buttons[2].addEventListener("click", function () {
        alert("Student management section will be available here.");
    });

    // View Results
    buttons[3].addEventListener("click", function () {
        alert("Results section will be available here.");
    });

});
