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
  // and then every 8 seconds thereafter until aaaaaall words are used...
  let autoPlayInterval = null;
  const autoPlayButton = document.querySelector(".auto-play");

  autoPlayButton.addEventListener("click", () => {
    if (autoPlayInterval === null) {
      // Start auto play
      callNewWord(); // Call a word immediately
      autoPlayButton.style.backgroundColor = "#fc5dc4"; // Change button to pink

      autoPlayInterval = setInterval(() => {
        callNewWord();
        if (calledWords.length === allWords.length) {
          stopAutoPlay();
        }
      }, 8000);
    } else {
      // Stop auto play
      stopAutoPlay();
    }
  });

  // Function to stop auto play (also used when the game is reset)
  function stopAutoPlay() {
    if (autoPlayInterval !== null) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
    autoPlayButton.style.backgroundColor = ""; // Reset button color
  }

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
        }, 8000);
      }
    }
  });

  // Reset Button
  // Reset Button: Clears the called words and resets the game
  document.querySelector(".reset").addEventListener("click", () => {
    calledWords = []; // Clear the array
    updateCalledWordsDisplay(); // Update the display

    stopAutoPlay(); // Stop auto-play if running

    // Reset pause button state
    isPaused = false;
    pauseButton.style.backgroundColor = "";
    pauseButton.textContent = "Pause";
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
