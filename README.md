Hannah Bollar [Single Person Project]
======================

**University of Pennsylvania, CIS 700: Procedural Graphics, Final Project**

## View the Project

NOTE: PROJECT STILL IN PROGRESS. Turn volume on and possibly wear headphones to hear the sound.

###### [Click Here to View the Current Project](https://hanbollar.github.io/Final-Project/)

## The Audio

Maple Story Music - Ellinia

###### [Click Here to View the Source Video](https://www.youtube.com/watch?v=_M-ytoRguS8)

## The Project

Project Proposal: Music Visualizer
------------

- #### Introduction
  ###### What motivates this project?

  * I've worked with learning a lot of different procedural techniques throughout this past semester now I want to see if I can combine parts of them with my interest in particle simulations.

- #### Goal
  ###### What do you intend to achieve with this project?

  * Creating a functioning music visualizer that not only has manipulations based on coloring/shader information but also noise and time manipulations to create the piece altogether.

- #### Inspiration/reference: 
  ###### Attach some materials, visual or otherwise you intend as reference

  * See notes below - in particular the youtube videos

- #### Specification:
  ###### Outline the main features of your project

  * See timeline for feature and notes below for more information. [when i clean up this file for the final submission of the project the notes will be gone and the features will be properly detailed here instead of in the timeline area]

- #### Techniques:
  ###### What are the main technical/algorithmic tools you’ll be using? Give an overview, citing  specific papers/articles

  * Building this project as I have been doing with the others - entirely javascript based with noise manipulations from a helper file. 
  * (1) Working on shaders and particle manipulations in the gpu
  * (2) Varying noise functions
  * (3) how to interpret midi file data so can visualize the music properly [https://chrisballprojects.wordpress.com/2013/03/17/midi-visualisations-in-processing/]

- #### Design:
  ###### How will your program fit together? Make a simple free-body diagram illustrating the pieces.
  ![](./images/PicOfFileSetup.png)

- #### Timeline:
  ###### Create a week-by-week set of milestones for each person in your group.
  * See notes below

Timeline
------------
- #### Milestone 1
	* positioning of spots where balls shoot out
	* interpreting the music as data (but dont have to do anything with the data yet)
	* set up water plane in space, surrounding environment box [skybox]
	* gui to pick which music to play [for now just have it as a pause and play button for playing one set of music]
	* have all the shader materials set up for everything but the balls [balls will have gpu manipulations based on time so for now leave as default]
	* add box to pause and play
	* add box to maintain repeat for song or not
	* make so the loaded song plays out the speakers with the right timing [ie using same timer as gl]

- #### Milestone 2
	* Set up using of music data for balls being shot out from particular location
	* make the wave bottom move/flow
	* add noise to the movement of the balls [ie the farther up they go the more the noise affects them]
	* add timer for life of the balls [life meaning being shown visually or not - to maintain the same number of balls overall]

- #### Milestone 3 [ready for submission]
	* finish all parts of prev milestones not yet completed and see notes for additional features to implement 
	* note: should be fully functioning before this deadline
	* [if time] add ability for user to manipulate [ie click somewhere and the particles react - but only for clicking - could act as an attractor or a repellor
	* [if time] make it so users can input a midi file and that i can load from it [ ie can load the visualizer for any given file ] - set timer so that song loops continuously

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