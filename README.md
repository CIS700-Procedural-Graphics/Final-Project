# CIS700 Procedural Graphics: Final Project
# Procedural Pond

## Design Documentation
### Introduction
My motivation for this project is to create an environment that I can keep adding to. I wanted to take small achievable steps to create something.

### Goal
I intend to achieve a beautiful looking pond scene which is also animated and interactive.

### Inspiration
- http://aquasixio.deviantart.com/art/Protect-me-from-what-I-want-311893619
- http://ani-r.deviantart.com/art/Very-high-up-412864930
- http://static.boredpanda.com/blog/wp-content/uploads/2016/07/IMG_0528-p-577a423beb0db__880.jpg
- https://www.youtube.com/watch?v=69ks5akyFsA

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
- L-System for Vegetation
- Shape Grammer for alignment with everything
- Random/Noise generation
- Orbit Camera

### Milestone 1
![alt text][m1_water]
![alt text][m1_waterWireframe]

[m1_water]: https://github.com/eldu/Final-Project/blob/master/src/common/images/M1_Water.gif "Milestone 1: Water"
[m1_waterWireframe]: https://github.com/eldu/Final-Project/blob/master/src/common/images/M1_WaterWireframe.gif "Milestone 1: Water Wireframe"
- Computed waves and moved vertices in vertex shader.
- Referenced [Effective Water Simulation From Physical Models by Mark Finch and Cyan Worlds](http://http.developer.nvidia.com/GPUGems/gpugems_ch01.html)


### References
- http://http.developer.nvidia.com/GPUGems/gpugems_ch01.html
- IQ: http://www.iquilezles.org/www/articles/palettes/palettes.htm
- cosine gradient generator: http://dev.thi.ng/gradients/

### Timeline
- 4/11: Codebase organization, Sketch End Goal, Work on Terrain Generation: Water Plane, and rock formation
- 4/18: Finish terrain generation, Water animation shader, Extra: Waterfall
- 4/25: Vegetation: Lotus, lotus pads, grass? Extra: Trees, shrubs
- 5/2: Polish: Fog, Interactive: Make water move on mose click, 
- 5/3: Final Presentation: Indepth ReadMe, Presentation, Video, Live Demo

Extra: Fish, Umbrellas, Assets (Bridge), Waterfall, Wind, Birds