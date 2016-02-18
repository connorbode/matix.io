function random (max) {
  return Math.floor(Math.random() * max);
}

function createRandomPoint (c, maxX, maxY) {
  var x = random(maxX);
  var y = random(maxY);
  fill(c); 
  ellipse(x, y, 5, 5);
}

function setup () {
  var numPoints = 100;
  var i;
  var c = color(255, 255, 255, 100);

  createCanvas(displayWidth, displayHeight);
  for (i = 0; i < numPoints; i += 1) {
    createRandomPoint(c, displayWidth, displayHeight);
  }
}

function draw () {
  translate(50, 1);
}