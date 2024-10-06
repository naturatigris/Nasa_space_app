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
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Jupiter", "Mars"],
        Answer: 1
      },
      {
        question: "What gas do plants absorb from the atmosphere?",
        options: ["Oxygen", "Nitrogen", "Carbon dioxide"],
        Answer: 2
      },
      {
        question: "What is the main source of energy for the Earth?",
        options: ["The Moon", "The Sun", "The Stars"],
        Answer: 1
      },
      {
        question: "Which of the following is a renewable resource?",
        options: ["Oil", "Coal", "Solar energy"],
        Answer: 2
      },
      {
        question: "What natural resource is used to make paper?",
        options: ["Plastic", "Trees", "Metal"],
        Answer: 1
      },
      {
        question: "What is the process called when water vapor turns into liquid water?",
        options: ["Evaporation", "Condensation", "Precipitation"],
        Answer: 1
      },
      {
        question: "What is the main purpose of recycling?",
        options: ["To create waste", "To reduce pollution", "To increase energy consumption"],
        Answer: 1
      },
      {
        question: "What layer of the Earth’s atmosphere protects us from harmful UV radiation?",
        options: ["Stratosphere", "Troposphere", "Mesosphere"],
        Answer: 0
      },
      {
        question: "What do you call the variety of life in the world or in a particular habitat?",
        options: ["Ecology", "Biodiversity", "Sustainability"],
        Answer: 1
      },
      {
        question: "What is a common effect of climate change?",
        options: ["Shorter winters", "Stable temperatures", "Rising sea levels"],
        Answer: 2
      }
    ],
    badge: {
      title: "Climate Explorer",
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

      // Show the Next Level link if it's not the last level
      if (currentLevel < levels.length) {
          nextLevel.style.display = 'block'; // Show the Next Level link
      }
  }
  
  playAgainButton.style.display = "block"; // Show Play Again button
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
