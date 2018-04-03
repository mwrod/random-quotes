const API_URL = "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";
const TWEET_URL = "https://twitter.com/intent/tweet?text=";
const COLORS = ["#FE2712", "#FC600A", "#66B032", "#0080FF", "#347C98", "#0247FE",
 "#4424D6", "#8601AF", "#C21460", "#333333"];
const QUOTES = [];

// UI Selectors
const html = document.getElementsByTagName('html')[0];
const message = $('#message');
const author = $('#author');
const leftArrow = $("#leftArrow");
const rightArrow = $("#rightArrow");
const tweetBtn = $("#tweet-button");

function fetchQuote(id){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', API_URL + "_=" + new Date().getTime(), true);
  xhr.onload = function() {
    if(this.status === 200) {
      const quote = JSON.parse(this.responseText);
      QUOTES.push(quote[0]);
      setQuoteUI(id);
    } else {
      alert("Could not retrieve a new quote. Please check your internet connection.") 
    }
  }
  xhr.send();
}

function setQuoteUI(id){
  message.fadeOut(500, function(){
    message.html(QUOTES[id].content).fadeIn(500);
  });
  author.fadeOut(500, function(){
    author.html(QUOTES[id].title).fadeIn(500);
  });

  // change the background
  html.style.setProperty("--main-color", COLORS[QUOTES[id].ID % COLORS.length]);
}

function updateUI(id) {
  if(id === 1) {
    // show left arrow if current quote is the second
    leftArrow.css("visibility", "visible").hide().fadeIn("slow");
  } else if(id === 0) {
    // hide left arrow if current quote is the first
    leftArrow.fadeOut("slow", function(){
      leftArrow.css({"visibility": "hidden", "display": "inline"});
    });
  }
}

$(document).ready(function(){
  let currentId = 0;
  fetchQuote(currentId);

  // display next quote (fetch new quote if current is last)
  rightArrow.on("click", function(event){
    // dont allow multi-clicks
    if(event.detail == 1){
      currentId++;
      if(currentId >= QUOTES.length - 1) fetchQuote(currentId);
      else setQuoteUI(currentId);
      updateUI(currentId);
    }
  });

  // display previous quote
  leftArrow.on("click", function(event){
    // dont allow multi-clicks
    if(event.detail == 1){
      if(currentId > 0) currentId--;
      setQuoteUI(currentId);
      updateUI(currentId);
    }
  });

  // open tweet window and set current quote as text
  tweetBtn.on("click", function(){
    let messageText = message.text();
    let authorText = author.text();

    if(messageText.length + authorText.length > 280) {
      postTitle = messageText.substr(0, 280 - authorText.length - 6) + "...";
    } else {
      postTitle = messageText;
    }
    postTitle += "\n- " + authorText;
    window.open(TWEET_URL + encodeURIComponent(postTitle), "twitterwindow", height=450, width=550, 
      toolbar=0, menubar=0, directories=0, scrollbars=0);
  });
});
