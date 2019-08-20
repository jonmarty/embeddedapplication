function deepCompare(a, b){
  for (p in a){
    if (a[p] !== b[p]) return false;
  }
  return true;
}

class SettingsArray {
  constructor(args) {
    this.array = {};
    for (var a in args){
      this.array[a] = args[a];
    }
    this.settings = [this.grab(),];
    this.changes = [0,];
  }

  check(time){
    if(!deepCompare(this.settings[this.settings.length - 1], this.grab())){
      this.settings.push(this.grab());
      this.changes.push(time);
    }
  }

  grab() {
    var out = {};
    for (var a in this.array){
      out[a] = this.array[a].value();
    }
    return out;
  }

  get(timeStep) {
    if (this.settings.length == 1 || timeStep == 0) {
      return this.settings[0];
    }
    else if(timeStep >= this.changes[this.changes.length - 1]){
      return this.settings[this.settings.length - 1];
    }
    for (var i = 0; i < this.settings.length; i++) {
      if (this.changes[i] > timeStep) {
        return this.settings[i - 1];
      }
    }
  }

  apply(timeStep){}

}

class DBSettingsArray extends SettingsArray {
  constructor(){
    super({
      thickness: createSlider(1, 10, 5),
      color: createColorPicker("red"),
    });
  }

  apply(timeStep){
    super.apply(timeStep);
    var s = this.get(timeStep);
    strokeWeight(s.thickness);
    stroke(s.color);
  }
}


class DrawingBoard extends EmbeddedVisual {

  constructor(x,y,w,h,bgcolor, settings){
    super(x,y,w,h);
    this.time = 0;
    this.pX = [];
    this.pY = [];
    this.settings = settings;
    this.breaks = [];
    this.bgcolor = bgcolor;
    this.pressed = false;
  }

  draw(){

    if(this.pressed && (pmouseX != mouseX || pmouseY != mouseY)){
      this.pX.push(mouseX);
      this.pY.push(mouseY);
      this.time++;
      this.settings.check(this.time);
    }


    //fill(this.bgcolor);
    //noStroke();
    //rect(this.x,this.y,this.w,this.h);
    stroke(0);
    noFill();

    // Ranges from 0 to 1, determines how tightly the curve fits the points
    curveTightness(0.0);

    beginShape();
    for(var i = 0; i < this.time; i++){
      if(!this.breaks.includes(i+1)){
        this.settings.apply(i + 1);
        curveVertex(this.pX[i], this.pY[i]);
        //curve(this.pX[i], this.pY[i], this.pX[i+1], this.pY[i+1], this.pX[i+2], this.pY[i+2], this.pX[i+3], this.pY[i+3]);
        //line(this.pX[i], this.pY[i], this.pX[i+1], this.pY[i+1]);
      }
      else{
        endShape();
        beginShape();
      }
    }
    endShape();
  }

  /*onClick(){
    this.pX.push(mouseX);
    this.pY.push(mouseY);
    this.time++;
    this.settings.check(this.time);
  }*/

  /*mouseDragged(){
    if (frameCount % 2 == 0){
      this.pX.push(mouseX);
      this.pY.push(mouseY);
      this.time++;
      this.settings.check(this.time);
    }
  }*/

  mouseDragged(){
    this.pressed = true;
  }

  mouseReleased(){
    this.pressed = false;
    this.pX.push(mouseX);
    this.pY.push(mouseY);
    this.time++;
    this.settings.check(this.time);
    this.breaks.push(this.time);
  }
}
