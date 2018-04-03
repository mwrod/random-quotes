const API_URL = "https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";
const TWEET_URL = "https://twitter.com/intent/tweet?text=";
const COLORS = ["#FE2712", "#FC600A", "#66B032", "#0080FF", "#347C98", "#0247FE",
 "#4424D6", "#8601AF", "#C21460", "#333333"];
const QUOTES = [];
let i = 0;

function fetchQuote(){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', API_URL + "_=" + new Date().getTime(), true);
  xhr.onload = function() {
    if(this.status === 200) {
      const quote = JSON.parse(this.responseText);
      QUOTES.push(quote[0]);
      setQuoteUI(i);
    } else {
      alert("Could not retrieve a new quote. Please check your internet connection.") 
    }
  }
  xhr.send();

  // Alternative: fetch API
  // fetch(API_URL, {cache: "no-store"})
  //   .then(res => res.json())
  //   .then(quote => {
  //     QUOTES.push(quote[0]);
  //     setQuoteUI(i);
  //   })
  //   .catch(err => { 
  //     if (err) alert("Could not retrieve a new quote. Please check your internet connection.") 
  //   });
}

function setQuoteUI(id){
  $('#message').fadeOut(500, function(){
    $(this).html(QUOTES[id].content).fadeIn(500);
  });
  $('#author').fadeOut(500, function(){
    $(this).html(QUOTES[id].title).fadeIn(500);
  });
  changeBackground(id);
}

function changeBackground(id){
  var html = document.getElementsByTagName('html')[0];
  html.style.setProperty("--main-color", COLORS[QUOTES[id].ID % COLORS.length]);
}

function updateUI() {
  if(i === 1) {
    $("#leftArrow").css("visibility", "visible").hide().fadeIn("slow");
  } else if(i === 0) {
    $("#leftArrow").fadeOut("slow", function(){
      $("#leftArrow").css({"visibility": "hidden", "display": "inline"});
    });
  }
}

$(document).ready(function(){
  fetchQuote();

  $("#rightArrow").on("click", function(event){
    if(event.detail == 1){
      i++;
      if(i >= QUOTES.length - 1) fetchQuote();
      else setQuoteUI(i);
      updateUI();
    }
  });

  $("#leftArrow").on("click", function(event){
    if(event.detail == 1){
      if(i > 0) i--;
      setQuoteUI(i);
      updateUI();
    }
  });

  $("#tweet-button").on("click", function(){
    let message = $("#message").text();
    let author = $("#author").text();

    if(message.length + author.length > 280) {
      postTitle = message.substr(0, 280 - author.length - 6) + "...";
    } else {
      postTitle = message;
    }
    postTitle += "\n- " + author;
    window.open(TWEET_URL + encodeURIComponent(postTitle), "twitterwindow", height=450, width=550, 
      toolbar=0, menubar=0, directories=0, scrollbars=0);
  });
});
