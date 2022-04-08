function saveLocal() {
  let pomodoro = document.getElementById("pomodoro").value;
  let relax = document.getElementById("break").value;
  let times = document.getElementById("times").value;
  localStorage.setItem("pomodoro", pomodoro);
  localStorage.setItem("break", relax);
  localStorage.setItem("times", times);
}

function getFromLocal() {
  let pomodoro = localStorage.getItem("pomodoro");
  document.getElementById("pomodoro").value = pomodoro;
  let relax = localStorage.getItem("break");
  document.getElementById("break").value = relax;
  let times = localStorage.getItem("times");
  document.getElementById("times").value = times;
}

function getValues() {
  let pomodoro = document.getElementById("pomodoro").value;
  let relax = document.getElementById("break").value;
  let times = document.getElementById("times").value;
  return [pomodoro, relax, times];
}

function settings() {
  const setsWindow = document.styleSheets[0].cssRules[8].style;
  let visibility = setsWindow.getPropertyValue("visibility");
  if (visibility == "visible") {
    createTimer();
    saveLocal();
    setsWindow.setProperty("visibility", "hidden");
  } else if (visibility == "hidden") {
    setsWindow.setProperty("visibility", "visible");
  }
}

const moto = document.getElementById("moto");
const title = document.getElementById("title");

function createTimer() {
  let values = getValues();
  const pauseButton = document.getElementById("pause-start");
  const session = document.getElementById("session");
  if (countdown.dataset.type == "pomodoro") {
    moto.innerHTML = "До роботи!";
    countdown.innerHTML = values[0] + ":00";
    pauseButton.innerHTML = "Почати";
    pauseButton.dataset.button = "start";
  }
  if (countdown.dataset.type == "break") {
    moto.innerHTML = "Відпочинь";
    countdown.innerHTML = values[1] + ":00";
    pauseButton.innerHTML = "Пауза";
    pauseButton.dataset.button = "pause";
  }
  session.innerHTML = "Сеанс " + pomodoroCounter + " з " + values[2];
}

let ring = new Audio("./notification.wav");
let secs = 59;
let mins;
const countdown = document.getElementById("timer-container");
function runCountdown(mode) {
  let tempstr = document.getElementById("timer-container").innerText;
  mins = Number(tempstr.slice(0, tempstr.indexOf(":")));
  if (document.getElementById(mode).value == mins) {
    mins--;
  }
  if (secs == -1) {
    mins--;
    secs = 59;
  }
  if (mins == -1 && secs == 59) {
    clearInterval(interval);
    interval = null;
    ring.play();
    mode == "pomodoro" ? startBreak() : startPomodoro();
  } else {
    if (secs < 10) {
      countdown.innerHTML = mins + ":0" + secs;
      title.innerHTML = mins + ":0" + secs;
      secs--;
    } else {
      countdown.innerHTML = mins + ":" + secs;
      title.innerHTML = mins + ":" + secs;
      secs--;
    }
  }
}

let interval;
function pauseStart(event) {
  const pauseButton = event.target;
  const counterMode = document.getElementById("timer-container").dataset.type;
  if (!interval) {
    pauseButton.dataset.button = "pause";
    pauseButton.innerHTML = "Пауза";
    interval = setInterval(runCountdown, 1000, counterMode);
  } else if (pauseButton.dataset.button == "pause") {
    pauseButton.dataset.button = "start";
    pauseButton.innerHTML = "Продовжити";
    clearInterval(interval);
    interval = null;
  }
}

const timerBox = document.getElementById("counter-container");
function startBreak() {
  const pauseButton = document.getElementById("pause-start");
  timerBox.setAttribute("class", "break");
  countdown.dataset.type = "break";
  let counterMode = countdown.dataset.type;
  createTimer();
  if (!interval) {
    pauseButton.dataset.button = "pause";
    pauseButton.innerHTML = "Пауза";
    interval = setInterval(runCountdown, 1000, counterMode);
  }
}

let pomodoroCounter = 1;
function startPomodoro() {
  let times = getValues()[2];
  if (pomodoroCounter < times) {
    timerBox.setAttribute("class", "pomodoro");
    countdown.dataset.type = "pomodoro";
    pomodoroCounter++;
    createTimer();
  } else {
    countdown.innerHTML = "0:00";
    moto.innerHTML = "Гарна робота!";
  }
}

function nextMode() {
  clearInterval(interval);
  interval = null;
  secs = 59;
  if (countdown.dataset.type == "pomodoro") {
    startBreak();
  } else if (countdown.dataset.type == "break") {
    startPomodoro();
  }
}

window.onload = function () {
  const submitButton = document.getElementById("submit-settings");
  submitButton.addEventListener("click", () => settings());
  const settingsButton = document.querySelector("#settings-icon");
  settingsButton.addEventListener("click", () => settings());
  const pauseButton = document.getElementById("pause-start");
  pauseButton.addEventListener("click", pauseStart);
  const skipButton = document.getElementById("skip");
  skipButton.addEventListener("click", nextMode);

  if (localStorage.length !== 0) {
    getFromLocal();
  }

  createTimer();
};

window.onbeforeunload = function (e) {
  return "Sure?";
};
