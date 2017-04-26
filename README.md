# Particle System

Goal
-----

Create a procedurally generated music video using particles.

Demo: https://msoudy.github.io/Final-Project/


Specification
--------------

- Particle system consisting of a large number of particles
- Character “walk” animation visualized using particle system
- Procedurally generated objects made solely with particles
- Synchronization of elements in the scene with background music


Techniques
-----------

- Particle simulation using transform feedback  - https://github.com/WebGLSamples/WebGL2Samples/blob/master/samples/transform_feedback_separated_2.html
- Transform feedback Particles example - https://www.ibiblio.org/e-notes/webgl/gpu/lorenz_ft.htm


Inspiration/References:
----------------------
- A Particle Dream - v1.0 — https://youtu.be/YB2u2WhZjxU
- WebGL FBO Particle System — https://youtu.be/HtF2qWKM_go
- GPU Accelerated Particles (Javascript, WebGL) — https://youtu.be/lJe5zEr4b0Q


Milestone 1
-----

Summary
-----

Created a particle simulation on the GPU using transform feedback. In the demo, I simulate 1,000,000 particles which move around at random velocities.


Method
-----

Created two shader programs (particles program & draw program), one to perform any calculations for the position and velocity of the particles and the other to draw the particles.

Before the draw call for the particles program, the rasterizer is disabled since no drawing is required and transform feedback is initiated. After the draw call, transform feedback returns the results from the particles program vertex shader (outPos, outVel) which are stored in buffers. The rasterizer is then re-enabled and the draw program is used to draw the points. Finally, the attribute buffers of the particles shader are swapped with the buffers from transform feedback to be used as input in the next iteration.


Milestone 2
-----

Summary
-----

- Added a perspective camera
- Added mouse controls to rotate camera and to zoom in/out
- Particles take the shape of sample objs including an animated Doberman which can be selected using the GUI.

Method
-----

 Currently, the Doberman animation is created by storing each frame of the animation in a separate obj. This is not ideal because it causes the application to take a while to load all the objs. Also, for each frame, I replace the buffer data in the CPU side instead of feeding all the data for the frames into the GPU from the beginning. I plan to change this by the final submission. 


Screenshots
-----------

![](./images/particles.png)

![](./images/doberman.png)