## Music Visualizer

# Procedural Music (Xiaomao)
The two main implementations done this week were rhythm generation and melody generation. The rhythms are generated using the Bjorklund algorithm which attempts to evenly spread out notes, creating Euclidian rhythms. That is, given a number of notes, and a number of time intervals, this algorithm attempts to evenly distribute the notes among the time intervals (assuming #notes < #intervals) [2]. The main purpose of this algorithm is to create interesting beats for the music.  This can be heard in the underlying drum beats in the default scene.

The procedural melodies are generated using modifications of the Morse-Thue Fractal and the Earthworm sequence. The methods are taken from Gustavo Diaz-Jerez's blog where he details how these procedural number patterns were used in his procedural music application [3]. In short, the Morse-Thue algorithm requires a base and a multiplier. A counter is started and multiplied by the multiplier.  This number is converted from the chosen base to base 10. Then, the sum of the digits of the result modulus the number of notes in the scale is used to determine a note to play. 

The Earthworm sequence requires an initial value, a multiplier, and a constant. At every iteration, the value is the previous value times the multiplier. The constant determines how many digits to keep. If the constant is 3, the only the first three rightmost digits of the number is kept. The same modulus operation as above is used to determine the note. 

Both of these algorithms are implemented in this version of the code. `melodyGenerator` by uses the Morse-Thue while `EarthWorm` uses the Earthworm sequence to generate a set of notes. `rhythmicMelodyGenerator` combines the output of a Morse-Thue sequence with a Euclidian rhythm. 

The Soundfont-player and Tonal.js libaries are used to generate scales and play the MIDI notes [4][5]. The main music play functions are located in the `onUpdate` function in `main.js`. I recently discovered a bug where preloading multiple channels/tracks of audio causes static noise build up in the overall track.  Thus, if this occurs, disable a few `.schedule` calls, which may help alleviate the problem.  In the next version, I will manually time the notes which alleviates this problem.  The current code utilizes 3 instruments: an acoustic piano, a polysynth, and a synthetic drumset. The drum lines demonstrate how the Euclidian rhythms can be combined to create beats, while the other two instruments demonstrate the melody generation algorithms.

One noticeable issue is that sometimes the melody generation sometimes is too random. One new goal for the next week is to "decrease" the randomness by artificially introducing constant structures and musical motifs. One example present in the code currently is that the `EarthWorm` function takes the generated EarthWorm sequence and injects a constant note at every other interval, which makes the resulting sequence sound more "musical".

# Visualizer (Brian)


## Resources
[1] https://github.com/spite/THREE.MeshLine - Three.js lines are a little wonky. This fixes issues with using linewidth.

[2] http://cgm.cs.mcgill.ca/~godfried/publications/banff.pdf 

[3] http://www.gustavodiazjerez.com/gdj/?cat=15

[4] https://github.com/danigb/soundfont-player

[5] https://github.com/danigb/tonal
