Hannah Bollar
</br>hbollar

## View the Project

# [Click Here](https://hanbollar.github.io/Project7-BioCrowds/)

## The Project

# BioCrowds
Biocrowds is a crowd simulation algorithm based on the formation of veination patterns on leaves. It prevents agents from colliding with each other on their way to their goal points using a notion of "personal space". Personal space is modelled with a space colonization algorithm. Markers (just points) are scattered throughout the simulation space, on the ground. At each simulation frame, each marker becomes "owned" by the agent closest to it (with some max distance representing an agent's perception). Agent velocity at the next frame is then computed using a sum of the displacement vectors to each of its markers. Because a marker can only be owned by one agent at a time, this technique prevents agents from colliding with one another.

## The Elements
- Agents are set up as cylinders on the plane in the set up associated with whichever scene is currently toggled. The Markers are set up as point objects which can be toggled on and off with the check box associated with visual debugging. 

## Two scenarios
- Created two base scenarios. Can flip between them by using the onScene bar. One is where the agents start out in a large circle and need to go to the location opposite them in the circle. The other is where the agents start out in a smaller circle and need to go to the destination opposite them in the larger circle.

## Add Obstacles to the scene
- to be later implemented

## Different Materials
- toggle the usingMaterial bar to switch between materials
- NOTE: visually make sure to look at the cylinders from above to get a look at the lack of intersections between the agents due to the algorithm [ie the crowd sim working properly]
