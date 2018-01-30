var players;
var timerId;
var updateInterval = 1000;
function JsonObject(name , lastScore)
{
    this.name = name;
    this.lastScore = score;
}

function descending(a, b) 
{
    return a.score < b.score ? 1 : -1; 
}

function reposition() {
    var height = $("#leaderboard .header").height();
    var y = height;
    for(var i = 0; i < players.length; i++) {
        players[i].$item.css("top", y + "px");
        y += height;            
    }
}
            
function updateBoard() {
    var player = getRandomPlayer(); 
    
    player.$item.find(".score").text(player.score);
    
    players.sort(descending);
    updateRanks(players);
    reposition();

}


function getRandomPlayer() {
    var index = getRandomBetween(0, players.length);
    return players[index];
}


function getRandomBetween(minimum, maximum) {
     return Math.floor(Math.random() * maximum) + minimum;
}

function updateRanks(players) {
    for(var i = 0; i < players.length; i++) {
        players[i].$item.find(".rank").text(i + 1); 
    }
}


function resetBoard() {
    var $list = $("#players");
    
    $list.find("li.player").remove();
    if(timerId !== undefined) {
        clearInterval(timerId);
    }

    players = JSON.parse(localStorage.getItem('carRaceScores'));
    if(players === null)
    return;
    for(var i = 0; i < players.length; i++) {
        var $item = $(
            "<li class='player'>" + 
                "<div class='rank'>" + (i + 1) + "</div>" + 
                "<div class='name'>" + players[i].name + "</div>" +
                "<div class='score'>" + players[i].lastScore + "</div>" +
            "</li>");
        players[i].$item = $item;
        $list.append($item);
    }
    
    timerId = setInterval("updateBoard();", updateInterval);
    
    reposition();
}   

resetBoard();
