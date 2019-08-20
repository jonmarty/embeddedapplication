class Distribution {
  constructor(){}
  sample(){return 0;}
  prob(num){
    if (num == 0){return 1.0;}
    else {return 0.0;}
  }
}

class Uniform extends Distribution {
  constructor(min, max){
    super();
    this.min = min;
    this.max = max;
  }
  sample(){
    return round(this.min + (this.max - this.min) * random());
  }
  prob(num){
    if (num >= this.min && num <= this.max){
      return 1.0/(this.max - this.min);
    } else {return 0.0;}
  }
}

class TwoDimDistribution {
  constructor(dist1, dist2){
    this.dist1 = dist1;
    this.dist2 = dist2;
  }
  sample(){
    return [this.dist1.sample(), this.dist2.sample()];
  }
  prob(pt){
    return dist1.prob(pt[0]) * dist2.prob(pt[1]);
  }
}

class MetropolisProposal {
  constructor(s){
    this.s = s;
  }
  sample(pt){
    let samples = Array.from(pt);
    let n = Math.floor((4*this.s) * random());
    if (n < this.s){
      samples[0] = pt[0] - (n + 1);
    }
    else if (n < 2*this.s){
      samples[0] = pt[0] + (n - this.s + 1);
    }
    else if (n < 3*this.s){
      samples[1] = pt[1] - (n - 2*this.s + 1);
    }
    else {
      samples[1] = pt[1] + (n - 3*this.s + 1);
    }
    return samples;
  }
  prob(pt1, pt2){
    if((pt1[0] == pt2[0] || pt1[1] == pt2[1]) && abs(pt2[0] - pt1[0]) <= this.s && abs(pt2[1] - pt1[1]) <= this.s){
      return 1.0/(4*this.s);
    }
    else {
      return 0.0;
    }
  }
}

function gravPotentialEnergy(d,m){
  let G = 6.67408 * pow(10, -11);
  return G * pow(m, 2) / d;
}

function euclideanDistance(pt1, pt2){
  return Math.sqrt(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2));
}

class MetropolisIsingModel {
  constructor(parent){
    this.k = parent.k;
    this.T = parent.T;
    this.bounds = parent.bounds;
    this.mass = parent.mass;
  }
  call(pts){

    let e = 0;

    for(let i = 0; i < pts.length; i++){
      for(let j = 0; j < pts.length; j++){
        if(i==j){continue;}
        let pt1 = Array.from(pts[i]);
        let pt2 = Array.from(pts[j]);
        let d = new Array(9);

        pt2[0] = pt2[0] - this.bounds[0];
        pt2[1] = pt2[1] - this.bounds[1];
        d[0] = euclideanDistance(pt1, pt2);

        pt2[1] = pt2[1] + this.bounds[1];
        d[1] = euclideanDistance(pt1, pt2);

        pt2[1] = pt2[1] + this.bounds[1];
        d[2] = euclideanDistance(pt1, pt2);

        pt2[0] = pt2[0] + this.bounds[0];
        pt2[1] = pt2[1] - 2 * this.bounds[1];
        d[3] = euclideanDistance(pt1, pt2);

        pt2[1] = pt2[1] + this.bounds[1];
        d[4] = euclideanDistance(pt1, pt2);

        pt2[1] = pt2[1] + this.bounds[1];
        d[5] = euclideanDistance(pt1, pt2);

        pt2[0] = pt2[0] + this.bounds[0];
        pt2[1] = pt2[1] - 2 * this.bounds[1];
        d[6] = euclideanDistance(pt1, pt2);

        pt2[1] = pt2[1] + this.bounds[1];
        d[7] = euclideanDistance(pt1, pt2);

        pt2[1] = pt2[1] + this.bounds[1];
        d[8] = euclideanDistance(pt1, pt2);

        e += gravPotentialEnergy(min(d), this.mass);
      }
    }
    return exp(-e/(this.k * this.T));
  }
}
