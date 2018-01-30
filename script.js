
//x & y position of main car
var car_x_pos;
var car_y_pos ;

var car_img; //Main car img
var rand_car_img;//rand car img
var state_fire=false; //fire States "Fired or not"
var y_fire,x_fire; //x&y of fire
var y_road_v=[];
var randx=[];
var randy=[];

var isMobile; //is Device Mobile or not
var randCarCount = 3; // number of random cars generated maximum 6 , 7 will lock the road
var randCarsSpeed = 8; // speed of rand cars
var road_speed = randCarsSpeed+(randCarsSpeed*.3); //background speed
var level = 1; //Level number
var levelScore = 25 ; //Score to change level on 
var Game_over  = false;

var scorex = 0 ; //Game Score
var firex = 5; //Fire Count

//Divs for Score , Fire and Level
var scoreElem = null;
var fireElem = null;
var levelElem = null;

var rocket_img; // rocket Image

var xWidth ; //the Variable Hold the Scale of all objects on screen 

var imgs = ['images/cars/5.png' , 'images/cars/3.png' , 'images/cars/4.png' , 'images/cars/5.png' , 'images/cars/3.png' , 'images/cars/4.png' , , 'images/cars/3.png' , 'images/cars/4.png' ];
var rand_car_imgs = [] ;
var touched = false;
var startGame = false;


var screenheight ;
var screenWidth;


//Object hold Sound Data
var sounds = {
  carsong : null,
  sceneMusic : null,
  fireSound : null,
  exploSound : null
} ;


var Divs = {

  pABut : null,
  sBBut : null,
  endDivx : null,
  mainDiv :null
}



function preload(){
  //Preload Game Sounds
  sounds.carsong = loadSound('sounds/game-over.wav');
  sounds.sceneMusic = loadSound('sounds/SceneMusic.mp3');
  sounds.fireSound = loadSound('sounds/GunLuger.mp3');
  sounds.exploSound = loadSound('sounds/Explosion.mp3');
  rocket_img = loadImage('rocket.png');
  //Preload Random Car Images
  car_img=loadImage('images/carB1.png');
  imgs.forEach(element => {
    rand_car_imgs.push(loadImage(element));
  });

  screenWidth = windowWidth;
  screenheight = windowHeight

}

function setup()
{
  // gamOverDiv();
  if(document.getElementById('startButton'))
   document.getElementById('startButton').style.display="unset ";

  if(startGame == false)
  return;

  // noCanvas();
  sounds.carsong.setVolume(0.7);
  sounds.sceneMusic.setVolume(0.6);
  sounds.exploSound.setVolume(0.7);
  sounds.fireSound.setVolume(0.7);

  //Score Div
  if(scoreElem != null)
    scoreElem.remove();
  scoreElem = createDiv('Score :  0');
  scoreElem.position(20, 20);
  scoreElem.id = 'score';
  scoreElem.addClass("divx");

    //Fire Count Div
  if(fireElem != null)
    fireElem.remove();
  fireElem = createDiv('Fire :  ');
  fireElem.position(20, 60);
  fireElem.id = 'fire';
  fireElem.addClass("divx");

  //Level Div
  if(levelElem != null)
    levelElem.remove();
  levelElem = createDiv('Level :   ');
  levelElem.position(20, 100);
  levelElem.id = 'level';
  levelElem.addClass("divx");
 

  //Canvas
  var canvas = createCanvas(screenWidth,screenheight);
  noStroke();


  car_x_pos=windowWidth/2;
  isMobile=detectmob();

  //Load Collection Of cars
  for (var i = 0; i < randCarCount; i++) {
    randy[i]=windowHeight;
  }

  for (var i = -1; i<3; i++) {
      y_road_v[i+1]=(windowHeight/4*i)+(i*windowHeight/8);
  }

//Check if Device is Mobile
  if(isMobile)
    xWidth  = windowWidth/9;
  else {
    xWidth  = windowWidth/15;
  }


    car_y_pos = windowHeight-(xWidth*2); //Set Main Car y position
    state_fire = false;
    level = 1;
    firex = 5 ;
    
}


