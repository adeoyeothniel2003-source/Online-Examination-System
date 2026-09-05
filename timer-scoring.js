let timerInterval; // moved outside so the submit button can also stop it

function calculateScore() {
  let score = 0;
  window.examState.questions.forEach((q, index) => {
    if (window.examState.userAnswers[index] === q.correctAnswer) {
      score++;
    }
  });
  const percentage = (score / window.examState.questions.length) * 100;
  return { score, total: window.examState.questions.length, percentage };
}

document.querySelector(".btn-submit").addEventListener("click", function() {
  clearInterval(timerInterval); // stop the timer immediately on manual submit

  saveCurrentAnswer();
  const result = calculateScore();

  console.log("Score for backend:", result);

  fetch("php/submit_exam.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      examId: "exam1",
      answers: window.examState.userAnswers,
      score: result.score,
      percentage: result.percentage
    })
  })
  .then(response => response.json())
  .then(data => console.log("Server responded:", data))
  .catch(error => console.log("Backend not ready yet — expected for now:", error.message));

  document.querySelector(".submit-status").textContent =
    "Your exam has been submitted successfully.";
});

let timeRemaining = 1785; // 29:45 — matches the exam duration

function startTimer() {
  timerInterval = setInterval(() => {
    timeRemaining--;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.querySelector(".timer-value").innerText =
      `${minutes}:${seconds.toString().padStart(2, "0")}`;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      document.querySelector(".btn-submit").click(); // auto-submit
    }
  }, 1000);
}

startTimer();