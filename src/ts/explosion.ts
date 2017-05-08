
var mapData = new Array();
var explosion =  new Array();
var context:any;
var rangeBoom = 2;
function explosionOnCell(cellX:any, cellY:any){
    if(isValidForBoom(cellX, cellY) == false)
        return;
    var explosionCell = {x: cellX, y: cellY};
    explosion.push(explosionCell);
    setTimeout(function(){
        var index = 0;
        explosion.forEach(element => {
            if(element === explosionCell){
                explosion.splice(index, 1);
            }
            index++;
        });
    }, 1000);

}

function isValidForBoom(x:any, y:any){
    if(x < 0 || y < 0 || x > mapData.length || y > mapData[0].length)
    return false;
    if(mapData[y][x] != 2){
        return true;
    }
    return false;
}

function isInsideMapData(x:any, y:any){
    if(x < 0 || y < 0 || x > mapData.length || y > mapData[0].length)
    return false;
    return true;
}

export function exlosion(canvas:any, cellX:any, cellY: any){
    context = canvas.getContext("2d");
    
    explosionOnCell(cellX, cellY);
    var xPlus = true;
    var yPlus = true;
    var xSub = true;
    var ySub = true;
    for(var i = 1; i <= rangeBoom; i++){
        if(xPlus){
            if(isInsideMapData(cellX+i, cellY))
            if(mapData[cellY][cellX+i] == 2)
                xPlus = false;
            else {
                if(mapData[cellY][cellX+i] == 1){
                    xPlus = false;
                }
                explosionOnCell(cellX+i, cellY);
            }
        }
        if(xSub){
            if(isInsideMapData(cellX-i, cellY))
            if(mapData[cellY][cellX-i] == 2)
                xSub = false;
            else {
                if(mapData[cellY][cellX-i] == 1){
                    xSub = false;
                }
                explosionOnCell(cellX-i, cellY);
            }
        }
        if(yPlus){
            if(isInsideMapData(cellX, cellY+i))
            if(mapData[cellY+i][cellX] == 2)
                yPlus = false;
            else {
                if(mapData[cellY+i][cellX] == 1){
                    yPlus = false;
                }
                explosionOnCell(cellX, cellY+i);
            }
        }
        if(ySub){
            if(isInsideMapData(cellX, cellY-i))
            if(mapData[cellY-i][cellX] == 2)
                ySub = false;
            else {
                if(mapData[cellY-i][cellX] == 1){
                    ySub = false;
                }
                explosionOnCell(cellX, cellY-i);
            }
        }
    }
}

export function drawExplosion(image:any){
    explosion.forEach(element => {
        context.drawImage(image, element.x*40, element.y*40, 32, 32);;
    });
}

export function setMapData(map:any){
    mapData = map;
}


export function getExplosion(){
    return explosion;
}