function draw(){

  //if Game not Started yet Stop drawing
  if(startGame == false)
  return;
 
 
  //if Game Over , Stop Draw loop and view Gameover Div
  if(Game_over)
  {
    noLoop() ;
    viewGameOverDiv();
    return;
  }

  //Play Scene Music
  if(!sounds.sceneMusic.isPlaying())
  sounds.sceneMusic.play();

  background(150,150,150);
  road();


  //Draw the Main Car
  image(car_img, windowWidth-car_x_pos-xWidth, car_y_pos ,xWidth,xWidth*2);

  //Generate Random Cars
  randomCars2();
  //Check if fire key pressed and Launch fire
  fire();
  //Detect Collision of Cars and Fires
  collisionDetect();


  scoreElem.html("Score : "+scorex);
  fireElem.html("Fire : "+firex);
  levelElem.html("Level :"+level);

  if(!isMobile)
    carPosition();
  else {
    carPositionMobile();
  }

}

function road(){
  for (var i = 0; i < 4; i++) {
    fill(255);
    y_road_v[i]+=road_speed;
    rect(windowWidth/3,y_road_v[i],windowWidth/50,windowHeight/4 , 10);
    rect(windowWidth*2/3,y_road_v[i],windowWidth/50,windowHeight/4 , 10);
    if(y_road_v[i]>windowHeight){
        y_road_v[i]=(-windowWidth/4);
    }
  }
}


function carPosition(){
  if(keyIsPressed){
    if(keyCode==RIGHT_ARROW){
      if(car_x_pos<10)
      return;
      car_x_pos-=10;

    }
    else if(keyCode==LEFT_ARROW){
      if(car_x_pos>windowWidth-windowWidth/13)
      return;
      car_x_pos+=10;


    }
    else if(keyCode==UP_ARROW){
      if(car_y_pos<20)
        return;
      car_y_pos-=10;

    }
    else if(keyCode==DOWN_ARROW){
      if(car_y_pos>windowHeight-(xWidth*2)-10)
        return;
      car_y_pos+=10;

    }
  }
}


function carPositionMobile(){
  car_x_pos=map(rotationY,60,-60,0,windowWidth-windowWidth/8);
  car_x_pos=constrain(car_x_pos,0,windowWidth-windowWidth/8);


  car_y_pos=map(rotationX,-40,40,0,windowHeight-xWidth*2);
  car_y_pos=constrain(car_y_pos,0,windowHeight-xWidth*2);

}

//function to handle firing
function fire() {
  if (((keyIsPressed && keyCode == 32) || mouseIsPressed ) && state_fire == false && firex > 0 && scorex > 0) {
      y_fire = car_y_pos-30;
      x_fire = windowWidth-car_x_pos-xWidth+(xWidth/3);
      state_fire = true;
      mouseIsPressed = false;
      firex--;
      sounds.fireSound.play();
  }
  else
  {
    mouseIsPressed = false;
  }
  if (state_fire) {
      moveFire();
  }
}


//function to handle the movment of the bullet fired
function moveFire() {
  if (y_fire > 0) {
      image(rocket_img, x_fire, y_fire, 20, 40);
      y_fire -= 25;
      mouseIsPressed = false;
  }
  else
  {
    state_fire = false;
    mouseIsPressed = false;
  }

}

// function to generate random cars
function randomCars2()
{
  /*
    the idea is to divide the screen into cols and rows 7 cols ,3 rows
    get random variables of x and y for each car
    x value must not be the same for 2 cars
    to ensure that they dont overlap
    then we increment the y value of this car to give the effect of motion
    until y value of all random cars reach the bottom of the car
  */
  var col=windowWidth/8;
  var col_diff=width/(8*7)
  var row=windowHeight/4;
  var state_frame=true;
  var x,y;
  var gridx=[0,col+col_diff,(col+col_diff)*2,(col+col_diff)*3,(col+col_diff)*4,(col+col_diff)*5,(col+col_diff)*6];//cols
  var gridy=[-row,-row*2,-row*3,-row,-row*5,-row*6];//rows
//check if all cars have reached the bottom of the screen
  for (var j = 0; j < randCarCount; j++) {
    if(randy[j]<windowHeight){
      state_frame=false;

    }


  }




  for (var i = 0; i < randCarCount; i++) {
//generate new random numbers of x and y values of random cars
  if(state_frame){
      //Update Game Score and Level
      //Score Increase by the Number of Cars When all car reach end of Screen
      //Level Increase every 25 Score point
      //Cars Count increase By 1 car each level with limit of 6 cars
      //Fire Count Increase by 1 Every 10 Score Point
      scoreCalc();
      x=Math.floor(random(0,1)*gridx.length);//generate random x
      randx[i]=gridx[x];//get random position from gridx with x index
      gridx.splice(x,1);// remove this item from array to ensure that position is not choosen twice

      y=Math.floor(random(0,1)*gridy.length);
      randy[i]=gridy[y];
      gridy.splice(y,1);
      console.log(randy);
}
    // image(rand_car_img, randx[i], randy[i], windowWidth/9, windowHeight/4);
    image(rand_car_imgs[i], randx[i], randy[i], xWidth , xWidth*2 );


    randy[i]+=randCarsSpeed;
}

}
function detectmob() {
  //Testing Return
  // return !navigator.platform == 'Win32';
  if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}


