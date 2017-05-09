export function collide(rectA:any, rectB:any){
    if (rectA.x < rectB.x + rectB.width  && rectA.x + rectA.width  > rectB.x &&
            rectA.y < rectB.y + rectB.height && rectA.y + rectA.height > rectB.y) {
        return true;
    } else {
        return false;
    }
}