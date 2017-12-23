var config = {
    apiKey: "AIzaSyD3G9M4Nx5kfizHAGQkyW78EbnSJYj5bSU",
    authDomain: "rpscalvinhobbes.firebaseapp.com",
    databaseURL: "https://rpscalvinhobbes.firebaseio.com",
    projectId: "rpscalvinhobbes",
    storageBucket: "rpscalvinhobbes.appspot.com",
    messagingSenderId: "906369276318"
};
firebase.initializeApp(config);

var database = firebase.database();

var currentUser;
var turn;

var calvin = {
    play: 0,
    won: 0,
    winPct: 0,
    lost: 0,
    image: 'assets/images/calvin.jpg',
    playImage: 'assets/images/question.png',
    isPicked: false
};
var hobbes = {
    play: 0,
    won: 0,
    winPct: 0,
    lost: 0,
    image: 'assets/images/hobbes.jpg',
    playImage: 'assets/images/question.png',
    isPicked: false
};


startGame();

$('.ui.basic.modal').modal({
    closable : false,
    onApprove : function() {
        if (calvin.isPicked) {
            window.alert('Sorry Calvin has already been picked');
            return false
        } else {
            calvin.isPicked = true;
            database.ref('calvin').update({ isPicked: calvin.isPicked});
            $('#calvinButtons').addClass('pickedLeft');
            $('#hobbesButtons').empty();
            currentUser = 'Calvin';
        }
    },
    onDeny : function() {
        if (hobbes.isPicked) {
            window.alert('Sorry Hobbes has already been picked');
            return false
        } else {
            hobbes.isPicked = true;
            database.ref('hobbes').update({ isPicked: hobbes.isPicked});
            $('#hobbesButtons').addClass('pickedRight');
            $('#calvinButtons').empty();
            currentUser = 'Hobbes';
        }
    }
})
    .modal('show');

database.ref().on("value", function(snapshot) {
    if (snapshot.child("posts").exists()) {
        $('#chatTable').empty();
        var postsRef = database.ref('posts');
        postsRef.on('child_added', function (snap) {
            console.log("added", snap.val());
            $('#chatTable').append(postHtmlFromObject(snap.val()));
        });

        function postHtmlFromObject(post) {
            var html = '';
            html += '<tr>';
            html += '<td><h4 class="ui image header"><img src="' + post.authorPic + '" class="ui mini rounded image"><div class="content">' + post.author + '</div></h4></td>';
            html += '<td>' + post.body + '</td>';
            html += '</tr>';
            return html;
        };
    }
});

database.ref().on("value", function(snapshot) {
    if (snapshot.child("calvin").exists() && snapshot.child("hobbes").exists()) {
        calvin.won = snapshot.val().calvin.won;
        calvin.lost = snapshot.val().calvin.lost;

        hobbes.won = snapshot.val().hobbes.won;
        hobbes.lost = snapshot.val().hobbes.lost;

        updateStats();
    }
});

database.ref().on("value", function(snapshot) {
    if (snapshot.val().hobbes.play > 0 && snapshot.val().calvin.play > 0 && turn === 1) {
        turn = 0;
        database.ref().update({turn: turn});
        gameWinner();
        updateStats();
        resetGame();
    }
});

database.ref().on("value", function(snapshot) {
    if(snapshot.val().hobbes.play > 0 && snapshot.val().calvin.play > 0){
        calvin.playImage = snapshot.val().calvin.playImage;
        hobbes.playImage = snapshot.val().hobbes.playImage;
        $('#calvinPlayed').attr('src', calvin.playImage);
        $('#hobbesPlayed').attr('src', hobbes.playImage);
    }
});


$('input[type=\'text\'').keypress(function(event) {
    if (event.which === 13) {
        var body = $(this).val();
        $(this).val(' ');
        writeNewPost(currentUser,"assets/images/" + currentUser + ".jpg",body);
    }
});

function writeNewPost(username, picture, body) {
    // A post entry.
    var postData = {
        author: username,
        body: body,
        authorPic: picture
    };

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('posts').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + username + '/' + newPostKey] = postData;

    return firebase.database().ref().update(updates);
}

