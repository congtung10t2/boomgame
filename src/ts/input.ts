
var keyState = {
    'key': "null",
    'state': "released"
    
};
var callback = { 
  'onDown': null,
  'onUp':null
};

var keyDir = 0;
window.onkeydown = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;
   
   switch (key)
    {
      case 37: // left arrow key
      case 65: // a
      if(keyState.key != "left" || keyState.state != "onDown"){
          callback.onDown("left");
      }
        keyState.key = "left";
        keyDir |= 1;
        keyState.state = "onDown";
        
        break;
      case 38: // up arrow key
      case 87: // w
      if(keyState.key != "up" || keyState.state != "onDown"){
          callback.onDown("left");
      }
      keyDir |= 2;
        keyState.key = "up";
        keyState.state = "onDown";
        callback.onDown("up");
        break;
      case 39: // right arrow key
      case 68: // d
      if(keyState.key != "right" || keyState.state != "onDown"){
          callback.onDown("right");
      }
      keyDir |= 4;
        keyState.key = "right";
        keyState.state = "onDown";
        
        break;
      case 40: // down arrow key
      case 83: // s
      if(keyState.key != "down" || keyState.state != "onDown"){
          callback.onDown("down");
      }
      keyDir |= 8;
        keyState.key = "down";
        keyState.state = "onDown";
        break;
      case 13: // enter
      if(keyState.key != "enter" || keyState.state != "onDown"){
          callback.onDown("enter");
      }
        keyState.key = "enter";
        keyState.state = "onDown";
        break;
      case 32: //space
      if(keyState.key != "space" || keyState.state != "onDown"){
          callback.onDown("space");
      }
        keyState.key = "space";
        keyState.state = "onDown";
        break;
    }

}
window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;
   
   switch (key)
    {
      case 37: // left arrow key
      case 65: // a
      if(keyState.key != "left" || keyState.state != "onUp"){
          callback.onUp("left");
      }
      keyDir &= 14;
        keyState.key = "left";
        keyState.state = "onUp";
        break;
      case 38: // up arrow key
      case 87: // w
      if(keyState.key != "up" || keyState.state != "onUp"){
          callback.onUp("up");
      }
      keyDir &= 13;
        keyState.key = "up";
        keyState.state = "onUp";
        break;
      case 39: // right arrow key
      case 68: // d
      if(keyState.key != "right" || keyState.state != "onUp"){
          callback.onUp("right");
      }
      keyDir &= 11;
        keyState.key = "right";
        keyState.state = "onUp";
        break;
      case 40: // down arrow key
      case 83: // s
      if(keyState.key != "down" || keyState.state != "onUp"){
          callback.onUp("down");
      }
      keyDir &= 7;
        keyState.key = "down";
        keyState.state = "onUp";
        break;
      case 13: // enter
      if(keyState.key != "enter" || keyState.state != "onUp"){
          callback.onUp("enter");
      }
        keyState.key = "enter";
        keyState.state = "onUp";
        break;
      case 32: //space
      if(keyState.key != "space" || keyState.state != "onUp"){
          callback.onUp("space");
      }
        keyState.key = "space";
        keyState.state = "onUp";
        break;
    }

}
export function getKeyState() :any{
    return keyState;
}

export function setOnDownCallback(onCallback:any){
    callback.onDown = onCallback;
}

export function setOnUpCallback(onCallback:any){
    callback.onUp = onCallback;
}

export function getKeyDir() : any{
    return keyDir;
}