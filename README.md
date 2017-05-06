# Music Visualizer

Inspired by the game Panoramical, the goal of this project is to create a interactive procedural music visualizer. Since the music will also be procedurally generated, we hope to achieve a greater level of audio-visual synchronization than a generic unchoreographed visualizer.

## Design Doc

### Procedural Music (Xiaomao)
The two main implementations done this week were rhythm generation and melody generation. The rhythms are generated using the Bjorklund algorithm which attempts to evenly spread out notes, creating Euclidian rhythms. That is, given a number of notes, and a number of time intervals, this algorithm attempts to evenly distribute the notes among the time intervals (assuming #notes < #intervals) [3]. The main purpose of this algorithm is to create interesting beats for the music.  This can be heard in the underlying drum beats in the default scene.

The procedural melodies are generated using modifications of the Morse-Thue Fractal and the Earthworm sequence. The methods are taken from Gustavo Diaz-Jerez's blog where he details how these procedural number patterns were used in his procedural music application [2]. In short, the Morse-Thue algorithm requires a base and a multiplier. A counter is started and multiplied by the multiplier.  This number is converted from the chosen base to base 10. Then, the sum of the digits of the result modulus the number of notes in the scale is used to determine a note to play.

The Earthworm sequence requires an initial value, a multiplier, and a constant. At every iteration, the value is the previous value times the multiplier. The constant determines how many digits to keep. If the constant is 3, the only the first three rightmost digits of the number is kept. The same modulus operation as above is used to determine the note.

Both of these algorithms are implemented in this version of the code. `melodyGenerator` by uses the Morse-Thue while `EarthWorm` uses the Earthworm sequence to generate a set of notes. `rhythmicMelodyGenerator` combines the output of a Morse-Thue sequence with a Euclidian rhythm.

The Soundfont-player and Tonal.js libaries are used to generate scales and play the MIDI notes [8][9]. The main music play functions are located in the `onUpdate` function in `main.js`. I recently discovered a bug where preloading multiple channels/tracks of audio causes static noise build up in the overall track.  Thus, if this occurs, disable a few `.schedule` calls, which may help alleviate the problem.  In the next version, I will manually time the notes which alleviates this problem.  The current code utilizes 3 instruments: an acoustic piano, a polysynth, and a synthetic drumset. The drum lines demonstrate how the Euclidian rhythms can be combined to create beats, while the other two instruments demonstrate the melody generation algorithms.

One noticeable issue is that sometimes the melody generation sometimes is too random. One new goal for the next week is to "decrease" the randomness by artificially introducing constant structures and musical motifs. One example present in the code currently is that the `EarthWorm` function takes the generated EarthWorm sequence and injects a constant note at every other interval, which makes the resulting sequence sound more "musical".

#### Milestone 2
The bass line is completely procedural, generated using a random chord (which right now is hand selected, but will be changed to just picking 1 note and letting the program generate the chord). Then, there are 6 parameters that can be tuned to change the rhythm.  The parameters so far are hard coded and need to be changed into variables to allow for user input.

The harmony lines are approached similarly to the bass line. However, instead of using individual notes in a chord, random music motifs and transformations are applied to the note (e.g. C -> C D C).  The transformations are chosen randomly. This needs to be tuned a bit so it sounds better. The number of repetitions for each motif can be controlled using one of the random sequences described above.

The melody line is the least random. Currently, it takes a descending sequence of notes and applies slight variations to create a theme. This barely takes any random input at all currently. Furthermore, this needs additional variations to be coded in and is a work in progress.


### Visualizer (Brian)
Milestone 1:

* Handles basic user inputs
* Framework code for moving camera
* Framework code for triggering scene changes
* Implemented 2 scenes

Milestone 2:

* [Brian] Experimented with music generation using alternating notes as anchor points (inspired by: https://www.youtube.com/watch?v=UYU5POqHdeA). We were having trouble making music sound not random. One idea we had was to have the music 'reset' itself by returning to a common note(s). We thought that starting with two alternating notes, we could then build up a song by filling in the space between them using known patterns or other methods.
* [Brian] Implement lake scene

Final Demo:
![scenes](https://i.imgur.com/0uDxvwA.png)
* [Brian] Implemented loop based music gen method
* [Brian] Polish lake scene

### Inspiration
![inspiration](http://i.imgur.com/qFGr4vh.png)
Inspiration from [Panoramical](http://panoramic.al/) and [Proteus](http://twistedtreegames.com/proteus/).

### Design
* Some ideas: procedural weather, lighting/color/tone, camera movement, post-processing effects
* We will have an API to pass generated music information from the music generator to the visualization generator
* Shared data: BPM, instruments, major/minor key, notes, scale
* Attempt different styles of music : jazz, electronic, etc.

### Timeline:
#### 4/11 Milestone 0.5
* [Xiaomao] Basic MIDI player in place (likely only 1 instrument)
* [Xiaomao] Input string to play predetermined set of notes (no proceduralism yet)
* [Brian] Sketch plans for 5 scenes
* [Brian] Basic terrain generation
* [Brian] Framework for scene/camera changing
#### 4/18 Milestone 1 (short write-up + demo)
* Integrate!
* [Xiaomao] Real time information to pass to the visualizer
* [Xiaomao] Some procedural control over the music (chords, scales, tempo, etc.)
* [Brian] Implement tunable visual parameters controlled by music input
* [Brian] Implement 2 scenes + shader effects
#### 4/25 Milestone 2 (short write-up + demo)
* Integrate!
* [Xiaomao] Full procedural control over the music generation (maybe have different randomization algorithms to see how well each works with the sounds)
* [Xiaomao] Maybe allow some user input for parameters
* [Brian] Experimented with music structures to get a feel for type of music we are able to generate  (https://onlinesequencer.net/464784, https://onlinesequencer.net/464779)
 * [Brian] Have callbacks in audio code trigger visual effects
 * [Brian] Experiment with more parameters to tune visuals
 * [Brian] Working on implementing reflective water - still need to fix the mirror shading
#### 5/3 Final presentations (3-5 pm, Siglab), final reports due
* Final Report
* [Xiaomao] Have cool player input screen
* [Brian] Polish scene
* [Brian] Implemented loop based music gen method

## Results

![scenes](https://i.imgur.com/YOv032T.png)

Live Demo: [Link](https://xnieamo.github.io/Final-Project/)

Video Demo: [Xiaomao Music](https://youtu.be/pYcoIvyBIQo), [Brian Music](https://youtu.be/GZ5gUISoN0Y)


## Evaluation

### Visualizer
My primary goal for the visualizer was to create something that would match well with the music we generated. I experimented with a variety of scenes inspired by Panoramical and demoscenes. 

One of the experimental scenes was a abstract sphere with lines slowly emerging from the center. The idea was to use a flat color and an initially fixed camera perspective to simulate a 2D looking effect. Then when transitioning the scene, the camera would move and viewer can then see that the scene is actually 3D.

Next, I experimented with a rotating planet scene. I used perlin noise to generate the terrain and randomly generated a rotating star field in the background.

The most difficult part about making the visualizer was generating scenes without music. It was hard to get a feel for what type of mood/tempo the music generator would be able to create, so the experimental scenes were all very generic. After experimenting with the music, we found that slow and simple pieces sounded the most coherent. To match this style, I decided to implement a lake scene with some weather effects. 

The floating icebergs in the scene were created as cone geometry with vertices randomly extruded in the vertex shader. To simulate the bobbing motion, I used an oscillating function that holds the lowest position a little bit longer than the highest position. This seems to look a bit more natural than using a pure sine function. Lastly, to simulate the forward motion of the camera, the icebergs also move forward. However, in order to not obscure the camera’s view, the camera’s position applies a repelling force on the icebergs that are too close. This pushes the icebergs to the left or right depending on the side it is closer to. The lightning is generated using MeshLines and given a large initial downwards velocity. The horizontal velocities are randomly set at random intervals to give it a jagged look. The rain effect is also generated using MeshLines. The trailing parameter gives the lines a droplet shape. Lastly, droplets that get close to the surface of the lake will have their positions passed into the lake shader. This allows us to generate a splash effect. To create the lake, I used the Mirror class from Three.js and then applied an oscillating offset based on time and position to create the ripple effect. Finally, I added some randomly generated forward moving particles to give the scene a bit more depth and add to the impression of camera movement.

To combine the visualization with the music, we created a framework of callbacks that could be triggered when a note is played. For this project, we had 3 separate callbacks that responded to the melody, harmony and bass separately. For the demo, lightning was generated based on the melody, the bubbles were generated based on the harmony and the icebergs were generated based on the bass.

For our final demo, we decided to present just the lake scene because we thought that it fit best with the music we were able to generate.

### Music

The main goal was to create a procedural music engine that would allow for generating different music with minimal user input. I started by looking at different implementations of procedural music available online and was mainly inspired by the FractMus software by Gustavo Diaz-Jerez [2].  He uses various fractals and other number sequences to pick out notes to play.  However, this implementation was very limited and required finding the few random number seeds that would make it sound like music and not random notes.  I also experimented with Euclidean rhythms which come from an algorithm by Godfried Toussaint at McGill University [3].  The rhythms were actually rather good. However, they are also limited in the sense that they only provided when a note should be played and when to rest and did not specify the length of the notes.

The second iteration of the music generation algorithm attempted to use 1D smoothed Perlin [5] noise to create a contour which would form the musical melody. This was inspired by reading an online article describing how to create a melody for EDM songs [6].  I approached the contour problem by generating the noise curve and then subsampling along regular intervals.  However, this still did not create sounds that were very coherent.  A critical aspect that we determined to be missing, after listening and watching many videos on YouTube,  was the actual rhythm of the song.  Simple rhythms, like short-short-long or long-short-long, seemed to make all the difference.  Furthermore, we found that we needed to repeat our main theme much more often.  With this in mind, we attempted to implement these characteristics into our music engine.  Unfortunately, the end product still lacked some continuity between different sections of the song.  

The third iteration of the algorithm involved me manually identifying note patterns in catchy songs across YouTube. Then, a hard-coded table of these patterns is used to randomly choose a few patterns and combine them.  This allowed me to create the repetitive main themes similar to that of many catchy pop/EDM songs.  Then, using the 1D smoothed noise from the second iteration, I apply different variations and appended these to the main theme. Variations could include transposing the notes up and down, applying different patterns, and changing the tempo.  The final results would be something like Main Theme -> Variation -> Main Theme -> Variation -> etc. This pattern worked fairly well and can be heard in the first demo video.

Another similar algorithm we tried was to generate a loop sequence of 5-10 notes. Then using a manually generated set of patterns (each consisting of a relative note progression and the corresponding rhythm), we swapped out notes of the loop sequence with the patterns. This worked well for slow pieces. A sample of this method can be heard in the second demo video.

A design decision I made halfway through was to separate the music code into three separate parts: melody, harmony, and bass.  This made sense to me since musically these are the main components of a song.  While generating simple bass lines was straightforward, especially when combining several different Euclidean rhythms, the generation of the harmony proved difficult.  This is because without very much music theory training, understanding how the notes should interact was fairly difficult.  Although I read some articles online, none of them provided the depth necessary to allow me to fully implement an algorithm that would create a suitable harmony for each melody.  Furthermore, I felt that I would not have the necessary amount of time to learn of this.  Therefore, I settled for using simple but nice sounding chord progressions for the harmony.

To actually play the music as well write code that would generate the notes, I used two javascript libraries: tonal.js and soundfont-player.js [8][9].  These allowed me to play with music theory via code and then play MIDI notes. One thing that I did not know how to use well was the attack, decay, sustain, release envelopes which can be used to manipulate the sounds of the MIDI files.  This helped make some the instruments sound much better.

In retrospect, the procedural music generation would have been more successful had I picked an easier genre to attempt to replicate ahead of time.  I had initially wanted the music to sound more classical.  However, the musical patterns and structure proved to be too complicated.  Instead, had I tried to generate simpler pop/EDM songs which make heavy use of repeated themes, I would have had more time to tune specific details, like the sounds of the instruments, varying volume over time, etc. 


## Future Work

The biggest challenge of this project was generating music that did not sound like random notes playing. A good portion of the time on this project was spent dissecting the patterns and structure of songs.  One thing that would improve the music a lot would be to have a better syncing between the melody, harmony, and bass.  Because they are generated separately, right now there is a lack interaction between the lines and the complexity of each line is also limited.  Additionally, having better sounding instruments/MIDI notes would go a long way as well.

On the visualization side of things, we would like to implement additional scenes to match other music pieces that we generate. To create more immersive experiences with more complex music, it would be interesting to further develop the semi-procedural approach where the music is partially human composed and partially controlled by a user input tunable music generation engine. Having artistic control over the music would also making generation of the scenes much easier and more aligned with the mood of the music.

## Acknowledgements

[1] http://joshparnell.com/blog/music-samples/

[2] http://www.gustavodiazjerez.com/gdj/?cat=15 

[3] http://cgm.cs.mcgill.ca/~godfried/publications/banff.pdf 

[4] http://edmprod.com/ultimate-melody-guide/ 

[5] http://www.michaelbromley.co.uk/blog/90/simple-1d-noise-in-javascript 

[6] http://edmprod.com/ultimate-melody-guide/ 

[7] https://github.com/spite/THREE.MeshLine

[8] https://github.com/danigb/tonal 

[9] https://github.com/danigb/soundfont-player 
