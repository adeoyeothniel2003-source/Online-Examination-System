// FAKE placeholder data — delete once Person 1's real array is ready
const questions = [
  { question: "2 + 2?", options: ["3", "4", "5"], correctAnswer: 1 },
  { question: "Capital of Nigeria?", options: ["Lagos", "Abuja", "Kano"], correctAnswer: 1 },
  { question: "JS runs in the...?", options: ["Browser", "Oven", "Printer"], correctAnswer: 0 }
];

const userAnswers = [1, 0, 0]; // one wrong on purpose, to test scoring catches it

function calculateScore() {
  let score = 0;
  questions.forEach((q, index) => {
    if (userAnswers[index] === q.correctAnswer) {
      score++;
    }
  });
  const percentage = (score / questions.length) * 100;
  return { score, total: questions.length, percentage };
}
document.getElementById("submitBtn").addEventListener("click", function() {
  const result = calculateScore();

  console.log("Score for backend:", result); // keep this for now, useful while testing

  // PLACEHOLDER — swap this URL for the real one once Team 4's submit_exam.php is ready
  fetch("php/submit_exam.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      examId: "exam1",
      answers: userAnswers,
      score: result.score,
      percentage: result.percentage
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Server responded:", data);
  })
  .catch(error => {
    console.log("Backend not ready yet — this is expected for now:", error.message);
  });

  document.getElementById("resultDisplay").innerText =
    "Your exam has been submitted successfully.";
});
let timeRemaining = 10; // 10 seconds — small on purpose, just to test quickly

function startTimer() {
  const timerInterval = setInterval(() => {
    timeRemaining--;

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById("timer").innerText =
      `${minutes}:${seconds.toString().padStart(2, "0")}`;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      document.getElementById("timer").innerText = "Time's up!";
    }
  }, 1000);
}

startTimer();