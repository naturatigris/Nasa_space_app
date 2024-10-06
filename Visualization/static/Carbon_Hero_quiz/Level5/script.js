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
        question: "What is the Paris Agreement?",
        options: ["An international treaty to combat climate change", "A local policy", "An energy source"],
        Answer: 0
      },
      {
        question: "Which type of energy does not produce greenhouse gases?",
        options: ["Coal", "Solar", "Oil"],
        Answer: 1
      },
      {
        question: "What is the effect of overfishing on marine ecosystems?",
        options: ["It increases fish populations", "It decreases fish populations", "It has no effect"],
        Answer: 1
      },
      {
        question: "What is a carbon offset?",
        options: ["A reduction in greenhouse gases", "An increase in emissions", "The amount of energy used"],
        Answer: 0
      },
      {
        question: "What does climate resilience refer to?",
        options: ["The ability to recover from climate impacts", "The impact of climate on architecture", "The degree of temperature rise"],
        Answer: 0
      },
      {
        question: "What is one way to conserve water?",
        options: ["Using more water", "Leaving the tap running", "Fixing leaks"],
        Answer: 2
      },
      {
        question: "Which of the following can help reduce the urban heat island effect?",
        options: ["Planting more trees", "Increasing concrete surfaces", "Using darker colors for roofs"],
        Answer: 0
      },
      {
        question: "What is the role of carbon sinks?",
        options: ["To absorb carbon dioxide", "To release carbon dioxide", "To store energy"],
        Answer: 0
      },
      {
        question: "What can reduce the effects of climate change?",
        options: ["Switching to renewable energy", "Increasing fossil fuel use", "Ignoring the problem"],
        Answer: 0
      },
      {
        question: "What does the term 'climate justice' refer to?",
        options: ["Fair treatment of all people regarding climate change", "Equal distribution of fossil fuels", "Taxation of renewable energy"],
        Answer: 0
      }
    ]
,
    badge: {
      title: "Sustainable Scholar",
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
