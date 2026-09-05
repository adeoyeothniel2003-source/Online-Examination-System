window.examState = {
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: []
};

async function loadQuestions() {
    // TEMPORARY placeholder — swap for the real fetch() once Team 4's API is ready
    const questions = [
        { question: "2 + 2?", options: ["3", "4", "5", "6"], correctAnswer: 1 },
        { question: "Capital of Nigeria?", options: ["Lagos", "Abuja", "Kano", "Ibadan"], correctAnswer: 1 },
        { question: "JS runs in the...?", options: ["Browser", "Oven", "Printer", "Fridge"], correctAnswer: 0 }
    ];

    window.examState.questions = questions;
    window.examState.userAnswers = new Array(questions.length).fill(null);

    const questionCounter = document.querySelector(".question-counter p");
    const questionText = document.querySelector(".question-text");
    const optionsForm = document.querySelector(".options");

    function renderQuestion() {
        const index = window.examState.currentQuestionIndex;
        const q = window.examState.questions[index];

        questionCounter.textContent = `Question ${index + 1} of ${questions.length}`;
        questionText.textContent = `${index + 1}. ${q.question}`;

        optionsForm.innerHTML = "";

        const letters = ["A", "B", "C", "D"];
        q.options.forEach(function (optionText, optIndex) {
            const label = document.createElement("label");
            label.className = "option";

            const input = document.createElement("input");
            input.type = "radio";
            input.name = `question${index}`;
            input.value = optIndex;

            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${letters[optIndex]}. ${optionText}`));
            optionsForm.appendChild(label);
        });
    }

    window.examState.renderQuestion = renderQuestion;
    renderQuestion();
}
loadQuestions();