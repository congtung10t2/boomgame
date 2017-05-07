

var img = new Image();


function draw_anim(context:any, iobj:any, transform:any) { // context is the canvas 2d context.
    
    if (iobj.source != null)
    {
        if(iobj.direction == 0){
        context.drawImage(iobj.source, iobj.origin * iobj.width, iobj.current * iobj.height,
                          iobj.width, iobj.height,
                          transform.x, transform.y, iobj.width, iobj.height);
        } else {
            context.drawImage(iobj.source, iobj.current * iobj.width, iobj.origin * iobj.height,
                          iobj.width, iobj.height,
                          transform.x, transform.y, iobj.width, iobj.height);
        }
        if(transform.vspeed != 0 || transform.hspeed != 0)
    iobj.current = (iobj.current+1) % iobj.total_frames;
    transform.y += transform.vspeed;
    transform.x += transform.hspeed;
    }

}
export function drawCharacter(context:any, src:any, obj:any, transform:any) {
    img.onload = function () { // Triggered when image has finished loading.
        obj.source = img;  // we set the image source for our object.
    }
    img.src = src;
    draw_anim(context, obj, transform);
    
}