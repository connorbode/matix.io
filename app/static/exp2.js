
var BLOCK_SIZE = 40;
var BLOCK_BORDER_WIDTH = 2;
var GROUP_TICK_INTERVAL = 10;
var REPRODUCTION_FACTOR = 0.02;

var Block = function (parent, origin, startLife, maxLife) {
  this.maxLife = maxLife;
  this.life = startLife;
  this.elem = parent.append('rect');
  this.reproduced = false;
  this.origin = origin;
  this.elem
    .attr('width', BLOCK_SIZE)
    .attr('height', BLOCK_SIZE)
    .attr('x', origin.x)
    .attr('y', origin.y)
    .style({
      'fill': 'white',
      'stroke': 'black',
      'stroke-width': BLOCK_BORDER_WIDTH
    });

  this.tick = function () {
    this.life -= 1;
    var alive = this.life > 0;
    if (alive) {
      this.elem.style({
        opacity: this.life / this.maxLife
      });
    }
    return alive;
  };

  var nextOrigin = {
    'UP': function () {
      return {
        x: origin.x,
        y: origin.y - BLOCK_SIZE
      };
    },
    'DOWN': function () {
      return {
        x: origin.x,
        y: origin.y + BLOCK_SIZE
      };
    },
    'RIGHT': function () {
      return {
        x: origin.x + BLOCK_SIZE,
        y: origin.y
      };
    },
    'LEFT': function () {
      return {
        x: origin.x - BLOCK_SIZE,
        y: origin.y
      };
    }
  };

  this.reproduce = function () {
    if (this.reproduced)
      return [];
    var lifePercentage = this.life / this.maxLife;
    var reproductionChance = REPRODUCTION_FACTOR * lifePercentage;
    var children = [];
    ['UP', 'DOWN', 'LEFT', 'RIGHT'].forEach(function (dir) {
      var roll = Math.random();
      if (roll < reproductionChance) {
        var next = nextOrigin[dir]();
        console.log(next);
        children.push(new Block(parent, next, startLife, maxLife));
      }
    });
    this.reproduced = children.length > 0;
    return children;
  };
};

var Group = function (parent, origin) {
  var blocks = [new Block(parent, origin, 100, 100)];
  var tick = function () {
    blocks = blocks.reduce(function (b, block) {
      var alive = block.tick();
      if (alive) {
        b.push(block);
        b = b.concat(block.reproduce());
      }
      return b;
    }, []);
  };

  setInterval(tick, GROUP_TICK_INTERVAL);
};

var width = document.body.scrollWidth;
var height = document.body.scrollHeight;

var svg = d3.select('svg');
var origin = {
  x: width / 2,
  y: height / 2
};
var group = new Group(svg, origin);