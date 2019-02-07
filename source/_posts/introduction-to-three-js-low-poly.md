---
title: A brief introduction to three.js
banner_lg: splash-lg.png
banner_sm: splash-lg.png
seo_description: >-
  In this short introudction to three.js, we start with a cube and progress to
  making our own three dimensional shapes, with a low-poly style.
date: 2019-02-07 11:14:12
tags:
---


What's life like in three dimensions? Let's see as we take a 2D logo to 3D.

We'll start by using the code presented in the [three.js introduction "Creating a scene"](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene).

This code gives presents you with a 3D rotating cube:

![rotating qube in three.js](cube.gif)

Now, the goal today will be to take the following logo and transform it to 3D:

![matix.io logo](logo.svg)

To do that, we have the following task list:

1. Change the background of the document
2. Change the color of the model
3. Build a more complicated object

# Changing the background of the three.js WebGL document

This is a straightforward task.

In the code, we have:

```javascript
var renderer = new THREE.WebGLRenderer()
```

We just need to set the background for the renderer:

```js
renderer.setClearColor( 0xffffff, 1 )
```

# Changing the color of the model

Again, this is a fairly simple task. We have the following code:

```js
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
```

That `0x00ff00` is our model's color. Let's change it to `0x000000`, black.

```js
var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
```

Now we have a rotating black cube:

![rotating black cube in three.js webgl](cube2.gif)

# Building a more complicated object

## Low poly wireframe

Now comes the more difficult task.

First, if we want a true low-poly feel we need to be able to see the edges of the object. To do that, we'll need to add another object that doesn't have a fill.

Here's the block of code that builds the cube:

```js
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );
```

Let's build a wireframe to cover that:

```js
var geometry = new THREE.EdgesGeometry( cube.geometry );
var material = new THREE.LineBasicMaterial( { color: 0x999999 } );
var wireframe = new THREE.LineSegments( geometry, material );
scene.add(wireframe);
```

Don't forget to rotate the wireframe in the `animate` function:

```js
wireframe.rotation.x += 0.01;
wireframe.rotation.y += 0.01;
```

![low poly cube in three.js](cube3.gif)

## A simple custom geometry in three.js

To get to the logo, we'll have to implement some custom geometry. From [three.js documentation on Geometry](https://threejs.org/docs/#api/en/core/Geometry), here's the most basic example:

```javascript
var geometry = new THREE.Geometry();

geometry.vertices.push(
	new THREE.Vector3( -2,  2, 0 ),
	new THREE.Vector3( -2, -2, 0 ),
	new THREE.Vector3(  2, -2, 0 )
);

geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );
```

This codes builds the following 2 dimensional object:

![two dimensional triangle in three.js](triangle.png)

## Extracting polygon data from SVG

The next job is to map the verticies on the logo.  Luckily, SVG actually has that information encoded.

Here's an excerpt from the SVG file:

```xml
<g id="Logo" transform="translate(40.000000, 32.000000)">
    <circle id="Oval" cx="39.75" cy="6.25" r="6.25"></circle>
    <polygon id="Path-3" points="0.74609375 43.8305664 14.7998047 21.4208984 19.75 25.8388672 28.6005859 7.48681641 40.6313477 30.5258789 46.0546875 21.4208984 50.8525391 28.7363281 55.0625 21.4208984 68.9990234 43.8305664"></polygon>
</g>
``` 

Let's pull those points out and add them to the JS:


```js
// convert SVG points to arrays
var points = "0.74609375 43.8305664 14.7998047 21.4208984 19.75 25.8388672 28.6005859 7.48681641 40.6313477 30.5258789 46.0546875 21.4208984 50.8525391 28.7363281 55.0625 21.4208984 68.9990234 43.8305664".split(' ')

var xs = [], ys = []

for (let i = 0; i < points.length; i += 1) {
  if (i % 2 === 0) {
    xs.push(parseInt(points[i]))
  } else {
    ys.push(parseInt(points[i]))
  }
}
```

At this point, we'll have an array of x values and a corresponding array of y values.

But remember, our cube had dimensions of 2, and this SVG has a max unit of 68. We'll need to scale it down.

## Scaling the polygon points

Let's scale the polygon points to a scaling factor of 2, so it's the same size as the cube:

```js
// scale SVG points
const max = points.map(point => parseFloat(point)).reduce((max, curr) => {
  if (curr > max) max = curr
  return max
})
const scalingFactor = 2

xs = xs.map((x) => {
  return (x / max) * scalingFactor
})

ys = ys.map((y) => {
  return (y / max) * scalingFactor
})
```

## Creating the geometry from the polygon points

The final step here is to create the geometry object. We'll need to create the verticies as well as the faces for the object.

To create the vertices, we iterate and add each x,y pair:

```js
// create vertices
xs.forEach((x, index) => {
  const y = ys[index]
  geometry.vertices.push(new THREE.Vector3(x, y, 0));
}
```

Faces are a bit more complex. A face in three.js is defined by three points: a triangle. For a complex object, there will be many triangles.

Luckily, three.js has a shortcut function to generate these trianges:

```js
// add faces
const vertices = geometry.vertices
const holes = []
const triangles = THREE.ShapeUtils.triangulateShape(vertices, holes);
```

Now let's add those triangles as faces:

```js
for( var i = 0; i < triangles.length; i++ ){
    geometry.faces.push(new THREE.Face3(triangles[i][0], triangles[i][1], triangles[i][2]));
}
```

## The final product

And, our final product! 

![almost complete output](output1.png)

Oh, wait. It's upside down. Let's go back and invert the y axis:

```js
ys = ys.map((y) => {
  return -1 * (y / max) * scalingFactor
})
```

![complete output](output2.png)

That's better.

And a GIF to show the 3D rotation:

![animation of output](output.gif)


## Next steps

To complete the project, we'll need to take care of the following steps:

1. The object isn't centered at the moment; we'll need to take the points from the SVG and center them.
2. We need to add the third dimension!
3. We need to add the moon, which is missing at the moment.