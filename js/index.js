var colorsRYB = ["#FE2712", "#FC600A", "#66B032", "#0080FF", "#347C98", "#0247FE",
 "#4424D6", "#8601AF", "#C21460", "#333333"];
var i = 0;
var quotes = [];

$.ajaxSetup({
  cache: false,
});

function getNewQuote(id, success){
  return $.getJSON("https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1",
    function(quote){
      quotes.push(quote[0]);
      setQuote(id);
  })
  .done(function(){ if(success !== undefined) success(); })
  .fail(function(){ //alert("Could not retrieve a new quote. Please check your internet connection.")
});
}

function setQuote(id){
  $('#message').fadeOut(500, function(){
    $(this).html(quotes[id].content).fadeIn(500);
  });
  $('#author').fadeOut(500, function(){
    $(this).html(quotes[id].title).fadeIn(500);
  });
  changeBackground(id);
}

function changeBackground(id){
  var html = document.getElementsByTagName('html')[0];
  html.style.setProperty("--main-color", colorsRYB[quotes[id].ID % colorsRYB.length]);
}

$(document).ready(function(){
  getNewQuote(i);

  $("#rightArrow").on("click", function(event){
    function success(){
      i++;
      if(i === 1)
        $("#leftArrow").css("visibility", "visible").hide().fadeIn("slow");
    }

    if(event.detail == 1){
      if(i >= quotes.length - 1){
        getNewQuote(i + 1, success);
      } else {
        setQuote(i + 1);
        success();
      }
    }
  });

  $("#leftArrow").on("click", function(event){
    if(event.detail == 1){
      if(i >= 1) i--;
      setQuote(i);

      if(i === 0) {
        $("#leftArrow").fadeOut("slow", function(){
          $("#leftArrow").css({"visibility": "hidden", "display": "inline"});
        });
      }
    }
  });

  $("#tweet-button").on("click", function(){
    var message = $("#message").text();
    var author = $("#author").text();
    if(message.length + author.length > 280) {
      postTitle = message.substr(0, 280 - author.length - 6) + "...";
    } else {
      postTitle = message;
    }
    postTitle += "\n- " + author;
    window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(postTitle),
    "twitterwindow", height=450, width=550, toolbar=0, menubar=0, directories=0, scrollbars=0);
  });
});
