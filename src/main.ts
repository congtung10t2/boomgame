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
import { collide } from "./ts/collision";
import { TILE_TYPES } from "./ts/tile";
import { clearExplosion } from "./ts/explosion";

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
}
var map:OrthogonalMap;

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
    'vspeed':0,
    'moving':false
}

var live = 3;
var isNoDieMore = true;
var maxBoom = 10;

var onDown = function (key:any){
    if(key == "space"){
        if(booms.length < maxBoom && canSetBoom){
            booms.push({boom:boom, time:30, x: Math.round(transform.x/TILE_SIZE)*TILE_SIZE, y: Math.round(transform.y/TILE_SIZE)*TILE_SIZE});
            map.setSolid(true, Math.round(transform.x/TILE_SIZE), Math.round(transform.y/TILE_SIZE));
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

function isCollideAtPos(x:any, y:any){
    var check = false;
    map.tiles.forEach(element=>{
        element.forEach(tile =>{
            if(tile.getType() == TILE_TYPES[1] || tile.getType() == TILE_TYPES[2]) 
            if(collide({x:x+5, y:y+5, width:30, height:35}, {x:tile.xPos, y:tile.yPos, width:TILE_SIZE, height:TILE_SIZE})){
                check = true;
                return;
            }
        });
        if(check == true)
            return;
    });
    return check;
}

function onUpdate(){
    if((getKeyDir() & 1) != 0){
        transform.hspeed = -5;
        img_obj.origin = 1;
        transform.moving = true;
        if(transform.x + transform.hspeed <= -10){
                transform.hspeed = 0;
                transform.x = -10;
        } 
        if(isCollideAtPos(transform.x + transform.hspeed, transform.y)){
                transform.hspeed = 0;
        }
        
        
    } else if((getKeyDir() & 4) != 0){
        transform.hspeed = 5;
        img_obj.origin = 3;
        transform.moving = true;
        if(transform.x + transform.hspeed >= 755){
                transform.hspeed = 0;
                transform.x = 755;
        }
        if(isCollideAtPos(transform.x + transform.hspeed, transform.y)){
            transform.hspeed = 0;
        }
    }
    else {
            transform.hspeed = 0;
    }
    if((getKeyDir() & 2) != 0){
        transform.vspeed = -5;
        img_obj.origin = 2;
        transform.moving = true;
        if(transform.y + transform.vspeed <= -10){
                transform.vspeed = 0;
                transform.y = -10;
        }
        if(isCollideAtPos(transform.x, transform.y + transform.vspeed)){
            transform.vspeed = 0;
        }
    }
    
    else if((getKeyDir() & 8) != 0){
        transform.vspeed = 5;
        img_obj.origin = 0;
        transform.moving = true;
        if(transform.y + transform.vspeed >= 560){
                transform.vspeed = 0;
                transform.y = 560;
        }
        if(isCollideAtPos(transform.x, transform.y + transform.vspeed)){
            transform.vspeed = 0;
        } 
    } else {
        transform.vspeed = 0;
        transform.moving = false;
    }
    
    transform.y += transform.vspeed;
    transform.x += transform.hspeed;
    map.updateEnemy();
    var index = 0;
    booms.forEach(element => {
        element.time -= 1;
        if(element.time <= 0){
            exlosion(myGameArea.canvas, Math.round(element.x/40), Math.round(element.y/40));
            map.setSolid(false, Math.round(element.x/TILE_SIZE), Math.round(element.y/TILE_SIZE));
            booms.splice(index, 1);
            
        }
        index++;
    });
    if(map.enemiesCollideAt(Math.round(transform.x/40), Math.round(transform.y/40))){
        onDead();
        return;
    }
    getExplosion().forEach(element => {
        if(element.x >=0 && element.y >=0 && element.x < mapData[0].length && element.y < mapData.length){
            if( mapData[element.y][element.x] != 2 && mapData[element.y][element.x] != 0){
                mapData[element.y][element.x]  = 0;
                map.initTiles();
            }
            map.explosionTile(element.x, element.y);
            
            var index = 0;
            booms.forEach(boom => {
                if(Math.round(boom.x/40) == element.x && Math.round(boom.y/40) == element.y){
                    exlosion(myGameArea.canvas, element.x, element.y);
                    booms.splice(index, 1);
                    
                }
                index++;
            });
            if(Math.round(transform.x/40) == element.x &&  Math.round(transform.y/40) == element.y){
                onDead();
                return;
            }
        }
        
    });

    
}

function onDead(){
    if(isNoDieMore) return;
    transform.x = 0;
    transform.y = 0;
    transform.hspeed = 0;
    transform.vspeed = 0;
    transform.moving = false;
    live--;
    if(live <= 0){
        alert("you're lose, Page will refresh to play again");
        location.reload();
    }
    isNoDieMore = true;
    setTimeout(function(){
        isNoDieMore = false;
    }, 3000);
}

var runnerImage = new Image();
var boom = new Image();
var liveIcon = new Image();
var timeNoDie = 100;

async function initializeImages() {
    myGameArea.start();
    var load = initTile().then(function(count){
        map = new OrthogonalMap(myGameArea.canvas, mapData, { tileSize: TILE_SIZE })
    }).catch(function(reason){
            console.log(reason);
    })
    var val = await load;
    setMapData(mapData);
    map.initTiles();
    explosionCell.src = 'assets/fire.png';
    liveIcon.src = 'assets/head.png'
    boom.src = 'assets/bomb.png'
    liveIcon.onload = function (e:any) {
        setTimeout(function(){
            isNoDieMore = false;
        }, 3000);
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
    if(isNoDieMore){
        timeNoDie--;
        if(timeNoDie <= 0)
        timeNoDie = 100;
        if(Math.round(timeNoDie/4) % 2 == 0)
        drawRunner();
    } else 
    drawRunner();
    for(var i = 0; i < live; i++){
        myGameArea.canvas.getContext("2d").drawImage(liveIcon, 30 + i*40, 550, 30, 30);
    }
    
    context.restore();
}

initializeImages();