// Check if API is supported
if (
  "SpeechRecognition" in window ||
  "webkitSpeechRecognition" in window ||
  "mozSpeechRecognition" in window ||
  "msSpeechRecognition" in window
) {
  // speech recognition API supported
  var recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition)();
} else {
  // speech recognition API not supported
  console.error("Sorry, Speech Recognition is not supported in your browser.");
  document.querySelector(".error").style.display = "block";
  document.querySelector(".start").style.display = "none";
}

// Speech Recognition config
recognition.continuous = true;

// On recognize event
recognition.onresult = event => {
  const speechToText = event.results[event.results.length - 1][0];
  console.log(`${speechToText.transcript} - ${speechToText.confidence}`);

  let text = speechToText.transcript;

  document.querySelector(".command").innerHTML = text;

  // Commands
  if (text.indexOf("search for") >= 0) {
    //   Search

    // takeout the search term from string
    let q = text.substr(text.indexOf("for") + 3);
    console.log(q);

    speak(`Searching for ${q}`);
    window.open(`https://www.google.com/travel/flights/search?q=${q}`);
  } else if (
    text.indexOf("what time is it") >= 0 ||
    text.indexOf("what's the time") >= 0
  ) {
    // time
    let t = currentTime();
    speak(t);
  } else {
    //   None of the above
    speak(`Sorry, I can't recognize that`);
  }
};

// Declaring elements
const start = document.querySelector(".start"),
  main = document.querySelector(".container"),
  icon = document.querySelector(".fa-microphone");

start.addEventListener("click", function() {
  // Show bot
  main.style.display = "flex";
  this.style.display = "none";

  // Start recognizing
  recognition.start();
});

// Returns current time
function currentTime() {
  let date = new Date();
  return `It's ${date.getHours()} ${date.getMinutes()} ${
    date.getHours() >= 12 ? "PM" : "AM"
  }`;
}

// Speak function
function speak(text) {
  recognition.stop();

  let msg = new SpeechSynthesisUtterance(text);

  msg.onend = () => {
    console.log("End..");
    recognition.start();
  };

  window.speechSynthesis.speak(msg);
  return;
}

// Animating microphone while recording
recognition.onstart = () => {
  icon.classList.add("listening");
};
recognition.onend = () => {
  icon.classList.remove("listening");
};