function scoreCalc()
{
  scorex+=1;
    if(scorex % 10 == 0)
    {
      if(firex < 5 )
      {
        firex+=1;
      }
    }
    if(scorex % levelScore == 0)
      {
        console.log("Calc Score");
        level++;
        console.log(level);
        randCarsSpeed = randCarsSpeed + level;
        road_speed = randCarsSpeed + (randCarsSpeed*.3);
        levelScore = levelScore+25;
        if(randCarCount <=6)
          randCarCount++;
      }
      if(level > 7)
        Game_over = true;
}

function collisionDetect() {

  var myleft = car_x_pos;
  var myright = car_x_pos + xWidth;
  var mytop = car_y_pos;
  var mybottom = car_y_pos + (xWidth * 2);

  for (var i = 0; i < randy.length; i++) {
      var acc = (windowWidth - randx[i]) - xWidth;
      var otherleft = acc;
      var otherright = acc + xWidth;
      var othertop = randy[i];
      var otherbottom = randy[i] + xWidth * 2;

      var y_rocket = Math.trunc(y_fire)
      var x_rocket = Math.trunc(x_fire)
      var carWidth = randx[i] + xWidth;
      var carHeight = randy[i] + (xWidth * 2);


    //fireCollision Detection 
      if (x_rocket+20 >= randx[i] && x_rocket <= carWidth && y_rocket >= randy[i] && y_rocket <= carHeight & state_fire == true) {
          state_fire = false;
          randy[i] = windowHeight + 1;
          scorex++;
          sounds.exploSound.play();

      }
      //Cars Collision Detection 
     
      if (mybottom <= othertop || mytop > otherbottom-(xWidth*2)*0.09 || myright-10 <= otherleft || myleft >= otherright) {
          Game_over = false;
      }
      else {

          Game_over = true;
          sounds.carsong.play();
          sounds.sceneMusic.stop();
          return;
      }
     
  }
}


function loopit(event)
{
  if(event.keyCode ==ESCAPE && Game_over == true)
  {
    resetAttr();
    setup();
    console.log("Loop");
    loop();
  }
}


function start()
{
    //Method Starts The Game
    startGame = true;
    resetAttr();
    setup();
    draw();
    document.getElementById('GameBody').removeChild(document.getElementById('Data'));
    document.getElementById('GameBody').style.backgroundImage = "none";
    loop();
}

function reStart()
{
  //Method Restart Game When "Play Again"
  resetAttr();
  setup();
  randCarCount = 3;
  randCarsSpeed = 8;
  loop();
}

//Reset Attributes
function resetAttr()
{
scorex = 0;
firex = 0 ;
levelScore = 25;
Game_over = false;
level = 1;
hideGameOverDiv();
}


function gamOverDiv()
{
 updateScore(currentPlayer , scorex);
 var modal = document.getElementById('myModal');
 modal.style.display = "block";
 document.getElementById('ScoreP').innerHTML = "Score is "+scorex;
 document.getElementById('ScoreP').style.color= "white";
//if you want to paly again.........
var play = document.getElementById("playAgain");
play.onclick = function() {
    modal.style.display = "none";
    reStart();
   }
}

function viewGameOverDiv(){
 gamOverDiv();

}

function hideGameOverDiv()
{
  Divs.endDivx = null;
}

function openScoreboard()
{
  window.location.href = "Scoreboard";
}



// How to play ................
function HowPlay(){
  // Get the modal
  var modal = document.getElementById('myModal2');
       modal.style.display = "block";


  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close2")[0];



  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }

}
