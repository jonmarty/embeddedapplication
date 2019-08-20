class TravelingSalesman extends EmbeddedVisual {

  constructor(x,y,w,h,N=30,r=0.07){
    super(x,y,w,h);
    this.N = N;
    this.r = r;
    this.optimizer = new SimulatedAnnealing();
    this.temp = new TempFunction();
    this.k = 1;
    this.showText = true;

    this.reset();
  }
  reset(){

    this.step = 0
    this.path = [];
    this.names = [];
    this.nodes = [];
    this.nodeObjects = [];

    //Randomly assign locations for each node
    this.startNode = [random(), random()];
    let sn = this.coorToPoint(this.startNode);
    this.startNodeObject = new StartNode(sn[0], sn[1], this.r * this.w);
    for (let i = 0; i < this.N; i++){
      this.nodes.push([random(), random()]);
      let ncoor = this.coorToPoint(this.nodes[i]);
      this.nodeObjects.push(new Node(ncoor[0], ncoor[1], this.r * this.w));
    }

    let pathOptions = [];

    //Fill pathOptions array
    for (let i = 0; i < this.N; i++){
      pathOptions.push(i);
    }

    //Create the path
    for(let i = 0; i < this.N; i++){
      let ind = int(random() * pathOptions.length);
      this.path.push(pathOptions.pop(ind));
    }

    this.fillNames();
  }

  draw(){

    // Draw background
    fill(0);
    noStroke();
    rect(this.x,this.y,this.w,this.h);

    // Run the optimizer
    this.step++;
    this.T = this.temp.call(this.step);
    this.optimizer.step(this);

    // Draw the path
    strokeWeight(5);
    for(let i = 0; i < this.N - 1; i++){
      stroke(0, 50 + 205 * (i+1) / (this.N+1), 0);
      let pt1 = this.coorToPoint(this.nodes[this.path[i]]);
      let pt2 = this.coorToPoint(this.nodes[this.path[i+1]]);
      line(pt1[0], pt1[1], pt2[0], pt2[1]);
    }

    // Draw lines to and from the start node
    let sn = this.coorToPoint(this.startNode);
    let pstart = this.coorToPoint(this.nodes[this.path[0]]);
    let pend = this.coorToPoint(this.nodes[this.path[this.path.length - 1]])

    stroke(0, 50, 0);
    line(sn[0], sn[1], pstart[0], pstart[1]);
    stroke(0, 255, 0);
    line(sn[0], sn[1], pend[0], pend[1]);

    //Update and draw nodes
    this.startNodeObject.draw();
    for(let i = 0; i < this.N; i++){
      this.nodeObjects[i].draw();
      //TODO: Some text for each node (custom city names)
    }
    // Show status of algorithm
    if (this.showText){

      let tsize = 0.025;
      let TSIZE = this.w * tsize;
      textSize(TSIZE);
      stroke(0);

      let xloc;
      if (this.step == 0){xloc = 1 - 10 * tsize}
      else {xloc = 1 - 8 * tsize - tsize/2 * Math.floor(Math.log(this.step)/Math.log(10))}

      let pos = this.coorToPoint([xloc, tsize]);

      fill(255, 255, 255);
      text(String(this.step) + " - " + String(this.optimizer.energy(this, this.path)), pos[0], pos[1]);

      fill(150,150,150);
      text(String(this.leastStep) + " - " + String(this.leastEnergy), pos[0], pos[1] + TSIZE);

      let spaces = "";
      for(let i = 0; i < Math.floor(Math.log(this.step)/Math.log(10)); i++){
        spaces += "  ";
      }

      fill(255 * this.T, 0, 255 * (1 - this.T));
      text("T" + spaces + "- " + String(this.T), pos[0], pos[1] + 2*TSIZE);
    }
  }

  keyPressed(){
    if(keyCode == ENTER){
      this.reset();
    }
    if(key == " "){
      this.showText = !this.showText;
    }
  }

  fillNames(){
    //TODO: Code this
  }
}
