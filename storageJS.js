
playerObj = {
    name : null,
    lastScore:null
}


var arrOfPlayers = getObj();
//Get Array Of Players from LocalStorage, if Not found Set new one 
function getObj()
{
    
    var arr = localStorage.getItem("carRaceScores");
    if (arr === null)
    {
        localStorage.setItem("carRaceScores" , JSON.stringify([]));
        arr =  JSON.parse(localStorage.getItem("carRaceScores"));
    }
    else
    {
        arr =  JSON.parse(arr);
    }
    return arr;
    
}

//Set Array of players to Local storage
function storeObj(playersArr)
{
    localStorage.setItem("carRaceScores" , JSON.stringify(playersArr));
}

function getPlayer(playerName)
{
    var flag = -1;
    arrOfPlayers.forEach(element => {
        
        if(element.name === playerName)
        {
            flag =  element;
        }
            
    }); 
    return flag;
}

function setPlayer(playerName )
{
    var player = getPlayer(playerName);
    var playerObject = playerObj;
    if(player === -1)
    {
        playerObject.name = playerName;
        playerObject.lastScore = 0;
        arrOfPlayers.push(playerObject);
    }
    storeObj(arrOfPlayers);
    
}

function updateScore(playerName , score)
{

    var playersArray = arrOfPlayers;
    playersArray.forEach(element => {
        console.log(element.lastScore);
        if(element.name == playerName && element.lastScore < score)
        {
            console.log(element.name);
            element.lastScore = score;
            storeObj(playersArray);
            return;
        }
            
       }); 
    
}

function validatePlayer()
{
    var playerBox = document.getElementById("playerNamefield");
    var playerData = document.getElementById("playerData");

    var found = getPlayer(playerBox.value.toLowerCase());
    console.log(found);
    if(found != -1)
    {
        playerData.innerHTML="Play With Same Name Found !";
    }
    else 
    {
        playerData.innerHTML="New User";
    }
    
}


function newGame()
{

    
    currentPlayer = document.getElementById("playerNamefield").value.toLowerCase();
    var playerData = document.getElementById("playerData");

    if(currentPlayer == '' || currentPlayer == null)
    {
        playerData.innerHTML="Enter Valid Player Name";
        return;
    }
    
    var playerData = getPlayer(currentPlayer.toLowerCase());
    if(playerData == -1)
    {
        setPlayer(currentPlayer);
        currentScore = 0 ;
    }
    else
    {
        currentScore = 0;
    }
    // sleep(100);
    start();
}



function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}