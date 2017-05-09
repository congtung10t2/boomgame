var ghost = new Image();
var wall = new Image();
var space = new Image();
var staticWall = new Image();
export const TILE_TYPES = [
  { name: 'space', image: space},
  { name: 'wall', image: wall},
  { name: 'staticWall', image: staticWall},
  { name: 'enemy', image: ghost},
  { name: 'boom', image: space}
]
export function initTile(){
    return new Promise(function(resolve, reject){
      var count = 0;
      ghost.src = 'assets/ghost.png';
      wall.src = 'assets/wall.png';
      space.src = 'assets/space.jpg';
      staticWall.src = 'assets/static_wall.jpg'
      ghost.onload  = function (e:any) {
        count++;
        if(count == 4)
         return resolve(count);
      }
      staticWall.onload  = function (e:any) {
        count++;
        if(count == 4)
         return resolve(count);
      }
      wall.onload  = function (e:any) {
        count++;
        if(count == 4)
         return resolve(count);
      }
      space.onload  = function (e:any) {
        count++;
        if(count == 4)
         return resolve(count);
      }

      ghost.onerror = function(e:any){
        reject("load failed");
      }
      
      wall.onerror = function(e:any){
        reject("load failed");
      }

      
      space.onerror = function(e:any){
        reject("load failed");
      }
      
      staticWall.onerror = function(e:any){
        reject("load failed");
      }
      
       
    });
}
class Tile {
  public size:any;
  type:any;
  ctx:any;
  image:any;
  public xPos:any;
  public yPos:any;
  constructor (size:any, type:any, ctx:any, x:any, y:any) {
    this.size = size
    this.type = type
    this.ctx = ctx
    this.image = this.type.image;
    this.xPos = x * this.size
    this.yPos = y * this.size
  }
  public setSolid(isSolid:boolean){
    this.type = isSolid?TILE_TYPES[4]:TILE_TYPES[0];
  }

  public getType(){
    return this.type;
  }
  
  public draw () {
    //this.ctx.drawImage(space, this.xPos, this.yPos, this.size, this.size)
    //if(space != this.image)
    this.ctx.drawImage(this.image, this.xPos, this.yPos, this.size, this.size)
  }
}

class Enemy extends Tile {
    hspeed = 0;
    vspeed = 0;
    public live = true;
    public setVSpeed(speed:any){
      this.vspeed = speed;
    }

    public setHSpeed(speed:any){
      this.hspeed = speed;
    }

    public check(x:any, y:any){
      var xCheck = Math.round(this.xPos/40);
      var yCheck = Math.round(this.yPos/40);
      if(x == xCheck && y == yCheck){
        return true;
      }
      return false;
    }

    public update(map:OrthogonalMap){
      if(!this.live) return;
      var x = Math.round(this.xPos/40);
      var y = Math.round(this.yPos/40);
      if(this.hspeed > 0){
          if(((x < map.tiles[y].length - 1) && map.solidObjectAtXY(x+1, y)) || (x >= map.tiles[y].length - 1)){
              if((this.xPos + this.hspeed)/40 > x){
                
                this.hspeed = -this.hspeed;
                this.vspeed = 0;
                if(x > 0 && (map.solidObjectAtXY(x-1, y)) || (x <= 0)){
                   this.vspeed = this.hspeed;
                   this.hspeed = 0;
                }
              }
          } 
      }
      if(this.vspeed > 0){
        if(((y < map.tiles.length-1) && map.solidObjectAtXY(x, y+1)) || (y >= map.tiles.length - 1)){
            if((this.yPos + this.vspeed)/40 > y){
                this.vspeed = -this.vspeed;
                this.hspeed = 0;
            }
        }
      }
      

      if(this.hspeed < 0){
        if(((x > 0) && map.solidObjectAtXY(x-1, y)) || (x <= 0)){
            if((this.xPos + this.hspeed)/40 <= x){
                this.hspeed = -this.hspeed;
                this.vspeed = 0;
            }
        }
      }
      if(this.vspeed < 0){
        if(((y > 0) && map.solidObjectAtXY(x, y-1)) || (y <=0)){
            if((this.yPos + this.vspeed)/40 <= y){
                this.vspeed = -this.vspeed;
                this.hspeed = 0;
            }
        }
      }
      this.xPos += this.hspeed;
      this.yPos += this.vspeed;
    }

