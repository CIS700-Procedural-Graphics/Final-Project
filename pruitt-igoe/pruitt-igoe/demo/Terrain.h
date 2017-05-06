#pragma once

#include "../core/engine_common.h"

class Terrain : public Component
{
public:
	void Awake();
	Material * material;
	Texture * floatingPointHeightmap;

protected:
	Mesh * GenerateMesh(float * heightmap, int width, int height, float scale, float resolution);
	glm::vec3 * GetNormalMap(float * heightmap, int width, int height);
	MeshRenderer * renderer;
};

