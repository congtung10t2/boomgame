///<reference path='./ts/tile.ts' />
import { drawCharacter } from "./ts/sprite";
import { setOnDownCallback } from "./ts/input";
import { setOnUpCallback } from "./ts/input";
import { getKeyDir } from "./ts/input";
import { initTile } from "./ts/tile";
import { OrthogonalMap } from "./ts/tile";
import { drawExplosion } from "./ts/explosion";
import { exlosion } from "./ts/explosion";
import { getExplosion } from"./ts/explosion";
import { setMapData } from "./ts/explosion";

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
}


// Map tile data
var mapData = [
  [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 2, 0, 0, 0],
  [0, 2, 0, 2, 0, 2, 1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0],
  [1, 1, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 2, 1, 2, 0, 0],
  [0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0],
  [1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 3, 0],
  [1, 2, 0, 2, 3, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0],
  [0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0],
  [0, 2, 0, 2, 0, 1, 0, 2, 0, 2, 0, 1, 0, 2, 0, 1, 2, 1, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 0, 1, 0, 2, 0, 2, 0, 1, 0, 2],
  [0, 1, 0, 2, 0, 1, 0, 2, 0, 2, 0, 2, 0, 2, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 0, 1, 0, 0, 0, 3, 1, 0, 1, 1, 1, 1, 1, 2, 0, 0, 0],
  [0, 2, 0, 2, 0, 2, 1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1],
  [0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 2, 1, 2, 0, 0],
  [0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0],
  [1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 3],
  [1, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0]
]
const TILE_SIZE = 40;


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
            booms.push({boom:boom, time:30, x: Math.round(transform.x/TILE_SIZE)*TILE_SIZE, y: Math.round(transform.y/TILE_SIZE)*TILE_SIZE});
            canSetBoom = false;
             var alarm = setTimeout(function(){
                canSetBoom = true;
            }, 500);
        }
    }
}

var onUp = function (key:any){
    
}

var explosionCell = new Image();

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
    transform.y += transform.vspeed;
    transform.x += transform.hspeed;
    var index = 0;
    booms.forEach(element => {
        element.time -= 1;
        if(element.time <= 0){
            exlosion(myGameArea.canvas, Math.round(element.x/40), Math.round(element.y/40));
            booms.splice(index, 1);
            
        }
        index++;
    });
    getExplosion().forEach(element => {
        if(element.x >=0 && element.y >=0 && element.x < mapData[0].length && element.y < mapData.length){
            if( mapData[element.y][element.x] != 2){
                mapData[element.y][element.x]  = 0;
            }
            var index = 0;
            booms.forEach(boom => {
                if(Math.round(boom.x/40) == element.x && Math.round(boom.y/40) == element.y){
                    exlosion(myGameArea.canvas, element.x, element.y);
                    booms.splice(index, 1);
                    
                }
                index++;
            });
        }
        
    });

    
}

var runnerImage = new Image();
var boom = new Image();
var map:OrthogonalMap;
async function initializeImages() {
    myGameArea.start();
    var load = initTile().then(function(count){
        map = new OrthogonalMap(myGameArea.canvas, mapData, { tileSize: TILE_SIZE })
    }).catch(function(reason){
            console.log(reason);
    })
    var val = await load;
    setMapData(mapData);
    explosionCell.src = 'assets/fire.png';
    boom.src = 'assets/bomb.png'
    boom.onload = function (e:any) {
        
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

function drawRunner() {
   var context = myGameArea.canvas.getContext("2d");
   var a = 0;
  drawCharacter(myGameArea.canvas.getContext("2d"), 'assets/character.png', img_obj, transform);
}


function onDraw() {
   
   var context = myGameArea.canvas.getContext("2d");
    
    context.save();
    context.clearRect(0, 0, 800, 600);
    map.draw();
    drawExplosion(explosionCell);
    booms.forEach(element => {
        myGameArea.canvas.getContext("2d").drawImage(element.boom, element.x, element.y, 32, 32);
    });
    drawRunner();
    
    context.restore();
}

initializeImages();