
var helpers = {
  randomIntInRange: function (range) {
    return Math.floor(Math.random() * range);
  },

  randomDir: function (exclude) {
    var dirs = ["UP", "DOWN", "LEFT", "RIGHT"];
    if (exclude)
      dirs = dirs.reduce(function (sum, d) {
        var excluded = exclude.reduce(function (sum2, e) {
          if (e === d) return true;
          else return sum2;
        }, false);

        if (!excluded)
          sum.push(d);

        return sum;
      }, []);

    var index = helpers.randomIntInRange(dirs.length);
    return dirs[index];
  },

  newLine: function (start, dir) {
    var SIZE = 10;
    var end = {};
    switch (dir) {
      case "UP":
        end.x = start.x;
        end.y = start.y + SIZE;
        break;
      case "DOWN":
        end.x = start.x;
        end.y = start.y - SIZE;
        break;
      case "LEFT":
        end.x = start.x - SIZE;
        end.y = start.y;
        break;
      case "RIGHT":
        end.x = start.x + SIZE;
        end.y = start.y;
        break;
    }

    var line = d3.select('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .append('line');

    setTimeout(function () {

    }, 100);

    line
      .attr('x1', start.x)
      .attr('x2', end.x)
      .attr('y1', start.y)
      .attr('y2', end.y)
      .style({
        'stroke': '#222',
        'stroke-width': 1
      });

    return end;
  },

  opposite: function (dir) {
    var opposites = {
      'UP': 'DOWN',
      'LEFT': 'RIGHT',
      'DOWN': 'UP',
      'RIGHT': 'LEFT'
    };
    return opposites[dir];
  }
};

var width = document.body.scrollWidth;
var height = document.body.scrollHeight;

var init = {
  x: helpers.randomIntInRange(width), 
  y: helpers.randomIntInRange(height)
};

function startLine () {
  var last = [];
  var start = init;
  setInterval(function () {
    var dir = helpers.randomDir(last);
    last = [helpers.opposite(dir)];
    start = helpers.newLine(start, dir);
  }, 10);
}

var LINE_SIZE = 10;
var LIFE_COLORS = {
  256: '#bbb',
  128: '#aaa',
  64: '#999',
  32: '#888',
  16: '#777',
  8: '#666',
  4: '#555',
  2: '#444',
  1: '#333',
  0: '#222'
};

var Line = function (start) {
  var dir = [];
  this.current = start;
  this.lines = [];
  this.continue = function () {
    this.lines = this.lines.reduce(function (sum, line) { 
      line.decay();
      if (line.life > 0) sum.push(line);
      return sum;
    }, []);


    var end = {};
    var exclude = dir.length === 0 ? [] : [helpers.opposite(dir[0])];
    dir = helpers.randomDir(exclude);

    switch (dir) {
      case "UP":
        end.x = this.current.x;
        end.y = this.current.y + LINE_SIZE;
        break;
      case "DOWN":
        end.x = this.current.x;
        end.y = this.current.y - LINE_SIZE;
        break;
      case "LEFT":
        end.x = this.current.x - LINE_SIZE;
        end.y = this.current.y;
        break;
      case "RIGHT":
        end.x = this.current.x + LINE_SIZE;
        end.y = this.current.y;
        break;
    }

    var line = d3.select('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .append('line');

    line
      .attr('x1', this.current.x)
      .attr('x2', end.x)
      .attr('y1', this.current.y)
      .attr('y2', end.y)
      .style({
        'stroke': '#fff',
        'stroke-width': 1
      });

    line.life = 32;

    line.decay = function () {
      line.life -= 1;
      if (LIFE_COLORS[line.life]) {
        this.style({
          'stroke': LIFE_COLORS[line.life]
        });
      }
    };

    this.lines.push(line);

    this.current = end;
  };
};

var lines = [];
for (i = 0; i < 10; i += 1) {
  lines.push(new Line(init));
}

setInterval(function () {
  lines.map(function (line) {
    line.continue();
  });
}, 50);

// add fonts
var elem = document.getElementById('fonts');
var fonts = [
  // "'Ubuntu', sans-serif;",
  "'Poiret One', cursive;",
  // "'Inconsolata', ;",
  // "'Josefin Sans', sans-serif;",
  // "'Play', sans-serif;",
  // "'Quicksand', sans-serif;"
];

fonts.map(function (font) {
  var e = document.createElement('div');
  var a = document.createAttribute('style');
  a.value = 'font-family: ' + font;
  e.setAttributeNode(a);
  e.innerText = 'matix.io';
  elem.appendChild(e);
});