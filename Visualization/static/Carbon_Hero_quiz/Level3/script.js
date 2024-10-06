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
  { // Level 3
      questions: [
        {
          question: "What is the main purpose of the Kyoto Protocol?",
          options: ["To reduce greenhouse gas emissions", "To promote fossil fuel use", "To protect endangered species"],
          Answer: 0
        },
        {
          question: "What is the term for energy that comes from sources that are naturally replenished?",
          options: ["Fossil fuels", "Renewable energy", "Non-renewable energy"],
          Answer: 1
        },
        {
          question: "What is the main consequence of ice melting in the Arctic?",
          options: ["More polar bears", "Less rising sea levels", "Rising sea levels"],
          Answer: 2
        },
        {
          question: "What does 'sustainability' mean?",
          options: ["Using resources faster than they can be replenished", "Using resources without depleting them", "Ignoring environmental impact"],
          Answer: 1
        },
        {
          question: "Which of the following is NOT a renewable energy source?",
          options: ["Solar energy", "Wind energy", "Natural gas"],
          Answer: 2
        },
        {
          question: "What is a key characteristic of the carbon cycle?",
          options: ["Carbon is constantly recycled", "Carbon cannot be recycled", "Carbon is created anew"],
          Answer: 0
        },
        {
          question: "What human activity is the largest source of greenhouse gas emissions?",
          options: ["Deforestation", "Transportation", "Electricity generation"],
          Answer: 2
        },
        {
          question: "What can individuals do to reduce their carbon footprint?",
          options: ["Use more plastic", "Drive more frequently", "Use public transport"],
          Answer: 2
        },
        {
          question: "What is climate adaptation?",
          options: ["Changing weather patterns", "Adjusting practices to minimize damage from climate change", "Ignoring climate change effects"],
          Answer: 1
        },
        {
          question: "What role do oceans play in climate regulation?",
          options: ["Absorbing carbon dioxide", "Creating weather patterns", "Preventing natural disasters"],
          Answer: 0
        }
      ]
  ,
    badge: {
      title: "Green Guardian",
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
