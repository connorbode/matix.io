
var BLOCK_SIZE = 50;
var BLOCK_BORDER = 50;
var MAX_LIFE = 100;
var TICK_INTERVAL = 100;
var ACTIVATION_FACTOR = 0.01;
var RANDOM_ACTIVATION_INTERVAL = 1;
var TICK_DELAY = 1;

var Block = function (position, parent) {
  this.life = 0;
  this.parent = parent;
  this.elem = parent.append('rect');
  this.active = false;
  this.elem
    .attr('x', position.x)
    .attr('y', position.y)
    .attr('width', BLOCK_SIZE)
    .attr('height', BLOCK_SIZE)
    .style({
      fill: '#111',
      strokeWidth: BLOCK_BORDER,
      stroke: '#222',
      opacity: 0
    });

  // activates a block
  this.activate = function (life, key, velocity) {
    this.elem.style('opacity', life / MAX_LIFE);
    this.life = life || MAX_LIFE;
    this.increasing = true;
    this.active = true;
  };

  // decays a block
  this.decay = function () {
    if (this.increasing) {
      this.life += 1;
      if (this.life === MAX_LIFE)
        this.increasing = false;
    } else {
      this.life -= 1;
    }
    var life = this.life / MAX_LIFE;
    this.elem.style('opacity', life);
    if (life === 0) 
      this.active = false;
  };
};

var Grid = function (parent) {
  var width = parent.scrollWidth;
  var height = parent.scrollHeight;
  var blocks = {
    x: Math.ceil(width / BLOCK_SIZE),
    y: Math.ceil(height / BLOCK_SIZE)
  };
  parent = d3.select(parent);

  // create grid
  var grid = [];
  for (var i = 0; i < blocks.x; i += 1) {
    grid[i] = [];
    for (var j = 0; j < blocks.y; j += 1) {
      var position = {
        x: BLOCK_SIZE * i,
        y: BLOCK_SIZE * j
      };
      grid[i][j] = new Block(position, parent);
    }
  }

  // choose starting block
  function start () {
    var iRoll = Math.floor(Math.random() * blocks.x);
    var jRoll = Math.floor(Math.random() * blocks.y);
    grid[iRoll][jRoll].activate(50);
  }

  start();
  var ticksSinceActivation = 0;

  var tick = function () {
    ticksSinceActivation += 1;

    if (ticksSinceActivation > RANDOM_ACTIVATION_INTERVAL) {
      ticksSinceActivation = 0;
      start();
    }

    var activate = [];
    var roll;
    for (var i = 0; i < blocks.x; i += 1) {
      activate[i] = [];
      for (var j = 0; j < blocks.y; j += 1) {
        var block = grid[i][j];
        if (block.active) {
          block.decay();
          activate[i][j] = false;
        } else {
          activate[i][j] = (i > 0 && grid[i-1][j].active)
            || (i < blocks.x - 1 && grid[i+1][j].active)
            || (j > 0 && grid[i][j-1].active)
            || (j < blocks.y - 1 && grid[i][j+1].active);
        }
      }
    }

    if (activationing) {

      for (var i = 0; i < blocks.x; i += 1) {
        for (var j = 0; j < blocks.y; j += 1) {
          if (activate[i][j])
            grid[i][j].activate(50);
        }
      }
    }
  };

  setInterval(tick, TICK_INTERVAL);
  setTimeout(function () {
    activationing = true;
  }, TICK_DELAY);
};

var svg = d3.select('svg').node();
var grid = new Grid(svg);