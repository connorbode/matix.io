---
title: 'Experimenting with Three.js, part 2'
banner_lg: splash-lg.png
banner_sm: splash-sm.png
date: 2019-03-03 17:39:01
tags:
seo_description:
---


In the [previous post](https://matix.io/introduction-to-three-js-low-poly/), we set up three.js and implemented a rotating cube. To add a "low poly" effect, we added a mesh.

Then, to make things more interesting, we imported an SVG logo to use instead.

Here's where we left off:

![matix.io logo spinning](output.gif)

First, let's remove the rotation on the x axis by commenting out the lines:

```javascript
// cube.rotation.x += 0.01;
cube.rotation.y += 0.01;
// wireframe.rotation.x += 0.01;
wireframe.rotation.y += 0.01;
```


## Centering our logo

Next, we'll center our logo. To do so, we'll need to offset the x coordinates retrieved from the SVG.

Recall we have the following function:

```javascript
xs = xs.map((x) => {
  return (x / max) * scalingFactor
})
```

The purpose of this function is to scale our x points by the scaling factor (to shrink the rendering).

If we want to center the coordinates, we simply need to subtract `max / 2`:

```javascript
xs = xs.map((x) => {
  return ((x - max / 2) / max) * scalingFactor
})
```

Now, here's the result:

![matix.io rotating low poly logo](output-2.gif)