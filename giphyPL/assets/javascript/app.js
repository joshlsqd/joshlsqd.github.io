var searchTopics = ['Arsenal' , 'Bournemouth' , 'Brighton & Hove Albion' , 'Burnley' , 'Chelsea' , 'Crystal Palace' , 'Everton' , 'Huddersfield Town' , 'Leicester City' , 'Liverpool' , 'Manchester City' , 'Manchester United' , 'Newcastle United' , 'Southampton' , 'Stoke City' , 'Swansea City' , 'Tottenham Hotspur' , 'Watford' , 'West Bromwich Albion' , 'West Ham United'];
var searchTopic = "Tottenham Hotspur";
var apiKey = "FxJ5CJ4D8qcg50KUxT0O8ZCZadmWEWX6";
var url = "http://api.giphy.com/v1/gifs/search?q=" + searchTopic + "&api_key=" + apiKey + "&limit=10";
var giphy;



$(document).ready();

function createSearchButtons() {
    $('#topicButtons').empty();
    for (var i = 0; i < searchTopics.length; i++) {
        var searchTopicButton = $("<button>");
        $(searchTopicButton).attr('data',searchTopics[i]);
        $(searchTopicButton).attr('class','btn btn-info topics');
        $(searchTopicButton).text(searchTopics[i]);
        $('#topicButtons').append(searchTopicButton);
    };
};

createSearchButtons();
    

$(document).on("click", ".topics", function() {
    $('.row').empty();
    searchTopic = $(this).attr('data');
    console.log(searchTopic);
    url = "http://api.giphy.com/v1/gifs/search?q=" + searchTopic + "&api_key=" + apiKey + "&limit=10";
    giphySearch();
});

$(document).on("click",".giphyImage", function() {
    var newImage = $(this).attr('data');
    var oldImage = $(this).attr('src');
    console.log(newImage);
    var giphy = $('<img>');
    $(giphy).attr('class', 'giphy')
    $(giphy).attr('src',newImage);
    $(giphy).attr('data',oldImage);
    $(this).replaceWith(giphy);
});

$(document).on("click",".giphy", function() {
    var newImage = $(this).attr('data');
    var oldImage = $(this).attr('src');
    console.log(newImage);
    var giphyImage = $('<img>');
    $(giphyImage).attr('class', 'giphyImage')
    $(giphyImage).attr('src',newImage);
    $(giphyImage).attr('data',oldImage);
    $(this).replaceWith(giphyImage);
});

$('#go').click(function() {
    var newTopic = $('#giphySearch').val();
    searchTopics.push(newTopic);
    createSearchButtons();
});

function giphySearch() {

	$.ajax({

	  url: url,
	  method: 'GET',
	}).done(function(results) {
        var giphySearchResults =  results.data;
        console.log(giphySearchResults);
        for (var i = 0; i < giphySearchResults.length; i++) {
            var giphyBox = $('<div>');
            $(giphyBox).attr('class','col-md-4 col-sm-6');
            var giphyThumbnail = $('<div>');
            $(giphyThumbnail).attr('class','thumbnail');
            var giphyImg = $('<img>');
             $(giphyImg).attr('class', 'giphyImage')
            $(giphyImg).attr('src',giphySearchResults[i].images.fixed_height_still.url);
            $(giphyImg).attr('data',giphySearchResults[i].images.original.url);
            var giphyRating = $('<label>');
            $(giphyRating).text('Rating: ' + giphySearchResults[i].rating);    
            $(giphyBox).append(giphyThumbnail);
            $(giphyThumbnail).append(giphyImg);
            $(giphyThumbnail).append(giphyRating);
            $('.row').append(giphyBox);

            // giphySearchResults[i]
        }
    });

}


// var xhr = $.get("http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=FxJ5CJ4D8qcg50KUxT0O8ZCZadmWEWX6&limit=5");
// xhr.done(function(data) { console.log("success got data", data); });