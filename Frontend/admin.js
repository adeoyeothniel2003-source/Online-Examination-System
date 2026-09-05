document.addEventListener("DOMContentLoaded", function () {

    const manageExamsBtn = document.getElementById("manageExamsBtn");
    const manageQuestionsBtn = document.getElementById("manageQuestionsBtn");
    const viewStudentsBtn = document.getElementById("viewStudentsBtn");
    const viewResultsBtn = document.getElementById("viewResultsBtn");

    // Manage Exams
    manageExamsBtn.addEventListener("click", function () {
        alert("Manage Exams section selected.");
    });

    // Manage Questions
    manageQuestionsBtn.addEventListener("click", function () {
        alert("Manage Questions section selected.");
    });

    // Students
    viewStudentsBtn.addEventListener("click", function () {
        alert("Students section selected.");
    });

    // Results
    viewResultsBtn.addEventListener("click", function () {
        alert("Results section selected.");
    });

});
