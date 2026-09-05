 document.querySelector(".btn-next").addEventListener("click", function () {
    saveCurrentAnswer();
    if (window.examState.currentQuestionIndex < window.examState.questions.length - 1) {
        window.examState.currentQuestionIndex++;
        window.examState.renderQuestion();
        restoreSelectedAnswer();
    }
});

document.querySelector(".btn-prev").addEventListener("click", function () {
    saveCurrentAnswer();
    if (window.examState.currentQuestionIndex > 0) {
        window.examState.currentQuestionIndex--;
        window.examState.renderQuestion();
        restoreSelectedAnswer();
    }
});

function saveCurrentAnswer() {
    const selected = document.querySelector(".options input[type=radio]:checked");
    if (selected) {
        window.examState.userAnswers[window.examState.currentQuestionIndex] = Number(selected.value);
    }
}

function restoreSelectedAnswer() {
    const index = window.examState.currentQuestionIndex;
    const savedAnswer = window.examState.userAnswers[index];
    if (savedAnswer !== null) {
        const inputs = document.querySelectorAll(".options input[type=radio]");
        inputs[savedAnswer].checked = true;
    }
}