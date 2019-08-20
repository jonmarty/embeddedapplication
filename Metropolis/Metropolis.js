function zeros (rows, cols){
  return Array(rows).fill().map(() => Array(cols).fill(0));
}

function noOverlap(pt,set){
  for(let i = 0; i < set.length; i++){
    if(pt == set[i]){
      return false
    }
  }
  return true;
}

class Metropolis extends EmbeddedVisual {
  constructor(x,y,w,h){
    super(x,y,w,h);
    this.last_recorded_step = 0;
    this.last_sampled_step = -1;
    this.substep = 0;
    this.step_limit = 100000;
    this.runContinuously = false;
    this.showText = true;

    this.lenPerBound = 10;
    this.bounds = [100,100];
    this.s = 5;
    this.heatmapOn = true;
    this.board = zeros(this.bounds[0] + 1, this.bounds[1] + 1);
    let base = [100,100,100];
    let target = [255,0,0];
    this.colormap = new CustomColorMap(base, target);

    this.N = 10;
    this.pointColor = [0,0,255];
    this.selectedPoint = null;
    this.selectedPointHistory = [];
    this.selectedPointColor = [0,255,0];
    this.proposalTiles = zeros(4 * this.s, 2);
    this.proposalTileColor = [0, 100, 0];

    this.prior = new TwoDimDistribution(new Uniform(0, this.bounds[0]), new Uniform(0, this.bounds[1]));
    this.proposal = new MetropolisProposal(this.s);

    //Ising model variables
    this.k = 1.380649 * pow(10,-23); // Boltzmann constant (J/K)
    this.T = 500; // Temperature of fluid (K)
    this.mass = 2.99 * pow(10,-5.7); //Mass of each particle (kg)
    this.prob = new MetropolisIsingModel(this);

    this.genData();
  }

  draw(){
    fill(128);
    noStroke();
    rect(this.x, this.y, this.w, this.h);

    if (this.step >= this.step_limit){
      exit();
    }

    if (frameCount % 10 == 0 && this.runContinuously){
      this.nextFull();
    }

    let cellHeight = this.h / this.bounds[0];
    let cellWidth = this.w / this.bounds[1];

    for (let row = 0; row < this.bounds[0] + 1; row++){
      for (let column = 0; column < this.bounds[1] + 1; column++){
        let cellX = column / this.bounds[1]; //cellWidth * column;
        let cellY = row / this.bounds[0]; //cellHeight * row;
        let cellCoor = this.coorToPoint([cellX, cellY]);

        let col;
        if (this.heatmapOn){col = this.colormap.call(this.heatmap[row][column]/(this.step + this.N) * 200);}
        else {col = this.colormap.call(this.board[row][column]);}
        fill(col[0], col[1], col[2]);

        rect(cellCoor[0], cellCoor[1], cellWidth, cellHeight);
      }
    }

    //highlight proposal distribution
    if (this.step > 0 || this.substep > 0){
      for(let i = 0; i < this.proposalTiles.length; i++){
        fill (this.proposalTileColor[0], this.proposalTileColor[1], this.proposalTileColor[2]);

        if (this.proposalTiles[i][0] < 0) {this.proposalTiles[i][0] = this.bounds[0] + this.proposalTiles[i][0];}
        else if (this.proposalTiles[i][0] > this.bounds[0]) {this.proposalTiles[i][0] = this.proposalTiles[i][0] - this.bounds[0] - 1;}
        if (this.proposalTiles[i][1] < 0) {this.proposalTiles[i][1] = this.bounds[1] + this.proposalTiles[i][1];}
        else if (this.proposalTiles[i][1] > this.bounds[1]){this.proposalTiles[i][1] = this.proposalTiles[i][1] - this.bounds[1] - 1;}

        rect(this.x + cellWidth * this.proposalTiles[i][1], this.y + cellHeight * this.proposalTiles[i][0], cellWidth, cellHeight);
      }
    }

    // Draw particles
    for(let i = 0; i < this.N; i++){
      let h = this.history[this.step][i];
      fill(this.pointColor[0], this.pointColor[1], this.pointColor[2])
      ellipse(this.x + cellWidth * h[1] + cellWidth/2, this.y + cellHeight * h[0] + cellHeight/2, cellWidth, cellHeight);
    }

    //Highlight selected point in green
    if (this.step > 0 || this.substep > 0){
      let h = this.history[this.step][this.selectedPoint];
      fill(this.selectedPointColor[0], this.selectedPointColor[1], this.selectedPointColor[2]);
      ellipse(this.x + cellWidth * h[1] + cellWidth/2, this.y + cellHeight * h[0] + cellHeight/2, cellWidth, cellHeight);
    }

    if (this.showText){
      let tsize = 0.025;
      let TSIZE = this.w * tsize;
      textSize(TSIZE);
      stroke(255);
      strokeWeight(1);

      fill(255,255,255);
      let xloc;
      if (this.step == 0) {xloc = 1 - 10 * tsize;}
      else {xloc = 1 - 10 * tsize - tsize/2 * Math.floor(Math.log(this.step) / Math.log(10));}
      let coor = this.coorToPoint([xloc, tsize]);

      text(String(this.step) + " - " + String(this.prob.call(this.history[this.step])), coor[0], coor[1]);
    }
  }

