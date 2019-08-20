class ColorMap {
  constructor(){}
  call(val){
    out = [0,0,0];
    return out;
  }
}

class Gray extends ColorMap {
  constructor(){
    super();
  }
  call(val){
    return [155*val + 100, 155*val + 100, 155*val + 100];
  }
}

class Red extends ColorMap {
  constructor(){
    super();
  }
  call(val){
    return [155*val + 100, 100, 100];
  }
}

class CustomColorMap extends ColorMap {
  constructor(base, target){
    super();
    this.base = base;
    this.target = target;
    this.diff = [...Array(3)].map((_,i) => this.target[i] - this.base[i]);
  }
  call(val){
    return [...Array(3)].map((_,i) => this.base[i] + this.diff[i] * val);
  }
}
