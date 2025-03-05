document.addEventListener("DOMContentLoaded", () => {
  // Variables from my file variables.js
  const columns = {
    "first-column": columnB,
    "second-column": columnI,
    "third-column": columnN,
    "fourth-column": columnG,
    "fifth-column": columnO,
  };

  // Randomise Button: It updates bingo card values from the respective arrays (theres five)
  document.querySelector(".randomise").addEventListener("click", () => {
    Object.keys(columns).forEach((columnClass) => {
      const columnElements = document.querySelectorAll(`.${columnClass}`);
      const randomValues = getRandomValues(
        columns[columnClass],
        columnElements.length
      );
      columnElements.forEach((element, index) => {
        element.textContent = randomValues[index];
      });
    });

    // Uncheck all checkboxes when randomising
    document.querySelectorAll(".checkbox-wrapper input").forEach((checkbox) => {
      checkbox.checked = false;
    });
  });

  // Clear Button: unchecks all checkboxes on the bingo card
  document.querySelector(".clear").addEventListener("click", () => {
    document.querySelectorAll(".checkbox-wrapper input").forEach((checkbox) => {
      checkbox.checked = false;
    });
  });

  // Called words list is shown inside the textarea (which should have been a div)
  const calledWordsList = document.querySelector(".called-words-list");
  let calledWords = [];
  const allWords = [...columnB, ...columnI, ...columnN, ...columnG, ...columnO];

  // Updates the textarea with the list of called words (newest on top)
  function updateCalledWordsDisplay() {
    calledWordsList.value = calledWords.join("\n"); // Space
  }

  // Picks a new word and updates the list
  function callNewWord() {
    if (calledWords.length === allWords.length) {
      stopAutoPlay();
      return;
    }
    let newWord;
    do {
      newWord = allWords[Math.floor(Math.random() * allWords.length)];
    } while (calledWords.includes(newWord));
    calledWords.unshift(newWord); // adds new word at the top
    updateCalledWordsDisplay();
  }

  // Manual Play Button: calls a new word on each click
  document.querySelector(".manual-call").addEventListener("click", () => {
    callNewWord();
  });

  // Auto Play
  // When the Auto Play button is clicked, a new word is added immediately
  // and then every 8 seconds thereafter until all words are used...
  let autoPlayInterval = null;
  document.querySelector(".auto-play").addEventListener("click", () => {
    if (autoPlayInterval !== null) return; // Ignores if already running

    // If paused, reset the pause button
    if (isPaused) {
      isPaused = false;
      pauseButton.style.backgroundColor = "";
      pauseButton.textContent = "Pause"; // Reset text/icon
    }

    callNewWord(); // Call a word immediately
    autoPlayInterval = setInterval(() => {
      callNewWord();
      if (calledWords.length === allWords.length) {
        stopAutoPlay();
      }
    }, 8000);
  });

  // Pause Button
  // Clicking the Pause button toggles between pausing and resuming auto play
  // When paused, the button's background becomes pink
  let isPaused = false;
  const pauseButton = document.querySelector(".pause");
  pauseButton.addEventListener("click", () => {
    if (autoPlayInterval !== null) {
      // Pause auto play
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
      isPaused = true;
      pauseButton.style.backgroundColor = "#fc5dc4";
      pauseButton.innerHTML = '<i class="bi bi-pause-fill"></i>'; // Change text to bootstrap icon
    } else if (isPaused) {
      // Resume auto play
      isPaused = false;
      pauseButton.style.backgroundColor = "";
      pauseButton.textContent = "Pause"; // Change back to text
      if (calledWords.length < allWords.length) {
        autoPlayInterval = setInterval(() => {
          callNewWord();
          if (calledWords.length === allWords.length) {
            stopAutoPlay();
          }
        }, 3000);
      }
    }
  });

  // Returns a randomisd subset of the given array
  function getRandomValues(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random()); // The spread operator (...) is used to copy all the items in array to a new array called shuffled. This way, we don’t change the original array
    return shuffled.slice(0, count);
  }
});

// const fruits = ['apple', 'banana', 'cherry'];
// const randomFruits = getRandomValues(fruits, 2);
// console.log(randomFruits);
