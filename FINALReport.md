Hannah Bollar. PennKey: hbollar.
======================

**University of Pennsylvania, CIS 700: Procedural Graphics, Final Project**

# Final Report

Turn volume on and possibly wear headphones to hear the sound.
#### Click [HERE](https://hanbollar.github.io/Final-Project/) to View the Current Project

### About the Look of the Project

This project interprets the wave file data of four particular songs and emits particles from six balls that each correspond to a particular set of binned bits of the wave file data. If the value of the bits for a bin are above a particular threshold then that bin's ball will emit a particle. The coloring of the particle then depends on how much the actual value is greater than the tested threshold value. The colors begin at white then as the difference between the two values becomes larger the colors shift to yellow, orange, red, and finally pink. As the particles are emitted, there is a bit of noise affecting their movement as they shift through space that increases the further the particles are from the center ball. A particle dies and is removed once it is too far from the center ball. As explained in the 'The Audio' section, this visualizer works well for vibrant songs that have varying output in terms of strong tones but are constantly changing distribution in regards to which tones have more importance during particular moments of the song.

### The Audio

- #### Legend of Zelda - Wind Waker's Main Theme [Source Video](https://www.youtube.com/watch?v=gEoU70DXr90)
  ###### Demonstration of a vibrant song. Its output varies between even tones [mostly whites] and strong tones [pinks and reds] while also allowing for a consistently changing number of balls from which particles are being emitted. The most interesting version of song to be used for this visualizer.

- #### The Turkish March an orchestra version (Rondo Alla Turca) [Source Video](https://www.youtube.com/watch?v=se_Swf7-68M)
  ###### Demonstration of a pretty even song on the music visualizer that doesnt become too powerful. Particles come out pretty consistently from each ball output for this song; however, throughout the entirety of the piece, the particles remain mostly in the white, yellow, and orange range.

- #### Maple Story Music - Ellinia [Source Video](https://www.youtube.com/watch?v=_M-ytoRguS8)
  ###### Demonstration of a build up song using this music visualizer. Very few particles come out at the beginning and almost all are white, and by the end the song is in full force showing most colors for the particles and outputing from all balls on the ring.

- #### Pirates of the Caribbean [Source Video](https://www.youtube.com/watch?v=27mB8verLK8)
  ###### Demonstration of a strong and powerful song using this music visualizer. Shows strong color variation from the particles and particles almost consistently come out of each ball.

## Updated Design Doc

- #### Introduction - What motivates this project?

  * I've worked with learning a lot of different procedural techniques throughout this past semester now I want to see if I can combine parts of them with my interest in particle simulations.

- #### Goal - What do you intend to achieve with this project?

  * Creating a functioning music visualizer that not only has manipulations based on coloring/shader information but also noise and time manipulations to create the piece altogether. Main idea - take what i learned this semester and using artistic choices decide how to incorporate them all together to build a final cohesive project.

