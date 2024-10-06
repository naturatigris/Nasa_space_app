const questionArea = document.getElementById('question-area');
const question = document.getElementById('question');
const options = document.getElementById('options');
const feedback = document.getElementById('feedback');
const score = document.getElementById('score');
const badgeContainer = document.getElementById('badge'); // Badge container for displaying badges
const segments = document.querySelectorAll('.segment');
const playAgainButton = document.getElementById('play-again');

let currentQuestion = 0;
let scoreValue = 0;
let currentLevel = 1;
let ghgLevel = 0; // Count of filled segments

// Hardcoded quiz questions and options with badge information
const levels = [
  { // Level 1
    questions: [
      {
        question: "What are the effects of climate change on agriculture?",
        options: ["Increased crop yields", "Changes in growing seasons", "No effects"],
        Answer: 1
      },
      {
        question: "What is the main purpose of carbon trading?",
        options: ["To reduce greenhouse gas emissions", "To promote fossil fuel use", "To increase profits"],
        Answer: 0
      },
      {
        question: "What is the difference between mitigation and adaptation?",
        options: ["Mitigation reduces emissions; adaptation adjusts to changes", "Mitigation adjusts to changes; adaptation reduces emissions", "Both are the same"],
        Answer: 0
      },
      {
        question: "What role does transportation play in climate change?",
        options: ["Minimal impact", "Major contributor", "Only contributes during summer"],
        Answer: 1
      },
      {
        question: "What is an example of a negative feedback loop in climate?",
        options: ["Increased temperature leads to more ice melting", "Increased CO2 leads to more plants", "None of the above"],
        Answer: 0
      },
      {
        question: "What are climate models used for?",
        options: ["To predict future climate conditions", "To measure current weather", "To test building designs"],
        Answer: 0
      },
      {
        question: "How does deforestation contribute to climate change?",
        options: ["Trees absorb CO2", "Trees release CO2", "Trees have no effect"],
        Answer: 0
      },
      {
        question: "What is a climate anomaly?",
        options: ["A normal climate event", "An unexpected climate pattern", "A weather forecast"],
        Answer: 1
      },
      {
        question: "What is the goal of the United Nations Framework Convention on Climate Change (UNFCCC)?",
        options: ["To stabilize greenhouse gas concentrations", "To promote fossil fuels", "To regulate water use"],
        Answer: 0
      },
      {
        question: "What is meant by 'net zero' emissions?",
        options: ["Balancing emitted greenhouse gases with those removed", "Having zero emissions", "Only reducing emissions"],
        Answer: 0
      }
    ],
    badge: {
      title: "Planet Protector",
      img: "badge.png" // Make sure this path is correct
    }
  }
];

function displayQuestion() {
  if (currentQuestion < levels[currentLevel - 1].questions.length) {
    const currentLevelQuestions = levels[currentLevel - 1].questions;
    question.textContent = currentLevelQuestions[currentQuestion].question;
    options.innerHTML = ""; 

    currentLevelQuestions[currentQuestion].options.forEach((option, index) => {
      const optionElement = document.createElement('button');
      optionElement.textContent = option;
      optionElement.addEventListener('click', () => checkAnswer(index, optionElement));
      options.appendChild(optionElement);
    });

    feedback.textContent = "";
  } else {
    endGame();
  }
}

function checkAnswer(selectedOption, selectedButton) {
  const correctAnswer = levels[currentLevel - 1].questions[currentQuestion].Answer;

  // Disable all buttons after selection
  const buttons = options.querySelectorAll('button');
  buttons.forEach(button => button.disabled = true);

  if (selectedOption === correctAnswer) {
    scoreValue += 10; // Increase score by 10 for correct answer
    ghgLevel = Math.min(10, ghgLevel + 1); // Increase by one segment
    feedback.textContent = "Correct! 🎉";
    updatePlanet(true); // Update planet to green for correct answer
  } else {
    scoreValue = Math.max(0, scoreValue - 10); // Decrease score by 10 for wrong answer
    ghgLevel = Math.max(0, ghgLevel - 1); // Decrease one segment
    feedback.textContent = "Wrong! 😢";
    updatePlanet(false); // Update planet to red for wrong answer
  }

  score.textContent = scoreValue; // Update score display
  updateGHGTube(); // Update GHG level visual
  
  // Move to the next question automatically
  currentQuestion++;
  setTimeout(displayQuestion, 1000); // Wait 1 second before displaying the next question
}

function updatePlanet(isCorrect) {
  if (isCorrect) {
    // If the answer is correct, gradually turn the planet green
    planet.style.filter = 'hue-rotate(-120deg)'; // Green color
  } else {
    // If the answer is wrong, gradually turn the planet red
    planet.style.filter = 'hue-rotate(120deg)'; // Red color
  }
}

function updateGHGTube() {
  segments.forEach((segment, index) => {
    segment.classList.toggle('filled', index < ghgLevel); // Fill segments based on ghgLevel
  });
}

function endGame() {
  questionArea.style.display = "none";
  
  // Check if all questions were answered correctly for the current level
  if (currentQuestion === levels[currentLevel - 1].questions.length && scoreValue === levels[currentLevel - 1].questions.length * 10) {
    displayBadge(levels[currentLevel - 1].badge.title, levels[currentLevel - 1].badge.img);
  }

  playAgainButton.style.display = "block";
}

function displayBadge(title, imgSrc) {
  // Clear previous badges
  badgeContainer.innerHTML = "";
  
  // Create badge element
  const badgeElement = document.createElement('div');
  badgeElement.classList.add('badge');

  // Set badge image
  const img = document.createElement('img');
  img.src = imgSrc;
  img.alt = title;
  img.classList.add('badge-img');

  // Set badge title
  const titleElement = document.createElement('h3');
  titleElement.textContent = title;
  titleElement.classList.add('badge-title');

  badgeElement.appendChild(img);
  badgeElement.appendChild(titleElement);
  
  badgeContainer.appendChild(badgeElement);
}

playAgainButton.addEventListener('click', () => {
  currentQuestion = 0;
  scoreValue = 0;
  ghgLevel = 0; // Reset to empty
  score.textContent = scoreValue;
  badgeContainer.innerHTML = ""; // Clear badge display
  playAgainButton.style.display = "none";
  questionArea.style.display = "block";
  displayQuestion();
  updatePlanet();
  updateGHGTube();
});

// Start the quiz
displayQuestion();
