var ghost = new Image();
var wall = new Image();
var space = new Image();
const TILE_TYPES = [
  { name: 'wall', image: wall },
  { name: 'space', image: space },
  { name: 'enemy', image: ghost }
]
export function initTile(){
    return new Promise(function(resolve, reject){
      var count = 0;
      ghost.src = 'assets/ghost.png';
      wall.src = 'assets/wall.png';
      space.src = 'assets/space.jpg';
      ghost.onload  = function (e:any) {
        count++;
        if(count == 3)
         return resolve(count);
      }
      wall.onload  = function (e:any) {
        count++;
        if(count == 3)
         return resolve(count);
      }
      space.onload  = function (e:any) {
        count++;
        if(count == 3)
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
      
       
    });
}
class Tile {
  size:any;
  type:any;
  ctx:any;
  image:any;
  constructor (size:any, type:any, ctx:any) {
    this.size = size
    this.type = type
    this.ctx = ctx
    this.image = this.type.image;
  }
  
  draw (x:any, y:any) {
    // Store positions
    const xPos = x * this.size
    const yPos = y * this.size

    // Draw tile
    //this.ctx.src = this.type.image
   // this.ctx.fillRect(xPos, yPos, this.size, this.size)
      this.ctx.drawImage(this.image, xPos, yPos, this.size, this.size)

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
  
  public draw () {
    const numCols = this.data[0].length
    const numRows = this.data.length
    
    // Iterate through map data and draw each tile
    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < numCols; x++) {

        // Get tile ID from map data
        const tileId = this.data[y][x]
        
        // Use tile ID to determine tile type from TILE_TYPES (i.e. Sea or Land)
        const tileType = TILE_TYPES[tileId]

        // Create tile instance and draw to our canvas
        new Tile(this.tileSize, tileType, this.ctx).draw(x, y)

      }
    }
  }
}