$('.calvin').on('click', function() {
    if(calvin.play === 0) {
        calvin.play = $(this).data('id');
        calvin.playImage = $(this).data('image');
        $('#calvinPlayed').attr('src', calvin.playImage);
        database.ref('calvin').update({ playImage: calvin.playImage});
        database.ref('calvin').update({ play: calvin.play});
        database.ref('hobbes').on('value', function(snapshot) {
            hobbes.play = snapshot.val().play;
            hobbes.playImage = snapshot.val().playImage;
        });
        $('#hobbesPlayed').attr('src', hobbes.playImage);
        turn = 1;
        database.ref().update({ turn: turn});
    }
});

$('.hobbes').on('click', function() {
    if(hobbes.play === 0) {
        hobbes.play = $(this).data('id');
        hobbes.playImage = $(this).data('image');
        $('#hobbesPlayed').attr('src', hobbes.playImage);
        database.ref('hobbes').update({ playImage: hobbes.playImage});
        database.ref('hobbes').update({ play: hobbes.play});
        database.ref('calvin').on('value', function(snapshot) {
            calvin.play = snapshot.val().play;
            calvin.playImage = snapshot.val().playImage;
        });
        $('#calvinPlayed').attr('src', calvin.playImage);
        turn = 1;
        database.ref().update({ turn: turn});
    }
});


function gameWinner() {
    if(calvin.play == 1) {
        if(hobbes.play == 1) {
            $('#wlt').text('This is a tie, lame ');
        } else if(hobbes.play == 2) {
            hobbesWins();
        } else if(hobbes.play == 3) {
            calvinWins();
        }
    } else if (calvin.play == 2) {
        if(hobbes.play == 2) {
            $('#wlt').text('This is a tie, lame ');
        } else if(hobbes.play == 3) {
            hobbesWins();
        } else if(hobbes.play == 1) {
            calvinWins();
        }
    } else if (calvin.play == 3) {
        if (hobbes.play == 3) {
            $('#wlt').text('This is a tie, lame ');
        } else if (hobbes.play == 1) {
            hobbesWins();
        } else if (hobbes.play == 2) {
            calvinWins();
        }
    }
}

function calvinWins() {
    $('#wlt').text('Calvin Wins! ');
    calvin.won += 1;
    database.ref('calvin').update({ won: calvin.won});
    hobbes.lost += 1;
    database.ref('hobbes').update({ lost: hobbes.lost});
}

function hobbesWins() {
    $('#wlt').text('Hobbes Wins! ');
    hobbes.won += 1;
    database.ref('hobbes').update({ won: hobbes.won});
    calvin.lost += 1;
    database.ref('calvin').update({ lost: calvin.lost});
}

function updateStats() {
    calvin.winPct = Math.round((calvin.won / (calvin.won + calvin.lost))*100);
    hobbes.winPct = Math.round((hobbes.won / (hobbes.won + hobbes.lost))*100);

    $("#calvinWon").text(calvin.won);
    $("#calvinLost").text(calvin.lost);
    $("#calvinWinPct").text(calvin.winPct);

    $("#hobbesWon").text(hobbes.won);
    $("#hobbesLost").text(hobbes.lost);
    $("#hobbesWinPct").text(hobbes.winPct);
}

function resetGame() {

    $('#wlt').append('<button class="ui secondary button" id="reset"><i class="add circle icon"></i> Play Again?</button>');
    $('#reset').on('click', function() {
        startGame();
        $('#calvinPlayed').attr('src', calvin.playImage);
        $('#hobbesPlayed').attr('src', hobbes.playImage);
        $('#wlt').empty();
    });
}

function resetRPS() {
    database.ref('hobbes').set({
        won: 0,
        lost: 0
    });
    database.ref('calvin').set({
        lost: 0,
        won: 0
    });
}

function startGame() {
    calvin.play = 0;
    calvin.playImage = 'assets/images/question.png';
    hobbes.play = 0;
    hobbes.playImage = 'assets/images/question.png';
    database.ref('calvin').update({ play: 0});
    database.ref('calvin').update({ playImage: 'assets/images/question.png'});
    database.ref('hobbes').update({ play: 0});
    database.ref('hobbes').update({ playImage: 'assets/images/question.png'});
}