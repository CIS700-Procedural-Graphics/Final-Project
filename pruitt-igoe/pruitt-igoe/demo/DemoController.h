#pragma once

#include "../core/engine_common.h"
#include "DemoCameraController.h"
#include "Terrain.h"

class DemoController : public Component, public InputListener
{
public:
	void Awake();
	void Start();
	void Update();

private:
	DemoCameraController * cameraController;
	Material * mainQuadMaterial;
	GameObject * mainQuad;
	Terrain * terrain;

	// The set of materials that need specific uniforms for raymarching
	std::vector<Material*> raymarchedMaterials;

	Texture * BuildRandomTexture();
	sf::Music music;
};

