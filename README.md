# Pruitt Igoe

You can see the demo running 
### [HERE](https://www.youtube.com/watch?v=D61TlRlmYOQ)

This report builds upon the design document uploaded.

## Results

Because of time constraints, different design decisions were taken when completing the project:

### Concept/Choreography

* The song selected changed, and Bayt Lahm, by Anamog, was picked. This is because it is shorter and captures the same claustrophobic feeling that the original song has. However, the buildup that Pruitt-Igoe has is lost.
* Given this new song, a new choreography was designed, such that it followed the first piano key with a water droplet and small waves. 
* Also, instead of just moving through terrains, the camera also enters a portal to an Underworld, following the song for choreography.
* The light pillar is already fired, and although it is volumetric and animates, it is simplified from its original concept.

### Technical

* The terrain uses a rasterized raymarching that is inspired by Michael Mroz's Master thesis. It builds a 4k heightmap texture and a low resolution envelope mesh, and the shader raymarches from the collision point onwards.
* The iterative raymarching approach I wanted to test does work but needs to be formalized for a generalization to exist. Because of this (and time), it is disabled in the result demo.
* I built an entire interactive application engine that uses an entity-component architecture and offers various OpenGL features: framebuffer objects (FBOs), floating point textures with mipmaps, stencil operations, and a set of useful material features. Also, shaders are recompiled in runtime if the source files change, which greatly simplify development.
* The application is compiled with static libraries, so only an executable is needed, along with it resource images/shader files. Ideally, these should be compressed with a packaging algorithm in the executable.
* Camera choreography is built with a set of camera controllers managed by a state machine.
* Terrain is built with a fractal noise generator based on Perlin noise with iq's derivative feedback approach. However, I also added my own tweaks, in particular: a) terracing, b) erosion inspired riges and c) frequency/amplitude ratios dependent on derivatives. I think the results are interesting but are not useful unless there's enough interactivity for the user to develop it.
* I built a small GLSL library compilation feature that can append GLSL files to reuse code. Because of this, all the raymarched elements in the scene reuse the library Raymarching.glsl, which offers a lot of useful functions through defines and also has the main function of the shader. A user of the library only needs to define the scene() and shade() functions, and the shader will already work.
* The raymarching library handles intersection, shadows, volumetric rendering and reflections.
* The raymarched water is probably the most interesting shader, as it modifies the normal on the fly to generate the droplet wave.


### Technical problems
* The heightmap generation is not optimized and takes some time. There are various ways to improve this: a) multithreading the code or b) building the heightmap and the envelope mesh on a compute shader. b) is the most optimized approach, and I will implement this as a side project.

* The heightmap generator is very chaotic in the formal sense: it is very hard to find parameters that result into good terrains. I wanted to implement an erosion filter, but the only algorithms available are either very slow or need to be implemented on GPU.
