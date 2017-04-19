## Music Visualizer

Inspired by the game Panoramical, the goal of this project is to create a interactive procedural music visualizer. Since the music will also be procedurally generated, we hope to achieve a greater level of audio-visual synchronization than a generic unchoreographed visualizer.

### Procedural Music (Xiaomao)
The two main implementations done this week were rhythm generation and melody generation. The rhythms are generated using the Bjorklund algorithm which attempts to evenly spread out notes, creating Euclidian rhythms. That is, given a number of notes, and a number of time intervals, this algorithm attempts to evenly distribute the notes among the time intervals (assuming #notes < #intervals) [2]. The main purpose of this algorithm is to create interesting beats for the music.  This can be heard in the underlying drum beats in the default scene.

The procedural melodies are generated using modifications of the Morse-Thue Fractal and the Earthworm sequence. The methods are taken from Gustavo Diaz-Jerez's blog where he details how these procedural number patterns were used in his procedural music application [3]. In short, the Morse-Thue algorithm requires a base and a multiplier. A counter is started and multiplied by the multiplier.  This number is converted from the chosen base to base 10. Then, the sum of the digits of the result modulus the number of notes in the scale is used to determine a note to play.

The Earthworm sequence requires an initial value, a multiplier, and a constant. At every iteration, the value is the previous value times the multiplier. The constant determines how many digits to keep. If the constant is 3, the only the first three rightmost digits of the number is kept. The same modulus operation as above is used to determine the note.

Both of these algorithms are implemented in this version of the code. `melodyGenerator` by uses the Morse-Thue while `EarthWorm` uses the Earthworm sequence to generate a set of notes. `rhythmicMelodyGenerator` combines the output of a Morse-Thue sequence with a Euclidian rhythm.

The Soundfont-player and Tonal.js libaries are used to generate scales and play the MIDI notes [4][5]. The main music play functions are located in the `onUpdate` function in `main.js`. I recently discovered a bug where preloading multiple channels/tracks of audio causes static noise build up in the overall track.  Thus, if this occurs, disable a few `.schedule` calls, which may help alleviate the problem.  In the next version, I will manually time the notes which alleviates this problem.  The current code utilizes 3 instruments: an acoustic piano, a polysynth, and a synthetic drumset. The drum lines demonstrate how the Euclidian rhythms can be combined to create beats, while the other two instruments demonstrate the melody generation algorithms.

One noticeable issue is that sometimes the melody generation sometimes is too random. One new goal for the next week is to "decrease" the randomness by artificially introducing constant structures and musical motifs. One example present in the code currently is that the `EarthWorm` function takes the generated EarthWorm sequence and injects a constant note at every other interval, which makes the resulting sequence sound more "musical".

### Visualizer (Brian)
Milestone 1:

* Handles basic user inputs
* Framework code for moving camera
* Framework code for triggering scene changes
* Implemented 2 scenes:

![scene 1](http://i.imgur.com/2ZfjrG1.png)

![scene 2](http://i.imgur.com/vTInVNX.png)

Milestone 2:

* User input to trigger musical and visual effect
* Implement 2 additional scenes
* Implement post effects to change tone/mood of scenes
* Work on transitions between scenes
* Integrate with the music to match the tone/mood

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
* [Brian] Experiment with more parameters to tune visuals
* [Brian] Implement 2 scenes
#### 5/3 Final presentations (3-5 pm, Siglab), final reports due
* Final Report
* [Xiaomao] Have cool player input screen
* [Brian] Implement 1 scene + polish

### Demo
[Link](https://xnieamo.github.io/Final-Project/)

## Resources
[1] https://github.com/spite/THREE.MeshLine - Three.js lines are a little wonky. This fixes issues with using linewidth.

[2] http://cgm.cs.mcgill.ca/~godfried/publications/banff.pdf

[3] http://www.gustavodiazjerez.com/gdj/?cat=15

[4] https://github.com/danigb/soundfont-player

[5] https://github.com/danigb/tonal
