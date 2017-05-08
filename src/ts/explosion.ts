
var explosion =  new Array();
var context:any;
function explosionOnCell(cellX:any, cellY:any){
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
export function exlosion(canvas:any, cellX:any, cellY: any){
    context = canvas.getContext("2d");
    explosionOnCell(cellX, cellY);
    explosionOnCell(cellX+1, cellY);
    explosionOnCell(cellX-1, cellY);
    explosionOnCell(cellX, cellY-1);
    explosionOnCell(cellX, cellY+1);
}

export function drawExplosion(image:any){
    explosion.forEach(element => {
        context.drawImage(image, element.x*40, element.y*40, 32, 32);;
    });
}