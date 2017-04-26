### Milestone-2 Report:

### Rishabh

- Finally we have the server thanks to Austin!! We haven't merged our code, so it is not yet deployed. The texture does not become more defined as you go closer as I have hardcoded the number of octaves. I will be changing them based on the viewer distance to change the levels of detail.

![](../images/shadercesium.gif)


- `shaders/sinenoise-frag.glsl` fragment shader is an accidental marble texture that I did not intend to make.

    I found articles on warping noise functions with other noise functions while looking up Voronoi diagrams. I thought I could use the Ridged noise with just sine functions to get cool streams and rivers. [cegaton](https://blender.stackexchange.com/questions/45892/is-it-possible-to-distort-a-voronoi-texture-like-the-wave-textures-distortion-sl) does it using voronoise.

    So I tried it, and It looks more like marble than rivers. I don't think it will work for this project.

    I am still understanding voronoise and how to integrate it to the texture I already have.

![](../images/sinenoise.gif)

- Demo (of marble texture): https://rms13.github.io/Project1-Noise
- Source: https://github.com/rms13/Project1-Noise


### Rudraksha Shah



- With the server working (thanks to Austin!) I worked on setting up the tiles of the sphere to procedurally generate the terrain andf render it out per tile. I was able to get the terrain (though flat) to show up instead of each tile but I am having issues with the normals which is why I do not have any Images to show as mostly everything looks black without shading.



- Also as the code is not working correctly I have not pushed it to git will do as soon as I get it up and running.



- For the future I will work on either gerenating the terrain with spherical coordinates as is the way Austin has gave us the implementation or will change the code to render a flat 2D plane which renders tiles which I will use to render the terrain.
