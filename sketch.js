w = 1500;
h = 1500;
let cols = [
  'red',
  'yellow',
  'blue',
  'green',
  'purple',
  'orange',
];
let apps;
let drawSettings;
let active;

function setup() {
  createCanvas(w,h);
  apps = [
    new DrawingBoard(0,0,w,h,"black", new DBSettingsArray()),
    new clickColor(100, 100, 100, 100, cols),
    new clickColor(200,200,100,100,cols),
    new TravelingSalesman(0,300,600,600, 10, 0.15),
    new Metropolis(800,300,600,600),
  ];
  active = 0;
}


function draw() {
  background(0);
  for (let i = apps.length - 1;i >= 0; i--){
    apps[i].draw();
  }
}

function mouseClicked(){
  if (apps[active].inVisual([mouseX, mouseY])){
    apps[active].mouseClicked();
  }
}

function mouseDragged(){
  if(apps[active].inVisual([mouseX, mouseY])){
    apps[active].mouseDragged();
  }
}

/*function doubleClicked(){
  for (let i = 0; i < apps.length; i++){
    if (apps[i].inVisual([mouseX, mouseY])){
      active = i;
      break;
    }
  }
}*/

function mouseReleased(){
  if(apps[active].inVisual([mouseX, mouseY])){
    apps[active].mouseReleased();
  }
}

function keyPressed(){
  if(["0","1","2","3","4","5","6","7","8","9"].includes(key)){
    let ind = String(key);
    if(ind < apps.length){
      active = ind;
      return null;
    }
  }
  else{
    apps[active].keyPressed();
  }
}
