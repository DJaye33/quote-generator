const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");

let errorCount = 0;

function showLoadingSpinner() {
  loader.hidden = false; // Shows loader
  quoteContainer.hidden = true; // hides container
}

function removeLoadingSpinner() {
  // if showing
  if (!loader.hidden) {
    quoteContainer.hidden = false;
    loader.hidden = true;
  }
}

// Get Quote from API
async function getQuote() {
  showLoadingSpinner();
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const apiUrl =
    "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";

  try {
    const response = await fetch(proxyUrl + apiUrl);
    const data = await response.json();
    // If Author is blank, add "Unknown"
    if (data.quoteAuthor === "") {
      authorText.innerText - "Unknown";
    } else {
      authorText.innerText = data.quoteAuthor;
    }
    // Reduce font size for long quotes
    if (data.quoteText.length > 120) {
      quoteText.classList.add("long-quote");
    } else {
      quoteText.classList.remove("long-quote");
    }
    quoteText.innerText = data.quoteText;
    // Stop loader, show quote
    removeLoadingSpinner();
  } catch (error) {
    errorCount++;
    console.log(errorCount);
    // Stops api request after 20 calls w/ error
    if (errorCount >= 10) {
      errorCount = 0;
      removeLoadingSpinner();
      quoteText.innerText =
        "Patience is not the ability to wait, but the ability to keep a good attitude while waiting.";
    } else {
      getQuote();
      console.log("Whoops!, no string", error);
    }
  }
}

// Tweet Quote
function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  window.open(twitterUrl, "_blank");
}

// Event Listener
newQuoteBtn.addEventListener("click", getQuote);
twitterBtn.addEventListener("click", tweetQuote);

// On Load
getQuote();
