# CIS700 Procedural Graphics: Final Project
# Procedural Pond

## Design Documentation
### Introduction
My motivation for this project is to create an environment that I can keep adding to. I wanted to take small achievable steps to create something.

### Goal
I intend to achieve a beautiful looking pond scene which is also animated and interactive.

### Inspiration
- [Digital Painting by AquaSixio: Protect me from what I want](http://aquasixio.deviantart.com/art/Protect-me-from-what-I-want-311893619)
- [Digital Painting by ani-r: Very high up](http://ani-r.deviantart.com/art/Very-high-up-412864930)
- [Koi pond](http://static.boredpanda.com/blog/wp-content/uploads/2016/07/IMG_0528-p-577a423beb0db__880.jpg)
- [Monet's Pond](https://www.youtube.com/watch?v=69ks5akyFsA)

### Specification
- Water
  - Move vertices in vertex shader
  - Reflective fragment shader
- Rocks
  - Procedurally generated different levels of details of rock shapes
  - Simple fragment shader
- Vegetation
  - Lotuses and lotus pads
  - Extra: Tree and shrubs
- Polish
  - Fog
  - Interactive: Jiggle leaves, create waves in the water
  - Limited camera movement through scene: i.e. double click zoom in on specific area

### Techniques
- Superformula for Flowers
- L-System for Vegetation (TODO)
- Shape Grammer for alignment with everything
- Random/Noise generation
- Orbit Camera

### Milestone 2
![alt text][m2_rockformation]
![alt test][m2_skybox]

[m2_rockformation]: https://github.com/eldu/Final-Project/blob/master/src/common/images/M2_RockFormation.png
[m2_skybox]:https://github.com/eldu/Final-Project/blob/master/src/common/images/M2_SkyBox.png
- Generated random rocks
  - Generated a point cloud
  - Created a convex hull based on these points
  - Subdivided the rock
  - Randomized scaling
  - Put on random points of a circle's circumference
- Added a skysphere and ground
- Referenced [Hemisphere Light Example](https://threejs.org/examples/?q=hemis#webgl_lights_hemisphere) and [Convex Geometry Example](https://threejs.org/examples/?q=convex#webgl_geometry_convex)

### Milestone 1
![alt text][m1_water]
![alt text][m1_waterWireframe]

[m1_water]: https://github.com/eldu/Final-Project/blob/master/src/common/images/M1_Water.gif "Milestone 1: Water"
[m1_waterWireframe]: https://github.com/eldu/Final-Project/blob/master/src/common/images/M1_WaterWireframe.gif "Milestone 1: Water Wireframe"
- Computed waves and moved vertices in vertex shader.
- Referenced [Effective Water Simulation From Physical Models by Mark Finch and Cyan Worlds](http://http.developer.nvidia.com/GPUGems/gpugems_ch01.html)

### TODO
- Make the shape of the water more bloby
- Change the position of the rocks since they are still on a uniform circle
- Make the water reflective (so that you'd see a green box and the rocks in the water)
- Vegetation

### Live Demo
- [here](https://eldu.github.io/Final-Project/)

### References
- [Effective Water Simulation From Physical Models by Mark Finch and Cyan Worlds](http://http.developer.nvidia.com/GPUGems/gpugems_ch01.html)
- [IQ's Simple Procedural Color Palette](http://www.iquilezles.org/www/articles/palettes/palettes.htm)
- [Cosine Gradient Generator](http://dev.thi.ng/gradients/)
- [Hemisphere Light Example](https://threejs.org/examples/?q=hemis#webgl_lights_hemisphere)
- [Convex Geometry Example](https://threejs.org/examples/?q=convex#webgl_geometry_convex)
- [Superformula Wikipedia](https://en.wikipedia.org/wiki/Superformula)
- [Supershapes (Superformula) written by Paul Bourke, March 2002](http://paulbourke.net/geometry/supershape/): Useful to understand what the parametes of the superformula do and how they effect the shape.
- [Importing Audio](http://stackoverflow.com/questions/21463752/javascript-audio-object-vs-html5-audio-tag)

### Timeline
- 4/11: Codebase organization, Sketch End Goal, Work on Terrain Generation: Water Plane, and rock formation
- 4/18: Finish terrain generation, Water animation shader, Extra: Waterfall
- 4/25: Vegetation: Lotus, lotus pads, grass? Extra: Trees, shrubs
- 5/2: Polish: Fog, Interactive: Make water move on mose click, 
- 5/3: Final Presentation: Indepth ReadMe, Presentation, Video, Live Demo

Extra: Fish, Umbrellas, Assets (Bridge), Waterfall, Wind, Birds