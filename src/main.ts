import { drawCharacter } from "./ts/sprite";
import { setOnDownCallback } from "./ts/input";
import { setOnUpCallback } from "./ts/input";
import { getKeyDir } from "./ts/input";
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
}
var booms = new Array();
var canSetBoom = true;
var img_obj = {
    'source': null,
    'current': 0,
    'total_frames': 4,
    'direction':0,
    'origin':1,
    'width': 48,
    'height': 48
};
var transform = {
    'x':0,
    'y':0,
    'hspeed': 0,
    'vspeed':0
}

var maxBoom = 10;

var onDown = function (key:any){
    if(key == "space"){
        if(booms.length < maxBoom && canSetBoom){
            booms.push({boom:boom, time:30, x: transform.x, y: transform.y});
            canSetBoom = false;
             var alarm = setTimeout(function(){
                canSetBoom = true;
            }, 500);
        }
    }
}

var onUp = function (key:any){
    
}

function onUpdate(){
    if((getKeyDir() & 1) != 0){
        transform.hspeed = -5;
        img_obj.origin = 1;
    } else if((getKeyDir() & 4) != 0){
        transform.hspeed = 5;
        img_obj.origin = 3;
    }
    else {
            transform.hspeed = 0;
    }
    if((getKeyDir() & 2) != 0){
        transform.vspeed = -5;
        img_obj.origin = 2;
    }
    
    else if((getKeyDir() & 8) != 0){
        transform.vspeed = 5;
        img_obj.origin = 0;
    } else {
        transform.vspeed = 0;
    }
    var index = 0;
    booms.forEach(element => {
        element.time -= 1;
        if(element.time <= 0){
            booms.splice(index, 1);
        }
        index++;
    });
}

var background = new Image();
var runnerImage = new Image();
var boom = new Image();

function initializeImages() {
    background.src = 'assets/desert.png';
    boom.src = 'assets/bomb.png'
    background.onload = function (e:any) {
        myGameArea.start();
        setOnDownCallback(onDown);
        setOnUpCallback(onUp);
        loop()
    };
}
function loop(){

    setInterval(function () {
                    onUpdate();
                    onDraw();
    }, 100);
}
function drawBackground() {
 myGameArea.canvas.getContext("2d").drawImage(background, 0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
}

function drawRunner() {
   var context = myGameArea.canvas.getContext("2d");
   var a = 0;
  drawCharacter(myGameArea.canvas.getContext("2d"), 'assets/character.png', img_obj, transform);
}


function onDraw() {
   
   var context = myGameArea.canvas.getContext("2d");
    
    context.save();
    context.clearRect(0, 0, 800, 600);
    drawBackground();
    booms.forEach(element => {
        myGameArea.canvas.getContext("2d").drawImage(element.boom, element.x, element.y, 32, 32);
    });
    drawRunner();
    
    context.restore();
}

initializeImages();