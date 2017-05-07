import { drawCharacter } from "./ts/sprite";
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
}
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
var background = new Image();
var runnerImage = new Image();
function initializeImages() {
    background.src = 'assets/desert.png';
    //runnerImage.src = 'assets/character.gif';
    background.onload = function (e:any) {
        myGameArea.start();
        draw();
    };
}
function drawBackground() {
 myGameArea.canvas.getContext("2d").drawImage(background, 0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
}

function drawRunner() {
   var context = myGameArea.canvas.getContext("2d");
   var a = 0;
  drawCharacter(myGameArea.canvas.getContext("2d"), 'assets/character.png', img_obj, transform);
}

function draw() {
   
   
    var context = myGameArea.canvas.getContext("2d");
    setInterval((function (c, i) {
                return function () {
                     context.save();
                     context.clearRect(0, 0, 800, 600);
                    drawBackground();
                    drawRunner();
                    context.restore();
                    //draw_anim(context, 0, 0, img_obj);
                };
    })(context, img_obj), 100);
    
 
}

initializeImages();