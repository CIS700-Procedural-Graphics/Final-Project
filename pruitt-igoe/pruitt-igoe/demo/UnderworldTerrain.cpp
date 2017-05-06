#include "UnderworldTerrain.h"
#include "generator\TerrainGenerator.h"

void UnderworldTerrain::Awake()
{
	int heightmapSize = 2048;
	int approxHeightmapSize = heightmapSize;

	float maxHeight = 300.f;

	TerrainGenerator generator;
	FractalGenerator * advGen = new FractalGenerator(10, 1.5f, 2.5f, .625f, maxHeight, .5f, glm::vec2(.234f, .8475f));
	generator.SetBaseGenerator(advGen);

	float * rawTerrain = generator.Generate(heightmapSize, heightmapSize);

	int resolutionDownsampling = 4;
	int width = heightmapSize / resolutionDownsampling;
	int height = heightmapSize / resolutionDownsampling;

	int size = width * height;
	float * hpHeightmap = new float[size];

	for (int i = 0; i < size; i++)
	{
		int dstX = i % width;
		int dstY = i / width;

		int srcX = dstX * resolutionDownsampling;
		int srcY = dstY * resolutionDownsampling;

		int srcIndex = srcY * heightmapSize + srcX;
		hpHeightmap[i] = rawTerrain[srcIndex];
	}

	float verticalScale = 1.f;
	float scale = .75f;// *.25f;

	Mesh * terrainMesh = GenerateMesh(hpHeightmap, width, height, verticalScale, resolutionDownsampling);
	this->renderer = this->gameObject->AddComponent<MeshRenderer>();
	this->renderer->SetMesh(terrainMesh);
	this->material = new Material("terrain/underworld");
	this->renderer->SetMaterial(material);

	// Match the raymarched terrain with the mesh
	this->GetTransform()->SetLocalScale(glm::vec3(scale, 1.f, scale));
	this->material->SetVector("TerrainScale", glm::vec4(1.f / heightmapSize, verticalScale, 1.f / heightmapSize, 0.f));

	Texture * fpTexture = new Texture();
	fpTexture->LoadFromRawFP(rawTerrain, heightmapSize, heightmapSize, TextureParameters(GL_LINEAR_MIPMAP_LINEAR, GL_LINEAR, GL_REPEAT, GL_REPEAT));

	this->floatingPointHeightmap = fpTexture;
	this->material->SetTexture("Heightfield", fpTexture);
	
	delete[] hpHeightmap;
}

inline
float Sample(float * heightmap, int x, int y, int width, int height)
{
	return heightmap[glm::clamp(y, 0, height - 1) * width + glm::clamp(x, 0, width - 1)];
}

glm::vec3 * UnderworldTerrain::GetNormalMap(float * heightmap, int width, int height)
{
	glm::vec3 * output = new glm::vec3[width * height];

	for (int y = 0; y < height; y++)
	{
		for (int x = 0; x < width; x++)
		{
			float horizontal = 0.f;
			horizontal += Sample(heightmap, x - 1, y + 1, width, height);
			horizontal += Sample(heightmap, x - 1, y, width, height) * 2.f;
			horizontal += Sample(heightmap, x - 1, y - 1, width, height);

			horizontal -= Sample(heightmap, x + 1, y + 1, width, height);
			horizontal -= Sample(heightmap, x + 1, y, width, height) * 2.f;
			horizontal -= Sample(heightmap, x + 1, y - 1, width, height);

			float vertical = 0.f;
			vertical += Sample(heightmap, x - 1, y - 1, width, height);
			vertical += Sample(heightmap, x, y - 1, width, height) * 2;
			vertical += Sample(heightmap, x + 1, y - 1, width, height);

			vertical -= Sample(heightmap, x - 1, y + 1, width, height);
			vertical -= Sample(heightmap, x, y + 1, width, height) * 2;
			vertical -= Sample(heightmap, x + 1, y + 1, width, height);

			int index = y * width + x;
			output[index] = glm::normalize(glm::vec3(horizontal, vertical, .5f));

			/*output[index] = n.x * 255;
			output[index + 1] = n.y * 255;
			output[index + 2] = n.z * 255;
			output[index + 3] = 0;*/
		}
	}
	/*
	Texture * normalMap = new Texture();
	normalMap->LoadFromRaw(output, width, height, TextureParameters(GL_LINEAR_MIPMAP_LINEAR, GL_LINEAR, GL_CLAMP, GL_CLAMP));*/
	return output;
}

Mesh * UnderworldTerrain::GenerateMesh(float * heightmap, int width, int height, float scale, float resolution)
{
	std::vector<GLuint> indices;
	std::vector<glm::vec4> vertices;
	std::vector<glm::vec2> uvs;

	glm::vec2 pixelSize = glm::vec2(1.f / width, 1.f / height);
	glm::vec4 resolutionMultiplier = glm::vec4(resolution, scale, resolution, 1.f);

	// Vertex data
	int index = 0;
	for (int y = 0; y < height; y++)
	{
		for (int x = 0; x < width; x++)
		{
			float h = heightmap[y * width + x];

			glm::vec4 v = glm::vec4(x, h, y, 1.f);
			glm::vec2 uv = glm::vec2(x, y + 1) * pixelSize;

			vertices.push_back(v * resolutionMultiplier);
			uvs.push_back(uv);

			if (x < width - 1 && y < height - 1)
			{
				int i1 = y * width + x;
				int i2 = y * width + x + 1;
				int i3 = (y + 1) * width + x;
				int i4 = (y + 1) * width + x + 1;

				indices.push_back(i3);
				indices.push_back(i2);
				indices.push_back(i1);

				indices.push_back(i4);
				indices.push_back(i2);
				indices.push_back(i3);
			}
		}
	}

	Engine::LogInfo("Terrain mesh vertex count: " + std::to_string(vertices.size()));

	Mesh * output = new Mesh();
	output->SetIndices(indices.data(), indices.size(), true);
	output->SetVertices(vertices.data(), vertices.size(), true);
	//output->SetUVs(uvs.data(), uvs.size(), true);
	//output->GenerateNormals();
	output->Upload(true);
	return output;
}
