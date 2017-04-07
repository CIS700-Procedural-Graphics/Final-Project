Hannah Bollar
======================

<NEED TO ADD LINK TO ACTUAL GITHUB WHERE PROJ IS VIEWED>

**University of Pennsylvania, CIS 700: Procedural Graphics, Final Project**

**Project Proposal: Music Visualizer**

Milestone 1
------------
- Set up physical aspect of this: positioning of spots where balls shoot out, interpreting the music as data (but dont have to do anything with the data yet), set up water plane in space, surrounding environment box [skybox], gui to pick which music to play [for now just have it as a pause and play button for playing one set of music], have all the shader materials set up for everything but the balls [balls will have gpu manipulations based on time so for now leave as default] 

Milestone 2
------------

Milestone 3 [ready for submission]
------------

NOTES:
------------

music visualizer:

particles, ribbon creation, shape visualization, using what shader

2 diff variations at min
3 diff variations of the visualizer at max [maybe dep on frequency]

can build texture in substance designer?

DO THE YOUTUBE VIDEO FOR PIANO MUSIC / piano interpretation of music based on keys
https://www.youtube.com/watch?v=fpViZkhpPHk&list=PL_2OwBBRw9hDSXyaIPrCeKUCNnCrHAHEn

some particles just floating around and when hit by an object they bounce --> but they have an origin theyre supposed to try and get back to --> like nop's plane variation

so particles coming from keys at the bottom hitting through the plane particles

try and do it on the gpu? since just particles
--> based on music input for specific values have the rgb color input stand as whether or not on plane or seen yet [note this is done with time] --> maybe have a loading screen while this computation is being done --> then once have all proper data from music for the gpu --> run as particle sim --> so can load up from two different piano music files to start with
like this one: https://www.youtube.com/watch?v=KiRLdhnDKwc&list=PL_2OwBBRw9hDSXyaIPrCeKUCNnCrHAHEn&index=14 <- to demonstrate following mariano's technique of doing it as height for buildings

--> if do it on the gpu can have a max number of particles to begin with where input includes on/off/start time to visualize it --> note this is loaded up --> just loop through once start time becomes the max for the music vid and reloop back time to beg[like with mariano's cube anim --> just reloop as a vid]

can do this at bottom with opacity in distance so cant see moving texture
https://www.youtube.com/watch?v=82Q6DRqf9H4&list=PL_2OwBBRw9hDKSZvusG6aBFh6bx32E9i5
have texture as color and opacity to be sent in for plane shader for where the particles come out at the bottom -- OR -- have it as the plane where once the particles cross through it --> go all crazy instead of in the plane music lines
^^ from this following color scheme of starting at purple and that blue --> once across  the purple going to that blue to and that blue to yellow/limegreen? 
-- to do this maybe have the third component of the color not used to be 0 or 1 for picking what color it will switch to and just grab from a vec2 in the gpu

OR MAYBE ADD IN A FIREBALL GIF VISUALIZER??

PARTICLES: tune / piano style based on keys
BACKGROUND COLORING EFFECT: the beat itself of the music

small balls each in a row --> once break through particle plane they explode into at least 5 smaller ball particles --> when outside particular spherical area [OR AFTER A PARTICULAR AMOUNT OF TIME IN EXISTANCE] -- also size of objects after hitting plane decreases based time of existance --> delete and bring back to orig so maintain total num of particles just with pos and seen/not

chromeexperiments --> CHECK OUT FOR WORK

MIDI FILE TYPE

MOUSE MANIPULATION WHEN CLICKING
BARS ALWAYS MADE OF PARTICLES -  amount of influence they get by noise field --> increases dep on height

TRUNG & NOP