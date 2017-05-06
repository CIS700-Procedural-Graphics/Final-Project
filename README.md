# CIS700 Procedural Graphics: Final Project


## Final Report 

Below details the various segments as my final report broken down into the following sections:

- Updated Design Document
- Results
- Evaluation
- Future Work
- Acknowledgements 


# Updated Design Document 

You can find an updated version of my design document in the [documentation] (https://github.com/MegSesh/Final-Project/blob/master/documentation/updateddesigndoc.docx) folder 

# Results 

The final result of my project: 

A video demo can be viewed [here] (https://youtu.be/nWGSon8ULzI). 

![alt text](https://github.com/MegSesh/Final-Project/blob/master/documentation/final.png "Final")


# Evaluation 

My project took many turns throughout the 3 milestones, however, I believe I reached part of the way with what I wanted to accomplish. The metaballs assignment was one of my most enjoyed assignments all semester, and I felt inspired to do more with it. While I first started with the idea of creating a metaball music fountain, I ended up aspiring for a more static, well-composited image rather than something dynamic. The inspiration not only came from the image below, but actually stems from an old childhood experience of mine. The mall I used to visit with my family as a kid had a small art store that sold what I used to call "magic paintings". The reason they were so "magical" was because parts of it were animated - which was especially noticeable if the painting had some sort of body of water. I was always curious to know how they were created and wanted to create one of my own. 


![alt text](https://github.com/MegSesh/Final-Project/blob/master/documentation/referenceImages/facefountainforest.jpg "Image 1")


**Milestone One:**

Focusing on composition in my first milestone is what geared me to change the direction of my project. I also started refactoring the metaball homework framework so that I could sprout metaballs in specified locations with specified velocities and accelerations. This took a couple of iterations to get right as well as to incorporate some simple optimizations. Recapping my first milestone below:


- Metaball.js:

    - Specified spawn location, velocity, and acceleration for each Metaball in the Metaball class 
    - Modified the Metaball update() function to reset the animation from the spawn location and incorporate deltaT, rather than just reversing the velocity at the boundaries.


- MarchingCubes.js

    - An isosurface is created whenever the field function for a metaball crosses a certain threshold, called isolevel. This field function describes the total influence of each metaball for a given point. Originally, the field function we used for homework was: 

        f(point) = (metaball radius)^2 / (distance from metaball to the point)^2

    While I tried experimenting with others functions, I decided to keep this one as it produced more of the result I wanted. In order to emulate some sort of ground base that the metaballs could interact with, I added a ground plane of influence by increasing the radius value for the points of the voxel nearer to the ground. 

    - In order to optimize some of the mathematical calculations I utilized built-in functions such as distanceToSquared (thanks Trung for the suggestion!) to calculate the field function. I also tried to be smarter about memory allocation with variables.

    - Incorporating spawn position, velocity and accceleration in the setupMetaballs() function allowed me to start animating them


- To add more to the composition, and start making the animated metaball look like it was falling into a body of water, I added a [water shader] (https://threejs.org/examples/?q=ocean#webgl_shaders_ocean) from Three.JS examples.


Results of animating the metaball 

![alt text](https://github.com/MegSesh/Final-Project/blob/master/documentation/milestone1_images/1.png "Image 1")

![alt text](https://github.com/MegSesh/Final-Project/blob/master/documentation/milestone1_images/2.png "Image 2")

![alt text](https://github.com/MegSesh/Final-Project/blob/master/documentation/milestone1_images/3.png "Image 3")



**Milestone Two:**

Milestone two consisted mostly of fixing my errors in milestone one and getting more of the major compositional pieces in so that my scene could start coming together. 

The most blatant error was that I couldn't get more than one metaball to move towards the ground plane of influence. Despite placing more in the scene, they wouldn't move. I realized that I was incorrectly incorporating deltaT in my integration calculation. I had to send deltaT from main.js to constantly update the metaball movement. I originally had set this in the Metaball class itself, however, realized this was incorrect since you want all the metaballs in the scene to be animated according to the same deltaT rather than each having their own. In other words, deltaT should be scene based, not metaball specific. 

Fixing this error allowed me to sprout more metaballs to start making it look more like a waterfall. Adding a perlin noise based terrain on the GPU and a skybox also brought the scene more together as seen below. 


The results of milestone two:

![alt text](https://github.com/MegSesh/Final-Project/blob/master/documentation/milestone2_images/1.png "Image 1")



**Final Stretch:**

The biggest challenge I faced in this final milestone was bringing the scene to life. This involved several key items:

    1. Testing the performance of the metaball animation with more and more metaballs. 
    2. Adding more objects to the scene
    3. Correctly implementing texture mapping on the terrain and the objects.


*Metaball Animation/Performance*

Up until now I had been manually specifying spawn locations, velocities and accelerations for the metaballs. In this milestone, I reconfigured this to be automated such that the metaballs sprouted randomnly but within a specified range that would update along with the voxel grid length. This made tuning parameters a lot easier. It also simplified my code greatly, and allowed me to test with more and more metaballs - from 10 to 100 to create a fuller looking waterfall. 


Another performance change I made was to move the Perlin noise terrain generation implementation from the GPU back to the CPU. Because the terrain wasn't animated in any way, there was no real advantage to putting it on the GPU. 


*Objects and Texture Mapping*

While properly adding more objects to the scene had its own challenges (in terms of parsing .obj files), the biggest one was being able to texture map them as well as the noise generated terrain. The inspiration image essentially has a huge grassy green field with a human head covered in the grass and foliage as well. Texture mapping the terrain had to be treated differently since manipulating the positions based on noise meant that the normals had been distorted as well, and had to be recalculated separately in order for texture mapping to work. 


I tried a multitude of texture mapping techniques. I tried re-calculating the normals according to the same perlin noise functions and creating UV coordinates from those, however, the grass texture I used still ended up being distorted. I also tried multiplying the UV's with an offset, however, this just essentially produced a color based on the texture as can be seen below.


The texture used:

![alt text](https://github.com/MegSesh/Final-Project/blob/master/src/assets/grass1.bmp "grass uv")


The result: 

![alt text](https://github.com/MegSesh/Final-Project/blob/master/documentation/textureuv.png "texture uv")


After reading IQ's [blog] (http://iquilezles.org/www/articles/texturerepetition/texturerepetition.htm) on texture repetition, I changed my approach to surround that, and created shaders that incorporated some of his ideas as well as triplanar mapping. The main idea behind this was to repeat a texture many times across a surface, but blend them together in such a way that it seemed to span the entire surface correctly. This produced a better result than before, even though there was still a visible appearance of repetition of the texture. 


# Future Work

Given more time, here's a list of features that I would have liked to add or reiterate on:

- Reiterate on the look and flow of the metaballs to be more fluid like (one idea was to have varying voxel grid width sizes)
- Implement procedural grass on the terrain and on the lion's head
- Implement fog and wind animation that would animate the grass 
- Texture the metaballs to be the same color as the water shader 
- Animate some effect that made the metaballs look like it was colliding with the water
- Procedurally place rock and foliage obj's around the terrain and water 
- Composite the scene to better emulate the image 

# Acknowledgements

Below is a list of all resources I consulted while working on this project:


**Inspiration**

- http://www.ro.me/tech/metaball-playground 
- http://www.ew-fountains.com/wp-content/uploads/2015/02/swarovski4.jpg


**Metaball Implementation**

- http://jamie-wong.com/2016/07/06/metaballs-and-webgl/
- https://threejs.org/examples/webgl_marchingcubes.html 


**Texture Mapping**

- https://gamedev.stackexchange.com/questions/64598/what-are-some-ways-to-texture-map-a-terrain 
- http://iquilezles.org/www/articles/texturerepetition/texturerepetition.htm
- https://www.shadertoy.com/view/4tsGzf 
- http://stackoverflow.com/questions/18880715/texture-splatting-with-three-js/18994814#18994814
- http://stemkoski.github.io/Three.js/Shader-Heightmap-Textures.html


**Other**
- https://github.com/stemkoski/stemkoski.github.com/tree/master/Three.js/images


**Music**

- https://www.soundjay.com/river-sounds-1.html 
- http://stackoverflow.com/questions/9419263/playing-audio-with-javascript 

**Water**

- https://threejs.org/examples/?q=ocean#webgl_shaders_ocean 



## Milestone 2

To start off, this is (somewhat) the look I'm trying to achieve:

![alt text](https://github.com/MegSesh/Final-Project/blob/master/documentation/referenceImages/facefountainforest.jpg "Image 1")


In this milestone, I completed the following:

- Fixed the bug I had in my previous milestone where I couldn't get multiple metaballs to animate. I now have deltaT being passed in from main.js into the update functions in marching_cubes.js and metaball.js.

- Set a fixed camera position to be according to the image above.

- Now, I have multiple metaballs sprouting from a side with varying accelerations and positions. This is set up accordingly to the image above. ("setupMetaballs" function in marching_cubes.js)
    * I'm in the middle of updating the logic of this to rather be in the "update" function than "setupMetaballs" to provide more flexibility in the spawning of metaballs.

- Created a noise generated terrain with perlin noise on the GPU as a shader

- Added lambertian shading

- Added a skybox and implementation for uploading an .obj mesh (commented out for now because I don't have an obj I want to place in the scene yet)


Results:

![alt text](https://github.com/MegSesh/Final-Project/blob/master/documentation/milestone2_images/1.png "Image 1")


To work on next milestone:

- Changing the size of the voxel grid in order to create more elongated, fluid looking metaballs
- Adding ambient music for the water



## Milestone 1

**Goals:**
According to my design document, my original project end product was to create a metaball musical fountain and my goals for Milestone 1 were:

- Set up metaballs to sprout from a ground plane, and
- Have music’s amplitude change some simple feature(s) of the metaballs, such as music or velocity.

During the first milestone, I ended up focusing on working on compositing my scene and getting necessary technical implementation foundations in place. This included:

- Setting up metaballs such that it spouts from a specified spawn location and with an intial velocity. This causes it to move downwards to the ground, and resets once it does. (metaball class in metaball.js and function "setupMetaballs" in marching_cubes.js)
- Setting up a ground plane of "influence", where the metaball falls into (function "sampleIsoValue" in marching_cubes.js)
- Incorporating a water shader and a toon shader for scene composition (function "onLoad" in main.js and function "toonShader" in marching_cubes.js)


Images:

![alt text](https://github.com/MegSesh/Final-Project/blob/master/documentation/milestone1_images/1.png "Image 1")

![alt text](https://github.com/MegSesh/Final-Project/blob/master/documentation/milestone1_images/2.png "Image 2")

![alt text](https://github.com/MegSesh/Final-Project/blob/master/documentation/milestone1_images/3.png "Image 3")



Problems I encountered:
- I tried having metaballs sprout from different locations, but while they appear, they don't move. This is something I'm currently trying to fix.


While working on scene composition, I am still deciding which of the following to create (both of which have reference images in the included documentation/referenceImages folder):

1. A cartoony, but peaceful looking waterfall in a forest, falling into a pond. This requires creating:
    * A terrain (probably with noise)
    * A waterfall with metaballs flowing from a height down to the pond
    * Any added scenery and shading (for trees, grass, etc)
    * Ambient music for sounds of the water falling into the pond

2. A fountain that spouts metaballs from specified locations, flows downward. When it hits some specified "ground", it starts from its original position.



## OLD README

Time to show off your new bag of procedural tricks by creating one polished final project. For this assignment you will have four weeks to create and document a portfolio piece that demonstrates your mastery of procedural thinking and implementation. You may work in groups of up to three (working alone is fine too). You may use any language / platform you choose for this assignment (given our approval if it’s not JavaScript/WebGL or C++/OpenGL).

As usual with this class, we want to encourage you to take this opportunity to explore and experiment. To get you started, however, we’ve provided a few open-ended prompts below. Interesting and complex visuals are the goal in all of these prompts, but they encourage focus on different aspects of proceduralism.

## Prompts:

- ### A classic 4k demo
  * In the spirit of the demo scene, create an animation that fits into a 4k executable that runs in real-time. Feel free to take inspiration from the many existing demos. Focus on efficiency and elegance in your implementation.
  * Examples: [cdak by Quite & orange](https://www.youtube.com/watch?v=RCh3Q08HMfs&list=PLA5E2FF8E143DA58C)

- ### A forgery
  * Taking inspiration from a particular natural phenomenon or distinctive set of visuals, implement a detailed, procedural recreation of that aesthetic. This includes modeling, texturing and object placement within your scene. Does not need to be real-time. Focus on detail and visual accuracy in your implementation.
  * Examples:
    - [Snail](https://www.shadertoy.com/view/ld3Gz2), [Journey](https://www.shadertoy.com/view/ldlcRf), Big Hero 6 Wormhole: [Image 1](http://2.bp.blogspot.com/-R-6AN2cWjwg/VTyIzIQSQfI/AAAAAAAABLA/GC0yzzz4wHw/s1600/big-hero-6-disneyscreencaps.com-10092.jpg) , [Image 2](https://i.stack.imgur.com/a9RGL.jpg)

- ### A game level
  * Like generations of game makers before us, create a game which generates an  navigable environment (eg. a roguelike dungeon, platforms) and some sort of goal or conflict (eg. enemy agents to avoid or items to collect). Must run in real-time. Aim to create an experience that will challenge players and vary noticeably in different playthroughs, whether that means complex dungeon generation, careful resource management or a sophisticated AI model. Focus on designing a system that will generate complex challenges and goals.
  * Examples: Spore, Dwarf Fortress, Minecraft, Rogue

- ### An animated environment / music visualizer
  * Create an environment full of interactive procedural animation. The goal of this project is to create an environment that feels responsive and alive. Whether or not animations are musically-driven, sound should be an important component. Focus on user interactions, motion design and experimental interfaces.
  * Examples: [Panoramical](https://www.youtube.com/watch?v=gBTTMNFXHTk), [Bound](https://www.youtube.com/watch?v=aE37l6RvF-c)
- ### Own proposal
  * You are of course **welcome to propose your own topic**. Regardless of what you choose, you and your team must research your topic and relevant techniques and come up with a detailed plan of execution. You will meet with some subset of the procedural staff before starting implementation for approval.

**Final grading will be individual** and will be based on both the final product and how well you were able to achieve your intended effect according to your execution plan. Plans change of course, and we don’t expect you to follow your execution plan to a T, but if your final project looks pretty good, but you cut corners and only did 30% of what you outlined in your design doc, you will be penalized.

But overall, have fun! This is your opportunity to work on whatever procedural project inspires you. The best way to ensure a good result is to pick something you’re passionate about. :)

## Timeline

- 4/08	Design doc due / Have met with procedural staff
- 4/18	Milestone 1 (short write-up + demo)
- 4/25	Milestone 2 (short write-up + demo)
- 5/3	Final presentations (3-5 pm, Siglab), final reports due

## Design Doc

Your design doc should follow the following template. Note, each section can be pretty short, but cover them all! This will serve as valuable documentation when showing this project off in the future AND doing a good job will make it much easier for you to succeed, so please take this seriously.

### Design Doc Template:

- #### Introduction
  * What motivates this project?
- #### Goal
  * What do you intend to achieve with this project?
- #### Inspiration/reference:
  * Attach some materials, visual or otherwise you intend as reference
- #### Specification:
  * Outline the main features of your project
- #### Techniques:
  * What are the main technical/algorithmic tools you’ll be using? Give an overview, citing  specific papers/articles
- #### Design:
  * How will your program fit together? Make a simple free-body diagram illustrating the pieces.
- #### Timeline:
  * Create a week-by-week set of milestones for each person in your group.


Along with your final project demo, you will submit a final report, in which you will update correct your original design doc as needed and add a few post-mortem items.

## Milestones

To keep you honest / on-track, we will be checking on your progress at weekly intervals, according to milestones you’ll define at the outset (pending our approval). For each of the two milestones prior to the final submission, you will submit a short write up explaining whether or not you individually achieved your goals (specifying the files where the work happened), along with a link to a demo / images. These don’t have to be super polished -- we just want to see that you’re getting things done.

Example:

“Milestone 1:
	Adam:
Made some procedural terrain code in src/terrain.js. Implemented 3D simplex noise to do it. Also applied coloring via custom shader based on this cool paper X (see src/shaders/dirt.glsl). IMAGE

Austin:
I managed to set up my voronoi diagram shader (see src/shaders/voronoi.glsl).
Experimented with different scattering techniques. It’s working with the euclidean distance metric. I’m using it in src/main.js to color stones. IMAGE

Rachel:
I tried really hard to make my toon shader work (src/shaders/toon.glsl), but I still have a bug! T_T BUGGY IMAGE. DEMO LINK”

## Final Report

In addition to your demo, you will create a final report documenting your project overall. This document should be clear enough to explain the value and details of your project to a random computer graphics person with no knowledge of this class.

### Final Report Template:

- #### Updated design doc:
  * All the sections of your original design doc, corrected if necessary
- #### Results:
  * Provide images of your finished project
- #### Evaluation (this is a big one!):
  * How well did you do? What parameters did you tune along the way? Include some WIP shots that compare intermediate results to your final. Explain why you made the decisions you did.
- #### Future work:
  * Given more time, what would you add/improve
- #### Acknowledgements:
  * Cite _EVERYTHING_. Implemented a paper? Used some royalty-free music? Talked to classmates / a professor in a way that influenced your project? Attribute everything!

## Logistics

Like every prior project, your code will be submitted via github. Fork the empty final project repo and start your code base from there. Take this as an opportunity to practice using git properly in a team setting if you’re a new user.  For each weekly submission, provide a link to your pull request. Your repo will contain all the code and documentation associated with your project. The readme for your repo will eventually be your final report. At the top level, include a folder called “documentation”, where you’ll put your design doc and milestone write-ups.

Don’t wait to merge your code! Seriously, there be dragons. Try to have a working version including all your code so that compatibility and merge issues don’t sneak up on you near the end.

## Grading

- 15% Design Doc (graded as a group)
- 15% Milestone 1 (graded as a group)
- 15% Milestone 2 (graded as a group)
- 55% Final demo + report (graded individually)

NOTE: We’ve been pretty lax about our late policy throughout the semester, but our margins on the final project are tight, therefore late submissions will NOT be accepted. If you have a significant reason for being unable to complete your goals, talk to us, and we’ll discuss getting you an incomplete and figure out an adjusted work plan with your group.