- #### Inspiration/reference - Attach some materials, visual or otherwise you intend as reference

  * Inspirational youtube videos
    - [Clip 1](https://www.youtube.com/watch?v=fpViZkhpPHk&list=PL_2OwBBRw9hDSXyaIPrCeKUCNnCrHAHEn)
    - [Clip 2](https://www.youtube.com/watch?v=KiRLdhnDKwc&list=PL_2OwBBRw9hDSXyaIPrCeKUCNnCrHAHEn&index=14)
    - [Clip 3](https://www.youtube.com/watch?v=82Q6DRqf9H4&list=PL_2OwBBRw9hDKSZvusG6aBFh6bx32E9i5)
  * Working with Wave file data 
    - [Wave File Data Formatting](https://blogs.msdn.microsoft.com/dawate/2009/06/23/intro-to-audio-programming-part-2-demystifying-the-wav-format/)

- #### Specification - Outline the main features of your project

  * (1) RGB interpolation based on eye location in reference to viewer for coloring
  * (2) Working on shader manipulations for texture and coloring
    - the plane uses a blue based opacity
    - the balls are rendered with an opacity and a coloring such that the green and purple remain in the same locations relative to the eye position for the object to give the ringed effect
  * (3) Update and timers
    - timing the update functions to properly maintain the movement of the particles and the reloading of particular pieces when each song plays
  * (4) Noise function that affects the music particles position in space with increasing amplitude the farther the particles get from their source
    - Note that the noise function is entirely position based so all points that come from each ball will follow the same noise based path [looked better this way -with the lines- than not having the lines since it more easily shows a pause in the level of power of in the music]
  * (5) using THREE.js sound manipulation tools
    - interpretation of wave file data
    - allow for the playing of multiple pieces of music [including restarting, playing, pausing etc in sequence]

- #### Design:
  ![programDesign][plan]

- #### Timeline of how the work was carried out

  * Milestone 1
    - positioning of spots where balls shoot out
    - gui to pick which music to play [for now just have it as a pause and play button for playing one set of music]
    - have all the shader materials set up for everything but the balls [balls will have gpu manipulations based on time so for now leave as default]
    - add box to pause and play
    - add box to maintain repeat for song or not
    - make so the loaded song plays out the speakers with the right timing [ie using same timer as gl]
  * Milestone 2
    - set up using of music data for particles being shot out from particular location - by indexing from 0 - 7 [later to be implemented that the frequency will convert to fill the 0-7 indexing bins once i have the proper way to interpret the wave file data]
    - add noise to the movement of the balls
    - particles disappear when theyre farther than a specific distance from the center of the region
    - set up Particles manipulation class and proper connections between framework and data held within the class so can easily create / add / manipulate all at once
    - rebuilt skybox with proper coloring
  * Milestone 3 [ready for submission]
    - display time in secs and in proper minutes per the amount remaining in the song
    - readjust bin allocation for which bits being used from the wave file data
    - set up restart button for the music
    - add color val based on being specific amounts above the particle show up threshold
    - add actual music interpretation of the wave data
    - allow for loading of different music [used large variation in song type to demonstrate how my visualizer performs for each kind]
    - noise affecting the points more by distance
    - change the music selection so done in a drop down menu and not a slider
    - set up gui element for which song is currently playing
    - when loading a new song - if currently paused on prev song, this song starts as paused

## Results
  * Pirates of the Caribbean
    - very colorful uses most balls throughout the duration of the song.
    - Also demonstrates how the gui looks
  ![PCaribbean][imgP]
  * Wind Waker
    - less colorful at the beginning and shows the cuts demonstrating particular balls bins not getting above their set outputs
  ![WWaker][imgW]

## Evaluation
  * I do not have any WIP shots to compare to my final version; however, the main visual design remained about the same. Instead the backend implementation of the project varied a lot between the different milestones [- aka the version i had written in my paper notes had to be changed-]. This difference is because I originally wanted to do most of the particle movement and manipulations on the GPU instead of as point positions but I found it to be a lot more difficult given the time constraints to do specifically what I wanted. Instead, after the first milestone I switched the planned implementation for the particles to be actually THREE.js point objects which is another reason why the first and second milestones of the project do not have much particle manipulation in them yet. I spent most of the second milestone making the understanding that the gpu idea wasn't going to work for me and then switching to the new implementation. Additionally I still had yet to find a midi file for the songs I wanted to play so after discussing with Adam I decided to use wave implementations instead. Since I spent most of my time trying the gpu fix but never getting it working and ultimately switching to the current implementation, I still did not have time to fully do/understand the wave file parsing for how I wanted to use it. Therefore during the second milestone I focused on making sure most other features of the particle shooters were implemented so that all I had to do was music manipulation during the third milestone [and obviously debug any missed things from before]. I spent the time for the third milestone working with music manipulations - most of which was spent on picking a proper noise function for the circular noise added to the particle movements [kept getting most of the particles moving left so had to keep adjusting parameters to get better noise pattern] and also picking how the bin distribution would work so that the distribution of balls being emitted from the bins worked to some degree for the four main song variations.
  * Overall, I feel I matched up with my original milestone goals as I had planned for milestone 1 to be about set up and 2 to be where most of the work occured with 3 being a carry over for bugs and finishing features, which allowed me more leeway since most of my implementation during milestone 2 actually backfired. I enjoy the final product and like how it can work for most song variations since I fine tuned it to be able to do so.

## Future Work
  * Given more time I wish I had actually been able to get the gpu aspect working properly. Additional features I would have also liked to add - more effects in the background instead of just a skybox [ie including moving/bouncing primitives/meshes], allowing a user to load up their own files for parsing, and maybe having a whole camera sequence set up for the four original songs so the user can just sit back and watch it play [ie have two modes - one for interaction in which you can rotate around the screen which is how it is currently and one where it's precreated camera sequences]. Given even more time - I would have also liked at some point to add a click feature where if you click somewhere it acts as an attractor for the particles.

## Acknowledgements
  * Music
    - Check back at 'The Audio Section'
  * People
    - Adam - advice on what type of file to use - originally went with midi file then had trouble finding the particular sources I wanted so discussed again and decided to work with wave files instead.
  * StackOverflow was a great friend throughout this project especially in terms of debugging using music and properly parsing the data

[imgP]: ./images/pCandGui.png "ImageP"
[imgW]: ./images/windW.png "ImageW"
[plan]: ./images/pDesign.png "programDesign"