    public draw () {
    //this.ctx.drawImage(space, this.xPos, this.yPos, this.size, this.size)
    //if(space != this.image)
    if(this.live)
    this.ctx.drawImage(this.image, this.xPos, this.yPos, this.size, this.size)
  }
}
class Map {
  canvas:any;
  ctx:any;
  data:any;
  tileSize:any;
  showGrid:any;
  constructor (canvas:any, data:any, opts:any) {
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
    this.data = data
    this.tileSize = opts.tileSize
    this.showGrid = false
  }
  
}

/**
  OrthogonalMap class
 */
export class OrthogonalMap extends Map {

  constructor (canvas:any, data:any, opts:any) {
    super(canvas, data, opts)
  }
  enemies: Enemy[][] = [];
  public tiles: Tile[][];
  initEnemy = true;
  public initTiles(){
    this.tiles = [];
    const numCols = this.data[0].length
    const numRows = this.data.length
    for (let y = 0; y < numRows; y++) {
      this.tiles[y] = [];
      if(this.initEnemy)
      this.enemies[y] = [];
      for (let x = 0; x < numCols; x++) {

        // Get tile ID from map data
        const tileId = this.data[y][x]
        
        // Use tile ID to determine tile type from TILE_TYPES (i.e. Sea or Land)
        const tileType = TILE_TYPES[tileId]

        // Create tile instance and draw to our canvas
         if(tileId != 3){
            this.tiles[y][x] = new Tile(this.tileSize, tileType, this.ctx, x, y);
         } else {
           this.data[y][x] = 0;
            this.tiles[y][x] = new Tile(this.tileSize, TILE_TYPES[0], this.ctx, x, y);
            this.enemies[y][x] = new Enemy(this.tileSize, tileType, this.ctx, x, y);
            this.enemies[y][x].setHSpeed(3);
         }
        

      }
    }
    this.initEnemy = false;
  }

  public explosionTile(x:any, y:any){
    var result = false;
      this.enemies.forEach(element => {
       element.forEach(enemy => {
         if(enemy.live && enemy.check(x, y)){
           result = true;
           enemy.live = false;
           return;
         }
       });
       if(result)
        return;
      });
      if(!result) return;
      var check = false;
      this.enemies.forEach(element => {
       element.forEach(enemy => {
         if(enemy.live && enemy.xPos > 0 && enemy.yPos > 0 && enemy.xPos < 800 && enemy.yPos < 600){
           check = true;
           return;
         }
       });
       if(check) 
       return;
      });
      if(!check){
        alert("you win");
      }
  }

  public enemiesCollideAt(x:any, y:any){
    var result = false;
      this.enemies.forEach(element => {
       element.forEach(enemy => {
         if(enemy.live && enemy.check(x, y)){
           result = true;
           return;
         }
       });
       if(result)
        return;
      });
      return result;
  }

  public solidObjectAtXY(x:any, y:any){
    return (this.tiles[y][x].getType() == TILE_TYPES[2] || this.tiles[y][x].getType() == TILE_TYPES[1] || this.tiles[y][x].getType() == TILE_TYPES[4]);
  }

  public setSolid(isSolid:boolean,x:any, y:any){
    this.tiles[y][x].setSolid(isSolid);
  }

  public updateEnemy(){
      this.enemies.forEach(element => {
       element.forEach(enemy => {
         enemy.update(this);
       });
      });
  }
  
  public draw () {
    this.tiles.forEach(element => {
       element.forEach(tile => {
         tile.draw();
       });
    });

    this.enemies.forEach(element => {
       element.forEach(enemy => {
         enemy.draw();
       });
    });
  }
}
