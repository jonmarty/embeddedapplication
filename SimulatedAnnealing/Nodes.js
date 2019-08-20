class Node {
  constructor(x,y,r){
    this.x = x;
    this.y = y;
    this.r = r;
    this.fillColor = color(0,0,255);
    this.unhighlight = color(0,0,0);
    this.highlight = color(0,255,0);
  }
  draw(){
    if(this.mouseOver()){
      stroke(this.highlight);
    } else {
      stroke(this.unhighlight);
    }
    fill(this.fillColor);
    ellipse(this.x, this.y, this.r/2, this.r/2);
  }
  mouseOver(){
    return this.r/2 > Math.sqrt(Math.pow(mouseX - this.x, 2) + Math.pow(mouseY - this.y, 2));
  }
}

class StartNode extends Node {
  constructor(x,y,r){
    super(x,y,r);
    this.fillColor = color(255,0,0);
  }
}
