#pragma once
#include "../../common.h"

class BaseGenerator
{
public:
	virtual void Generate(float * terrain, int width, int height) = 0;
};

class FractalGenerator : public BaseGenerator
{
public:
	FractalGenerator(int octaves, float frequency, float frequencyMultiplier, float amplitudeMultiplier, float amplitude, float weirdness = 0.f, glm::vec2 offset = glm::vec2());
	virtual void Generate(float * terrain, int width, int height);
private:

	float fbm(float x, float y);
	float advFractal(float x, float y);
	float perlin2D(float x, float y);
	
	int octaves;
	float frequency;
	float frequencyMultiplier;
	float amplitudeMultiplier;
	float amplitude;
	int gradientMapSize;
	float weirdness;
	glm::vec2 offset;
};

class Filter
{
public:
	virtual void Evaluate(float * terrain, float * output, int width, int height) = 0;
};


class TerrainGenerator
{
public:
	TerrainGenerator();
	virtual ~TerrainGenerator();

	float * Generate(int width, int height);

	void SetBaseGenerator(BaseGenerator * gen);

private:
	std::vector<Filter*> filters;
	BaseGenerator *generator;
};

