![Header](/images/header.png)

# Pruitt Igoe

This report builds upon the design document uploaded.

## Results:

You can see the demo running 
### [HERE](https://www.youtube.com/watch?v=D61TlRlmYOQ)

![Header](/images/proc1.png)

![Header](/images/proc2.png)

## Evaluation

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

* This framework also offers a very simple approach to building shader passes. In the end, these were not used.

* Originally, I wanted to use deferred rendering, but in the end I decided it didn't really add anything useful to the demo except extraneous complexity, as few lights are needed.

* The application is compiled with static libraries, so only an executable is needed, along with it resource images/shader files. Ideally, these should be compressed with a packaging algorithm in the executable.

* Camera choreography is built with a set of camera controllers managed by a state machine.

* Terrain is built with a fractal noise generator based on Perlin noise with iq's derivative feedback approach. However, I also added my own tweaks, in particular: a) terracing, b) erosion inspired riges and c) frequency/amplitude ratios dependent on derivatives. I think the results are interesting but are not useful unless there's enough interactivity for the user to develop it. It also interpolates between ridged and billow noise based on the derivative.

* I built a small GLSL library compilation feature that can append GLSL files to reuse code. Because of this, all the raymarched elements in the scene reuse the library Raymarching.glsl, which offers a lot of useful functions through defines and also has the main function of the shader. A user of the library only needs to define the scene() and shade() functions, and the shader will already work.

* The raymarching library handles intersection, shadows, volumetric rendering and reflections.

* The raymarched water is probably the most interesting shader, as it modifies the normal on the fly to generate the droplet wave.


![Header](/images/proc3.png)

### Technical problems
* The heightmap generation is not optimized and takes some time. There are various ways to improve this: a) multithreading the code or b) building the heightmap and the envelope mesh on a compute shader. b) is the most optimized approach, and I will implement this as a side project.

* The heightmap generator is very chaotic in the hard formal sense: it is very hard to find parameters that result into good terrains. I wanted to implement an erosion filter, but the only algorithms available are either very slow or need to be implemented on GPU.

* The volumetric rendering of the light pillar works, but the alpha blending of the material diminishes the effect. Lack of time for tweaking this effect is the reason, and I expect this to be can be vastly improved.

* OpenGL features are always hard to implement and debug, so a lot of time was spent in the framework.

![Header](/images/proc4.png)

### Personal evaluation
While I think that this project is technically good, I'm not completely pleased with the result, mostly because of the lack of terrain color variation, the naïveness of the underworld pillar/mountain (and lack of buildup for the pillar).

I do, however, like the overall shot composition and animation, and the feelings that it communicates.

### Future work

I want to continue this work and think it is a good proof of concept. I do not know if it is convenient to switch back to the old music, but it is worth reviewing it.

* The iterative raymarching approach is an interesting and useful algorithm and I plan on implementing a generalized approach.

* Implementing the terrain generation in a compute shader would be interesting.

* Implementing a natural erosion filter would be ideal, as I think this is the *key* in realistic terrain generation.

* Clouds and scattering would be a nice to have feature.

### References

* iq's approaches are vastly used here. In particular, his derivative noise generator and his Hell demo, seen on shadertoy.
* Perlin's original noise algorithm is reused here, without much modification.
* Michael Mroz's rasterized raymarching
* Bayt Lahm, by Anamog is the song playing.
