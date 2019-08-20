Math.getDistance = function(a,b){
  let l = a.length;
  let s = 0;
  for (let i = 0; i < a.length; i++){
    s += Math.pow(a[i] - b[i]);
  }
  return Math.sqrt(s);
}

class Optimizer {
  constructor(){}
  step(args){}
}

class SimulatedAnnealing extends Optimizer {
  constructor(){
    super();
  }
  step(args){
    let proposal = this.sample(args);

    if(this.energy(args, args.path) < args.leastEnergy || args.step == 1){
      args.leastEnergy = this.energy(args, args.path);
      args.leastStep = args.step;
    }

    if(this.prob(args, proposal) / this.prob(args, args.path) > random(0,1)){
      args.path = proposal;
    }

    return args;
  }

  sample(args){
    let ind1 = Math.floor(args.N * Math.random());
    let ind2 = Math.floor(args.N * Math.random());

    // Skip over node at ind1
    if(ind2 >= ind1 && ind2 != args.N - 1){ ind2++; }
    else if (ind1 == ind2 && ind1 == args.N - 1) {ind1--;}

    let newPath = Array.from(args.path);
    newPath[ind1] = args.path[ind2];
    newPath[ind2] = args.path[ind1];

    return newPath;
  }

  energy(args, state){
    let sum = 0;
    for (let i = 0; i < state.length - 1; i++){
      let n1 = args.nodes[state[i]];
      let n2 = args.nodes[state[i+1]];
      sum += Math.getDistance(n1, n2);
    }
    sum += Math.getDistance(args.startNode, args.nodes[state[0]]);
    sum += Math.getDistance(args.startNode, args.nodes[state[args.N - 1]]);
    return sum;
  }

  prob(args, state){
    return exp(-this.energy(args, state)/(args.k * args.T));
  }
}

class TempFunction {
  constructor(){}
  call(step){
    return 1 / Math.log(step + 1);
  }
}
