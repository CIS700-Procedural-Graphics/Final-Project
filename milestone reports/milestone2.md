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
