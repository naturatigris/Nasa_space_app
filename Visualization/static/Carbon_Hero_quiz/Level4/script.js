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
        question: "What is the primary function of the ozone layer?",
        options: ["To protect against UV radiation", "To absorb CO2", "To regulate temperature"],
        Answer: 0
      },
      {
        question: "What is a common way to measure temperature?",
        options: ["Celsius", "Foot", "Inches"],
        Answer: 0
      },
      {
        question: "Which of the following gases is a significant contributor to acid rain?",
        options: ["Sulfur dioxide", "Nitrogen", "Carbon monoxide"],
        Answer: 0
      },
      {
        question: "What is an ecosystem?",
        options: ["A community of living organisms interacting with their environment", "A type of greenhouse gas", "A measure of biodiversity"],
        Answer: 0
      },
      {
        question: "Which process in nature releases carbon dioxide?",
        options: ["Photosynthesis", "Respiration", "Transpiration"],
        Answer: 1
      },
      {
        question: "What is a consequence of rising temperatures on glaciers?",
        options: ["They expand", "They melt", "They freeze"],
        Answer: 1
      },
      {
        question: "Which of the following is a benefit of reforestation?",
        options: ["Decreased biodiversity", "Increased carbon emissions", "Improved air quality"],
        Answer: 2
      },
      {
        question: "What is a major environmental concern of plastic use?",
        options: ["It is biodegradable", "It can take hundreds of years to decompose", "Clean oceans"],
        Answer: 1
      },
      {
        question: "Which energy source has the least environmental impact?",
        options: ["Fossil fuels", "Nuclear energy", "Wind energy"],
        Answer: 2
      },
      {
        question: "What does 'biodegradable' mean?",
        options: ["Can be broken down by natural processes", "Cannot be broken down", "Is man-made"],
        Answer: 0
      }
    ]
,
    badge: {
      title: "Eco Advocate",
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
