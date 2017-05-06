#ifndef MESH_H
#define MESH_H

#include "../../common.h"
#include <vector>
#include "asset.h"

struct Vertex
{
public:
    glm::vec4 position;
    glm::vec4 normal;
    glm::vec4 color;
    glm::vec2 uv;
	// For now, we don't need TBN...

    Vertex(const glm::vec4& position, const glm::vec4& normal, const glm::vec4& color, const glm::vec2& uv)
		: position(position), normal(normal), color(color), uv(uv)
    {
    }

    Vertex() : Vertex(glm::vec4(0.0), glm::vec4(0.0), glm::vec4(0.0), glm::vec2(0.0))
    {}
};

class Mesh final: public Asset
{
public:
    Mesh();
	~Mesh();

    void Interleave();
    void SetInterleaved(bool interleaved);
    bool IsInterleaved();

    int GetIndicesCount();
    int GetVertexCount();

	void GenerateNormals();

    void SetIndices(glm::uint * indices, int indicesCount, bool copy = false);
    void SetInterleavedData(Vertex * data, int vertexCount, bool copy = false);

    void SetVertices(glm::vec4 * vertices, int vertexCount, bool copy = false);
    void SetNormals(glm::vec4 * normals, int vertexCount, bool copy = false);
    void SetColors(glm::vec4 * colors, int vertexCount, bool copy = false);
    void SetUVs(glm::vec2 * UVs, int vertexCount, bool copy = false);

    void Upload(bool deleteInternal);
    void Destroy();
	void DeleteInternal();
    void Validate();

    bool BindIndices();
    bool BindInterleaved();
    bool BindVertices();
    bool BindNormals();
    bool BindColors();
    bool BindUVs();

private:
	bool interleaved;

	int vertexCount;
	int indicesCount;

	glm::uint * indices;
	glm::vec4 * vertices;
	glm::vec4 * normals;
	glm::vec4 * colors;
	glm::vec2 * UVs;

	Vertex * interleavedData;

	GLuint bufIdx;
	GLuint bufInterleaved;
	GLuint bufPos;
	GLuint bufNor;
	GLuint bufCol;
	GLuint bufUV;

	bool idxBound;
	bool interleavedBound;
	bool posBound;
	bool norBound;
	bool colBound;
	bool UVBound;

	void GenerateIndicesBuffer();
	void GenerateInterleavedBuffer();
	void GenerateVerticesBuffer();
	void GenerateNormalsBuffer();
	void GenerateColorsBuffer();
	void GenerateUVsBuffer();
};

#endif // MESH_H
