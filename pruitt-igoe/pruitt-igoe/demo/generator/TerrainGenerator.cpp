#include "TerrainGenerator.h"
#include <random>

TerrainGenerator::TerrainGenerator()
{
}

TerrainGenerator::~TerrainGenerator()
{
}

float * TerrainGenerator::Generate(int width, int height)
{
	int size = width * height;
	float * terrain = new float[size];
	float * buffer = new float[size];

	if (this->generator != nullptr)
	{
		this->generator->Generate(terrain, width, height);

		for (int i = 0; i < filters.size(); i++)
		{
			filters[i]->Evaluate(terrain, buffer, width, height);

			float * swp = buffer;
			buffer = terrain;
			terrain = swp;
		}
	}

	delete[] buffer;
	return terrain;
}

void TerrainGenerator::SetBaseGenerator(BaseGenerator * gen)
{
	this->generator = gen;
}

FractalGenerator::FractalGenerator(int octaves, float frequency, float frequencyMultiplier, float amplitudeMultiplier, float amplitude, float weirdness, glm::vec2 offset)
	: BaseGenerator(), octaves(octaves), frequency(frequency), frequencyMultiplier(frequencyMultiplier), amplitudeMultiplier(amplitudeMultiplier), amplitude(amplitude), weirdness(weirdness), offset(offset)
{
}

inline
float fade1(float t)
{
	float t3 = t * t * t;
	return 6.0 * t3 * t * t - 15.0 * t3 * t + 10.0 * t3;
}

int p[512] = { 0 };

int permutation[] = { 151,160,137,91,90,15,
131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
};

float grad(int hash, float x, float y)
{
	int h = hash & 15;
	float u = h < 8 ? x : y;
	float v = h < 4 ? y : h == 12 || h == 14 ? x : y;
	return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
}

float FractalGenerator::perlin2D(float x, float y)
{
	x += .4f + offset.x;
	y += offset.y;

	// Perlin's original approach
	int X = x;
	int Y = y;		
	x -= X;
	y -= Y;
	X = X - (X / 255) * 255 + (X < 0 ? 255 : 0);
	Y = Y - (Y / 255) * 255 + (Y < 0 ? 255 : 0);

	float u = fade1(x);
	float v = fade1(y);

	int A = p[X] + Y;
	int AA = p[A];
	int AB = p[A + 1];

	int B = p[X + 1] + Y;
	int BA = p[B];
	int BB = p[B + 1];

	// [-1,1]
	float output = glm::mix(glm::mix(grad(p[AA], x, y), grad(p[BA], x - 1, y), u),
				   glm::mix(grad(p[AB], x, y - 1), grad(p[BB], x - 1, y - 1), u),
				   v) / .707f;

	return 1.0 - abs(output);
}

float FractalGenerator::fbm(float x, float y)
{
	float accum = 0.f;
	float freq = this->frequency;
	float ampl = this->amplitude;
	float result = 0.f;

	glm::vec2 p = glm::vec2(x, y);

	for (int i = 0; i < this->octaves; i++)
	{
		result += glm::smoothstep(0.f, 1.f, perlin2D(p.x * freq, p.y * freq)) * ampl;
		accum += ampl;
		freq *= this->frequencyMultiplier;
		ampl *= this->amplitudeMultiplier;
	}

	if (accum == 0)
		accum = 1.f;

	result = result / accum;
	result = glm::pow(result, 1.65f);
	return result * amplitude - amplitude * .5f;
}

float bias(float x, float b)
{
	b *= .5;
	return glm::smoothstep(b, 1.0f - b, x);
}

// Not thread safe!
float octaveData[32] = { 0 };
float gradientData[32] = { 0 };

float FractalGenerator::advFractal(float x, float y)
{
	float accum = 0.f;
	float result = 0.f;
	float freq = this->frequency;
	float ampl = this->amplitude;

	glm::vec2 p = glm::vec2(x, y);
	glm::vec2 dsum;

	float eps = .1;
	for (int i = 0; i < this->octaves; i++)
	{
		glm::vec2 estimatedNormal = glm::vec2(perlin2D((p.x + eps) * freq, p.y * freq) - perlin2D((p.x - eps) * freq, p.y * freq),
							  perlin2D(p.x * freq, (p.y + eps) * freq) - perlin2D(p.x * freq, (p.y - eps) * freq));

		gradientData[i] = glm::length2(estimatedNormal);
		dsum += estimatedNormal * (1.0 + weirdness);

		float frequencyModulator = glm::smoothstep(0.f, 1.f, glm::clamp(glm::dot(estimatedNormal, estimatedNormal), 0.f, 1.f));

		float r = perlin2D(p.x * freq, p.y * freq);

		// Billow or ridged based on frequency
		r = glm::clamp(glm::mix(1.0f - r, r, frequencyModulator), 0.f, 1.f);

		r *= 1.f / (1.0f + glm::dot(dsum, dsum));
		r = glm::mix(r, r * r, .7f);
		r *= ampl;

		octaveData[i] = r;
		result += r;
		accum += ampl;

		freq *= glm::mix(frequencyMultiplier * glm::mix(.99f, .94f, weirdness), frequencyMultiplier, frequencyModulator);
		ampl *= glm::mix(amplitudeMultiplier * glm::mix(.935f, .87f, weirdness), amplitudeMultiplier, frequencyModulator);
	}

	// Some erosion inspired ridges
	float ridges = glm::sin(gradientData[2] * 14.f + octaveData[7] * .2) * .025f + 1.f;
	result *= ridges;

	if (accum == 0.f)
		accum = 1.f;

	// Normalization and bias
	result = result / accum;
	result = glm::pow(result, 1.15f);

	int terraceCount = 4;
	float terrace = (int)(result * terraceCount) /((float)terraceCount) + 
		glm::smoothstep(0.f, 1.f, glm::fmod(result * ((float)terraceCount), ((float)terraceCount)) / ((float)terraceCount));
	result = glm::mix(result, terrace, .1f);
	
	return result * amplitude - amplitude * .5f;
}

void FractalGenerator::Generate(float * terrain, int width, int height)
{
	this->gradientMapSize = width;

	// Permutations
	for (int i = 0; i < 256; i++)
		p[256 + i] = p[i] = permutation[i];

	float invW = 1.f / width;
	float invH = 1.f / height;

	for (int y = 0; y < height; y++)
		for (int x = 0; x < width; x++)
			terrain[y * width + x] = advFractal(x * invW, y * invH);
}

