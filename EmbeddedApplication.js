class EmbeddedVisual {
  constructor(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.active = false;
    this.hide = false;
  }
  coorToPoint(coor){
    return [coor[0] * this.w + this.x, coor[1] * this.h + this.y];
  }
  inVisual(point){
    return (point[0] > this.x && point[0] < this.x + this.w && point[1] > this.y && point[1] < this.y + this.h);
  }
  toggleActive(){
    this.active = !this.active;
  }
  getName(){
    return this.name;
  }
  toggleHide(){
    this.hide = !this.hide;
  }
  mouseClicked(){}
  mouseDragged(){}
  mouseReleased(){}
  keyPressed(){}
}

class clickColor extends EmbeddedVisual {
  constructor(x, y, w, h, cols){
    super(x,y,w,h);
    this.cols = cols;
    this.len = cols.length;
    this.ind = 0;
  }
  draw(){
    fill(this.cols[this.ind]);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
  toggleColor(){
    this.ind = (this.ind + 1) % this.len;
  }
  mouseClicked(){
    this.toggleColor();
  }
  mouseDragged(){
    this.toggleColor();
  }
  keyPressed(){
    this.toggleColor();
  }
}
