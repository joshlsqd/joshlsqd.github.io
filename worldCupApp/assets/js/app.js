var homeTeam;
var fixtureDate;
var awayTeam;
var matchday;
var homeTeamGoals;
var awayTeamGoals;
var odds;


function displayFixtures() {

    // Creates AJAX call for each fixture
    $.ajax({
        headers: { 'X-Auth-Token': '532b79593e0642408603e3d7e89b525a' },
        url: 'http://api.football-data.org//v1/competitions/467/fixtures',
        dataType: 'json',
        type: 'GET',
    }).done(function(response) {
        console.log(response);
        for (var i = 0; i < response.fixtures.length; i++) {
            homeTeam = response.fixtures[i].homeTeamName;
            awayTeam = response.fixtures[i].awayTeamName;
            fixtureDate = response.fixtures[i].date.substr(0,10) + '   ';
            matchday = response.fixtures[i].matchday;
            homeTeamGoals = response.fixtures[i].result.goalsHomeTeam;
            awayTeamGoals = response.fixtures[i].result.goalsAwayTeam;
            odds = response.fixtures[i].odds;
            var fixturehtml = '';
            fixturehtml += '<li class="schedule-labels">'
            fixturehtml += '<div class="collapsible-header"><span>'+ fixtureDate +'   </span><i class="fa fa-futbol-o fixture" aria-hidden="true"></i><span class="title">' + homeTeam + ' - ' + awayTeam + '</span></div></div>'
            fixturehtml += '<div class="collapsible-body"><p> Result: '+ homeTeamGoals +' - '+ awayTeamGoals +'<br>Matchday: '+ matchday +'<br>Odds: '+ odds +'</p></div>'
            $('#fixtures').append(fixturehtml);

            // </li>
        }

    });

}

// // When the user scrolls the page, execute myFunction 
// window.onscroll = function() {myFunction()};

// // Get the navbar
// var navbar = document.getElementById("button-team");

// // Get the offset position of the navbar
// var sticky = navbar.offsetTop;

// // Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
// function myFunction() {
//   if (window.pageYOffset >= sticky) {
//     navbar.classList.add("sticky")
//   } else {
//     navbar.classList.remove("sticky");
//   }
// }


function countdown() {
    var now = new Date();
    var eventDate = new Date(2018, 5, 12, 2  );

    var currentTime = now.getTime();
    var eventTime = eventDate.getTime();

    var remTime = eventTime - currentTime;

    var s = Math.floor(remTime/ 1000);
    var m = Math.floor(s/ 60);
    var h = Math.floor(m/ 60);
    var d = Math.floor(h/ 24);

    h %= 24;
    m %= 60;
    s %= 60;

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    document.getElementById('days').innerText = d;
    document.getElementById('hours').innerText = h;
    document.getElementById('minutes').innerText = m;
    document.getElementById('seconds').innerText = s;

    setTimeout(countdown, 1000)

}
// Array of World Cup Teams
var teams = ["Argentina", "Australia", "Belgium", "Brazil","Colombia","Costa Rica","Croatia","Denmark","Egypt","England","France","Germany","Iceland","Iran","Japan","Mexico","Morocco","Nigeria","Panama","Peru","Poland","Portugal","Russia","Saudi Arabia","Serbia","Senegal","South Korea","Spain","Sweden","Switzerland","Tunisia","Uruguay"]

// newsapi.org Key = 7191270be1f245e497528ea460224750
function getVideoId(){
    $("#video-team").empty();
   
    var team = $(this).attr("team-name");
    var queryURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&q="+team+",world,cup,russia,2018&key=AIzaSyAB1tKwjBxqFW9mWA9LBeo269fjyDK9XD4"
    
    // Creating an AJAX call for the specific national team button being clicked
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(videoNews) {

        var results = videoNews.items;
        var videoId = results[0].id.videoId;
        var videoUrl = "http://www.youtube.com/embed/"+videoId;
        var videoDiv = "<iframe width='620' height='400'src='"+videoUrl+"'frameborder='0' allowfullscreen></iframe>"
        $("#video-team").html(videoDiv);

        console.log(videoId);
    });
}

function getNews(){
    $("#news-team").empty();
    var team = $(this).attr("team-name");
    var queryURL = "https://newsapi.org/v2/everything?q=" + "+"+team +",'World Cup'&sortBy=relevancy&language=en&apiKey=7191270be1f245e497528ea460224750";

    // Creating an AJAX call for the specific national team button being clicked
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(dataNews) {

        var results = dataNews.articles;
        var limit = 7;

        // Generate the HTML tags for the news section
        for (var i=0; i<limit; i++){
            var teamDiv = $("<div>");
            var teamSnippet = $("<p>");
            var teamNews = $("<a>");
            var br = $("<br>");
            teamSnippet.text(results[i].description);
            teamNews.addClass("news");
            teamNews.attr("href", results[i].url);
            teamNews.attr("target","_blank")
            teamNews.text(results[i].url);
            teamDiv.append(teamNews);
            teamDiv.append(teamSnippet);
            $("#news-team").prepend(teamDiv);

        }
    });
}

function renderButtons() {
    $("#button-team").empty();
    // Looping through the array of national teams
    for (var i = 0; i < teams.length; i++) {
        var a = $("<a></a>");
        a.addClass("country-button waves-effect waves-light btn")
        a.attr("team-name", teams[i]);
        // Providing the initial button text
        
        a.text(teams[i]);
        // Adding the button to the #button- team div        
        $("#button-team").append(a);
    }
}



renderButtons();
getVideoId();


$(document).on("click",".country-button",getNews)
$(document).on("click",".country-button",getVideoId)
// $("#news-team").empty();


countdown();
displayFixtures();