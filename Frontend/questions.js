async function loadQuestions() {
    const response = await fetch("/api/questions");
    const questions = await response.json();

    let currentQuestionIndex = 0;

    const questionCounter = document.querySelector(".question-counter p")
    const questionText = document.querySelector(".question-text")
    const optionsForm = document.querySelector(".options")

    function renderQuestion() {
        const q = questions[currentQuestionIndex];

        questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
        questionText.textCounter = `${currentQuestionIndex + 1}.${q.question}`;

        optionsForm.innerHTML = "";

        const letters = ["A" , "B" , "C" , "D"];
        q.options.forEach(function (optionText , index) {
            const label = document.createElement("label");
            label.className = "option";

            const input = document.createElement("input");
            input.type = "radio";
            input.name = "question1";
            input.value = letters[index]

            label.appendChild(input)
            label.appendChild(document.createTextNode(` ${letters[index]}. ${optionText}`));
            optionsForm.appendChild(label);
        });

    }

    renderQuestion();
}
loadQuestions();