  genData(){
    this.history = [];
    this.samples = zeros(this.N, 2);
    this.heatmap = zeros(this.bounds[0] + 1, this.bounds[1] + 1);
    this.step = 0;
    for(let i = 0; i < this.N; i++){
      this.samples[i] = this.prior.sample();
      this.addToHeatmap(this.samples[i]);
    }
    this.history[0] = Array.from(this.samples);
  }

  setProposalTiles(){
    let hist = this.history[this.history.length - 1][this.selectedPoint];
    for (let i = 0; i < this.s; i++){
      this.proposalTiles[i][0] = hist[0] + i + 1;
      this.proposalTiles[i][1] = hist[1];
      this.proposalTiles[i + 5][0] = hist[0] - i - 1;
      this.proposalTiles[i + 5][1] = hist[1];
      this.proposalTiles[i + 10][0] = hist[0];
      this.proposalTiles[i + 10][1] = hist[1] + i + 1;
      this.proposalTiles[i + 15][0] = hist[0];
      this.proposalTiles[i + 15][1] = hist[1] - i - 1;
    }
  }

  next(){
    if(this.substep == 3){
      this.substep = 0;
      this.step++;
      if(this.step > this.last_recorded_step){
        this.last_recorded_step++;

        let ind = this.selectedPoint;
        let curr = this.history[this.history.length - 1][ind];
        let prop = this.proposal.sample(curr);
        let pts_prop = Array.from(this.history[this.history.length-1]);
        pts_prop[ind] = prop;

        if (prop[0] < 0) {prop[0] = this.bounds[0] + prop[0];}
        else if (prop[0] > this.bounds[0]) {prop[0] = prop[0] - this.bounds[0];}
        if (prop[1] < 0) {prop[1] = this.bounds[1] + prop[1];}
        else if (prop[1] > this.bounds[1]){prop[1] = prop[1] - this.bounds[1];}

        let r = this.prob.call(pts_prop);
        console.log(r);
        let moved = 0;
        let pt = curr;
        if (r >= random(0,1) && noOverlap(prop, this.history[this.history.length-1])){pt = prop; moved=1;console.log("THISHAPPENED");}
        this.samples.push(pt);

        let hist = Array.from(this.history[this.history.length-1]);
        hist[ind] = pt;
        this.history.push(hist);
      }
    } else {this.substep++;}
    if (this.substep == 1){
      if(this.step > this.last_sampled_step){
        this.last_sampled_step++;
        this.selectedPoint = Math.floor(this.N * random());
        this.selectedPointHistory.push(this.selectedPoint);
      } else {
        this.selectedPoint = selectedPointHistory[step];
      }
      this.setProposalTiles();
    }
  }

  prev(){
    if(this.substep > 0){this.substep--;}
    else if (this.step > 0) {
      this.step--;
      this.substep = 3;
      this.selectedPoint = this.selectedPointHistory[this.step + 1];
      this.setProposalTiles();
    } else {console.log("No steps to back up!");}
  }

  nextFull(){
    let prevStep = this.step;
    this.next();
    if(this.step != prevStep){
      this.addToHeatmap(this.samples[this.N + this.step - 1])
    }
    //console.log(this.heatmap.map((x) => x.reduce((a,b) => a + b)));
  }

  prevFull(){
    let prevStep = this.step;
    this.prev();
    if(this.step != prevStep){
      this.removeFromHeatmap(this.samples[this.N + prevStep - 1]);
    }
  }

  keyPressed(){
    if(key == " "){
      this.heatmapOn = !this.heatmapOn;
    }
    if(key == "c"){
      this.runContinuously = !this.runContinuously;
    }
    if(keyCode == LEFT_ARROW){
      this.prevFull();
    }
    if(keyCode == RIGHT_ARROW){
      this.nextFull();
    }
    if(keyCode == UP_ARROW){
      this.runContinuously = !this.runContinuously;
    }
    if(keyCode == DOWN_ARROW){
      this.showText = !this.showText;
    }
  }

  addToHeatmap(pt){
    let y = round(pt[0]);
    let x = round(pt[1]);
    this.heatmap[y][x] += 1;
  }

  removeFromHeatmap(pt){
    let y = round(pt[0]);
    let x = round(pt[1]);
    this.heatmap[y][x] -= 1;
  }

  fillHeatmap(){
    this.heatmap = zeros(this.bounds[0] + 1, this.bound[1] + 1);
    for(let i = 0; i < this.N + this.step; i++){
      this.addToHeatmap(this.samples[i]);
    }
  }
}
