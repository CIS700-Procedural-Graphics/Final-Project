# Procedural Pokemon
no memes allowed

## Milestone 3 Accomplishments 
- Finished project, polished up the map.

## Milestone 2 Accomplishments
### David
- Made the game multiplayer. Networking for proceduralism. (this is like a 4/5 on the difficulty scale)
- Slick differential updates to sync game state
- Fixed all (I think) server-side race conditions and bugs
- Implemented randomized behavior based off of a global seed variables defined by the user, so instaces of our randomized pokemon game are standardized for each player on the network
- Refactors

### Joseph
- Updated sprites for the character, terrtain, and Pokemon
- Implemented biomes - world is split into four quadrants (grass, desert, water, snow), and the sprite textures now have color to better display the distinct biomes
- Expanded Tile data structure to hold pokemon information, as well as whether or not certain parts of the terrain are traversable
- Completed random pokemon spawn algorithm to spawn specific pokemon types in each biome. For example, Charmanders will not spawn in the desert, Bulbasaur's will not spawn in the water, etc.
- Changed Sprite class so it is able to handle sprites not just of size 16x16
-Files changed: Tile.js, World.js, RenderEngine.js, App.js, Sprite.js

#### All tasks specified in the milestone (updated doc we pinged to rachel and later forwarded to Adam) were completed

## Milestone 1 Accomplishments

### David
- Configured infrastructure and set up the project. 
- Implemented sprite importing and rendering.
- Created a base world using the current sprite set.
- Implemented player.js and enabled player movement throughout the scene.
- Implemented the viewport so we only see a certain poprtion of the world.
- File changed: Made changes in all files (see commits).

### Joseph 
- Implemented Tile logic for use by the Grid. Tiles will be used to later determine which parts of the world belong to which biome, as well as which parts of the world are traversable, or will hold wild pokemon, etc. Currently used to holds symbols that tells the render engine what to render.
- Implemented render engine to render information in a tile. For now just the ability to render a single sprite to the canvas. David expanded this functionality to create the vanilla world you see.
- Developed logic for randomly spawning 'pokemon' throughout the world. Each index in the grid currently has some percentage change of spawning a pokemon. Currently the pokemon are represented by a symbol.
- Files changed: Tile.js, Grid.js, RenderEngine.js, App.js
