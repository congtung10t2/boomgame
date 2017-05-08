var ghost = new Image();
var wall = new Image();
var space = new Image();
var staticWall = new Image();
const TILE_TYPES = [
  { name: 'space', image: space },
  { name: 'wall', image: wall },
  { name: 'staticWall', image: staticWall },
  { name: 'enemy', image: ghost }
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
  size:any;
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
    public setVSpeed(speed:any){
      this.vspeed = speed;
    }

    public setHSpeed(speed:any){
      this.hspeed = speed;
    }

    public update(tiles:Tile[][]){

      var x = Math.round(this.xPos/40);
      var y = Math.round(this.yPos/40);
      if(this.hspeed > 0){
          if(((x < tiles[y].length - 1) && (tiles[y][x+1].getType() == TILE_TYPES[1] || tiles[y][x+1].getType() == TILE_TYPES[2])) || (x >= tiles[y].length - 1)){
              if((this.xPos + this.hspeed)/40 > x){
                
                this.hspeed = -this.hspeed;
                this.vspeed = 0;
                if(x > 0 && (tiles[y][x-1].getType() == TILE_TYPES[1] || tiles[y][x-1].getType() == TILE_TYPES[2])){
                   this.vspeed = this.hspeed;
                   this.hspeed = 0;
                }
              }
          } 
      }
      if(this.vspeed > 0){
        if(((y < tiles.length - 1) && (tiles[y+1][x].getType() == TILE_TYPES[1] || tiles[y+1][x].getType() == TILE_TYPES[2])) || (y >= tiles.length - 1)){
            if((this.yPos + this.vspeed)/40 > y){
                this.vspeed = -this.vspeed;
                this.hspeed = 0;
            }
        }
      }
      

      if(this.hspeed < 0){
        if(((x > 0) && (tiles[y][x-1].getType() == TILE_TYPES[1] || tiles[y][x-1].getType() == TILE_TYPES[2])) || (x <= 0)){
            if((this.xPos + this.hspeed)/40 <= x){
                this.hspeed = -this.hspeed;
                this.vspeed = 0;
            }
        }
      }
      if(this.vspeed < 0){
        if(((y > 0) && (tiles[y-1][x].getType() == TILE_TYPES[1] || tiles[y-1][x].getType() == TILE_TYPES[2])) || (y <=0)){
            if((this.yPos + this.vspeed)/40 <= y){
                this.vspeed = -this.vspeed;
                this.hspeed = 0;
            }
        }
      }
      this.xPos += this.hspeed;
      this.yPos += this.vspeed;
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
  enemies: Enemy[][];
  tiles: Tile[][];

  public initTiles(){
    this.tiles = [];
    this.enemies = [];
    const numCols = this.data[0].length
    const numRows = this.data.length
    for (let y = 0; y < numRows; y++) {
      this.tiles[y] = [];
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
  }

  public updateEnemy(){
      this.enemies.forEach(element => {
       element.forEach(enemy => {
         enemy.update(this.tiles);
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
