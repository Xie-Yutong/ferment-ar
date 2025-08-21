
window.addEventListener("DOMContentLoaded", () => {
  const scannedSet = new Set();
  const counterBox = document.getElementById("item-counter");
  const counterSpan = document.getElementById("count");

  const startButton = document.getElementById("start-button");
  const playButton = document.getElementById("play-button");
  const welcomeScreen = document.getElementById("welcome-screen");
  const welcomeLogoScreen = document.getElementById("welcome-logo-screen");
  const instructionScreen = document.getElementById("instruction-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const questionBox = document.getElementById("quiz-question");
  const optionsBox = document.getElementById("quiz-options");
  const nextButton = document.getElementById("next-button");
  const feedbackBox = document.getElementById("quiz-feedback");

  const quizQuestions = [
  {
    question: "What makes Kimchi sour during fermentation?",
    options: ["Sugar", "Vinegar", "Salt", "Pepper", "Lactic acid"],
    answer: 4,
    explanation: "Lactic acid – Kimchi tastes sour because of something called lactic acid. Tiny good bacteria eat the natural sugars in the cabbage and make lactic acid"
  },
  {
    question: "We can eat as much Miso as we want since it is very healthy.",
    options: ["True", "False"],
    answer: 1,
    explanation: "FALSE – Contains high levels of sodium which can be dangerous if taken without moderation."
  },
  {
    question: "What does baker's yeast release during bread making?",
    options: ["Oxygen", "Carbon dioxide", "Nitrogen"],
    answer: 1,
    explanation: "Carbon dioxide - Bakers yeast eats sugar and releases carbon dioxide gas from the dough."
  },
];


  let currentQuestion = 0;
  let answered = false;
  let score = 0;

document.querySelectorAll(".modal-next-button").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    document.getElementById(`modal-${index}`).style.display = "none";

    if (btn.textContent === "Start Quiz") {
      quizScreen.style.display = "flex";
      document.getElementById("ar-container").style.display = "none";
      showQuestion(0);
    }
  });
});



  function showQuestion(index) {
    const q = quizQuestions[index];
    answered = false;
    nextButton.style.display = "none";
    questionBox.textContent = q.question;
    optionsBox.innerHTML = "";
    feedbackBox.textContent = "";

    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.style.border = "2px solid gray";
      btn.onclick = () => {
        if (answered) return;
        answered = true;

        if (i === q.answer) {
          btn.style.backgroundColor = "lightgreen";
          btn.style.border = "2px solid green";
          feedbackBox.textContent = "✅ Correct!";
          score++;
        } else {
          btn.style.backgroundColor = "salmon";
          btn.style.border = "2px solid red";
          feedbackBox.innerHTML = `❌ Incorrect!<br><span style="font-weight: normal;">${q.explanation}</span>`;
        }

        nextButton.style.display = "inline-block";
      };
      optionsBox.appendChild(btn);
    });

    nextButton.textContent = (index === quizQuestions.length - 1) ? "Finish" : "Next";
  }

  nextButton.addEventListener("click", () => {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
      showQuestion(currentQuestion);
    } else {
      questionBox.innerHTML = `<strong>🎉 You scored ${score}/3!</strong>`;
      optionsBox.innerHTML = "";
      feedbackBox.innerHTML = (score === 3)
        ? `🎁 <br>Congratulations on aceing this challenge! Please approach any of the staff to collect your special prize!`
        : `🌟 <br>Thank you for actively participating in this game! You’re now a Fermentation Explorer!`;
      nextButton.style.display = "none";
    }
  });

  startButton.addEventListener("click", () => {
    welcomeLogoScreen.style.display = "none";
    instructionScreen.style.display = "flex";
  });

  playButton.addEventListener("click", () => {
    welcomeScreen.style.display = "none";

    // Dynamically inject the AR scene
    const arContainer = document.getElementById("ar-container");
    arContainer.innerHTML = `
      <a-scene id="ar-scene"
        mindar-image="imageTargetSrc: https://Xie-Yutong.github.io/ferment-ar/targets6.mind; maxTrack: 3" 
        color-space="sRGB"
        renderer="colorManagement: true, physicallyCorrectLights"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false">
        <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
        <a-entity mindar-image-target="targetIndex: 0" id="target-0"></a-entity>
        <a-entity mindar-image-target="targetIndex: 1" id="target-1"></a-entity>
        <a-entity mindar-image-target="targetIndex: 2" id="target-2"></a-entity>
      </a-scene>
    `;

    setTimeout(() => {
      const sceneEl = document.getElementById("ar-scene");
      setupARListeners(sceneEl);
    }, 1000);
  });

  function setupARListeners(sceneEl) {

    const showModal = (index) => {
      document.querySelectorAll(".info-box").forEach(div => div.style.display = "none");
      const modal = document.getElementById(`modal-${index}`);
      if (modal) modal.style.display = "block";
    };

    const hideModals = () => {
      document.querySelectorAll(".info-box").forEach(div => div.style.display = "none");
    };

    for (let i = 0; i < 3; i++) {
      const tryBind = () => {
        const target = document.getElementById(`target-${i}`);
        if (!target) return setTimeout(tryBind, 300);

        target.addEventListener("targetFound", () => {
          showModal(i);

          if (!scannedSet.has(i)) {
            scannedSet.add(i);
            counterSpan.textContent = scannedSet.size;
            counterBox.style.display = "block";

            if (scannedSet.size === 3) {
            const lastButton = document.querySelector(`#modal-${i} .modal-next-button`);
            if (lastButton) {
                lastButton.textContent = "Start Quiz";
            }
            }


        }});

        // target.addEventListener("targetLost", hideModals);
      };

      tryBind();
    }
  }
});
