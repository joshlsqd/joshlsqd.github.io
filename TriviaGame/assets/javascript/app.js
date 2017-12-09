var time = 30;
var timeLeft = 0;
var counter;
var clockRunning = false;
var totalQuestions = 5;
var correctAnswers = 0;
var incorrectAnswers = 0;
var questionsAsked = 0;
var answers = [];
var correct = '';
var questions =  [
{ID: 0,
Question: 'Which religious leader was assassinated on 4th April, 1968?',
wrong1: ' Jesse Jackson',
answer: 'Martin Luther King',
wrong2: ' Mother Theresa',
wrong3: ' Pope Paul',
tidbit: 'King was shot by James Earl Ray',
},
{ID: 1,
Question: 'What mode of transport did Thor Heyerdahl use to cross the South Pacific in 1947?',
wrong1: ' Hot air balloon',
wrong2: ' Hovercraft',
answer: 'Raft',
wrong3: ' Rubber dinghy',
tidbit: 'Heyerdahl used a primitive raft called "Kon Tiki"',
},
{ID: 2,
Question: 'Which two countries fought at the Battle of Agincourt, 1415?',
answer: ' England and France',
wrong1: ' England and Spain',
wrong2: ' France and Netherlands',
wrong3: ' France and Prussia',
tidbit: 'Air plant 3 wolf moon bicycle rights cardigan drinking vinegar kinfolk chartreuse meditation yuccie vaporware iPhone banh mi master cleanse echo park stumptown. +1 sustainable DIY, activated charcoal man braid bitters health goth leggings banjo YOLO selfies. Fingerstache wayfarers tattooed, coloring book snackwave DIY blog trust fund. ',
},
{ID: 3,
Question: 'Which trade union was led by the Pole, Lech Walesa in the 1980s?',
answer: 'Solidarity',
wrong1: ' Solidity',
wrong2: ' Union of Gdansk Dockers',
wrong3: ' Union of Polish Dockworkers',
tidbit: 'Quinoa seitan franzen, farm-to-table gastropub disrupt 3 wolf moon hoodie PBR&B etsy street art. Leggings VHS narwhal direct trade pinterest slow-carb mlkshk ugh jianbing selfies. Affogato pinterest listicle, bitters craft beer vaporware activated charcoal iceland paleo sriracha.',
},
{ID: 4,
Question: 'What nationality was the philosopher and mathematician, Pythagoras?',
wrong1: ' Persian',
wrong2: ' Roman',
wrong3: ' Trojan',
answer: 'Greek',
tidbit: 'Migas subway tile scenester etsy twee forage. Organic snackwave hammock craft beer polaroid single-origin coffee. Taxidermy narwhal vaporware, actually vinyl unicorn vape poke typewriter sartorial flannel. ',
}];


function loadPage() {
	$('#timer').append('<button class=\"btn btn-primary btn-lg active startGame\">Start Game</button>');
	$('#question').append('<div><img class="firstImage" src=\"https://images.unsplash.com/photo-1492834697013-e15d0246b682?auto=format&fit=crop&w=1950&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D\"></div>');
};	

loadPage();

$(document).on("click", ".startGame", displayTimerQuestion);
$(document).on("click", ".answerButton", answerQuestion);

function displayTimer() {
	$('#timer').append('<p class="bg-success"><span class="glyphicon glyphicon-time time" aria-hidden="true"></span></p>');
};

function startTimer() {
	
	time = time -1;
  	if (time <= 0)
  	{
     clearInterval(counter);
     clockRunning = false;
     answerQuestion();
     return;
  	}
  	$('.time').text(' ' + time + ' seconds left');		
};

function showQuestion() {
	$('#question').append('<h4 class="question"> Q:' + questions[questionsAsked].Question + '</h4>');
	answers = [];
	answers.push(questions[questionsAsked].wrong1);
	answers.push(questions[questionsAsked].wrong2);
	answers.push(questions[questionsAsked].wrong3);
	answers.push(questions[questionsAsked].answer);
	answers = shuffle(answers);
	for (var i = 0; i < answers.length; i++) {
		var a = $("<button>");
		a.addClass("btn btn-primary btn-lg btn-block answerButton");
		a.attr("data",answers[i]);
		a.attr("type","button");
		a.text(answers[i]);	
		$('#answer').append(a);
	};
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function displayTimerQuestion() {
	$('#timer').empty();
	$('#question').empty();
	$('#answer').empty();
	time = 30;
	counter=setInterval(startTimer, 1000);
	startTimer();
	displayTimer();
	showQuestion();
};

function stopTimer() {
	clearInterval(counter);
	timeLeft = time;
	console.log(timeLeft);
	$('#timer').empty();
	displayTimer();
	$('.time').text(' ' + timeLeft + ' seconds left');	
};

function checkAnswer() {
		if (correct == questions[questionsAsked].answer) {
		$('#question').append('<h6>Impressive, you are correct</h6>');
		questionsAsked = questionsAsked + 1;
		correctAnswers = correctAnswers + 1;
	} else {
		$('#question').append('<h6>Sooo wrong haha!</h6>');
		questionsAsked = questionsAsked + 1;
		incorrectAnswers = incorrectAnswers + 1;
	}
};

function showCorrectAnswer() {
	$('#answer').empty();
	$('#answer').append('<h6>The correct answer is ' + questions[questionsAsked-1].answer + '</h6>');
	$('#answer').append('<p>' + questions[questionsAsked-1].tidbit + "</p>");
};
function wait() {
	if (questionsAsked === totalQuestions) {
		displayStats();
	} else {
	setTimeout(displayTimerQuestion, 1000 * 5);
	};
};

function answerQuestion() {
	correct = $(this).attr("data");
	stopTimer();
	checkAnswer();
	showCorrectAnswer();
	wait();
};

function displayStats() {
	$('#timer').empty();
	$('#timer').append('<h4 class="finished">Finished! Your Stats are below</h4>');
	$('#timer').append('<h4 class="finished">Correct Answers: ' + correctAnswers +'</h4>');
	$('#timer').append('<h4 class="finished">Incorrect Answers: ' + incorrectAnswers +'</h4>');
	$('#timer').append('<button class=\"btn btn-primary btn-lg active startGame\">Start New Game</button>');
	correctAnswers = 0;
	incorrectAnswers = 0;
	questionsAsked = 0
}