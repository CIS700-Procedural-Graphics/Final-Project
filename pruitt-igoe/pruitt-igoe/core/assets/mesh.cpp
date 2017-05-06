#include "mesh.h"
#include <unordered_map>

Mesh::Mesh() : Asset(), interleaved(false), vertexCount(0), indicesCount(0),
    indices(nullptr), interleavedData(nullptr), vertices(nullptr), normals(nullptr), colors(nullptr), UVs(nullptr),
    bufIdx(0), bufInterleaved(0),  bufPos(0), bufNor(0), bufCol(0),  bufUV(0),
    idxBound(false), interleavedBound(false), posBound(false), norBound(false), colBound(false), UVBound(false)
{
}

Mesh::~Mesh()
{
	Destroy();
	DeleteInternal();
}

void Mesh::Interleave()
{
    if(interleaved && vertexCount != 0 && vertices != nullptr)
    {
        interleavedData = new Vertex[vertexCount];

        for(int i = 0; i < vertexCount; i++)
        {
            interleavedData[i].position = vertices[i];
            interleavedData[i].normal = (normals != nullptr) ? normals[i] : glm::vec4(1.f);
            interleavedData[i].color = (colors != nullptr) ? colors[i] : glm::vec4(1.f);
            interleavedData[i].uv = (UVs != nullptr) ? UVs[i] : glm::vec2(1.f);
        }
    }
}

void Mesh::SetInterleaved(bool interleaved)
{
    this->interleaved = interleaved;
}

bool Mesh::IsInterleaved()
{
    return interleaved;
}

int Mesh::GetIndicesCount()
{
    return indicesCount;
}

int Mesh::GetVertexCount()
{
    return vertexCount;
}

void Mesh::GenerateNormals()
{
	glm::vec4 * gNormals = new glm::vec4[this->vertexCount];	
	int * count = new int[this->vertexCount];

	for (int i = 0; i < vertexCount; i++)
	{
		gNormals[i] = glm::vec4();
		count[i] = 0;
	}

	for (int i = 0; i < this->indicesCount; i += 3)
	{
		int i1 = indices[i];
		int i2 = indices[i+1];
		int i3 = indices[i+2];

		glm::vec4 v1 = vertices[i1];
		glm::vec4 v2 = vertices[i2];
		glm::vec4 v3 = vertices[i3];

		glm::vec3 e1 = glm::normalize(glm::vec3(v2 - v1));
		glm::vec3 e2 = glm::normalize(glm::vec3(v3 - v1));
		glm::vec4 normal = glm::vec4(glm::normalize(glm::cross(e1, e2)), 0.0);

		count[i1]++;
		count[i2]++;
		count[i3]++;

		gNormals[i1] += normal;
		gNormals[i2] += normal;
		gNormals[i3] += normal;
	}

	// Average all contributions
	for (int i = 0; i < vertexCount; i++)
		gNormals[i] /= (float)count[i];

	this->SetNormals(gNormals, vertexCount, true);
	delete[] gNormals;
}

void Mesh::SetIndices(glm::uint *indices, int triangleCount, bool copy)
{
    this->indicesCount = triangleCount;

    if(copy)
    {
        this->indices = new glm::uint[indicesCount];
        std::memcpy(this->indices, indices, this->indicesCount * sizeof(glm::uint));
    }
    else
    {
        this->indices = indices;
    }
}

void Mesh::SetInterleavedData(Vertex *data, int vertexCount, bool copy)
{
    this->vertexCount = vertexCount;

    if(copy)
    {
        this->interleavedData = new Vertex[vertexCount];
        std::memcpy(this->interleavedData, data, vertexCount * sizeof(Vertex));
    }
    else
    {
        this->interleavedData = data;
    }
}

void Mesh::SetVertices(glm::vec4 *vertices, int vertexCount, bool copy)
{
    this->vertexCount = vertexCount;

	if (copy)
	{
		this->vertices = new glm::vec4[vertexCount];
		std::memcpy(this->vertices, vertices, vertexCount * sizeof(glm::vec4));
	}
	else
	{
		this->vertices = vertices;
	}
}

void Mesh::SetNormals(glm::vec4 *normals, int vertexCount, bool copy)
{
	if (this->vertexCount == vertexCount)
	{
		if (copy)
		{
			this->normals = new glm::vec4[vertexCount];
			std::memcpy(this->normals, normals, vertexCount * sizeof(glm::vec4));
		}
		else
		{
			this->normals = normals;
		}
	}
    /*else
        Engine::LogError("Normals and vertices dont match!");*/
}

void Mesh::SetColors(glm::vec4 *colors, int vertexCount, bool copy)
{
	if (this->vertexCount == vertexCount)
	{
		if (copy)
		{
			this->colors = new glm::vec4[vertexCount];
			std::memcpy(this->colors, colors, vertexCount * sizeof(glm::vec4));
		}
		else
		{
			this->colors = colors;
		}
	}
    /*else
        Engine::LogError("Colors and vertices dont match!");*/
}

void Mesh::SetUVs(glm::vec2 *UVs, int vertexCount, bool copy)
{
	if (this->vertexCount == vertexCount)
	{
		if (copy)
		{
			this->UVs = new glm::vec2[vertexCount];
			std::memcpy(this->UVs, UVs, vertexCount * sizeof(glm::vec2));
		}
		else
		{
			this->UVs = UVs;
		}
	}
    /*else
        Engine::LogError("Uvs and vertices dont match!");*/
}

void Mesh::Upload(bool deleteInternal)
{
    // Create a VBO on our GPU and store its handle in bufIdx
    if(indices != nullptr)
    {
        if(!BindIndices()) {
            GenerateIndicesBuffer();
			BindIndices();
        }

        glBufferData(GL_ELEMENT_ARRAY_BUFFER, indicesCount * sizeof(GLuint), indices, GL_STATIC_DRAW);
    }

	// The next few sets of function calls are basically the same as above, except bufPos and bufNor are
	// array buffers rather than element array buffers, as they store vertex attributes like position.
    if(interleaved)
    {
        if(interleavedData != nullptr)
        {
            if(!BindInterleaved()) {
                GenerateInterleavedBuffer();
				BindInterleaved();
            }

            glBufferData(GL_ARRAY_BUFFER, vertexCount * sizeof(Vertex), interleavedData, GL_STATIC_DRAW);
        }
    }
    else
    {
        if(vertices != nullptr)
        {
            GenerateVerticesBuffer();
			BindVertices();
            
			glBufferData(GL_ARRAY_BUFFER, vertexCount * sizeof(glm::vec4), vertices, GL_STATIC_DRAW);
        }

        if(normals != nullptr)
        {
            GenerateNormalsBuffer();
			BindNormals();

			glBufferData(GL_ARRAY_BUFFER, vertexCount * sizeof(glm::vec4), normals, GL_STATIC_DRAW);
        }
		
        if(colors != nullptr)
        {
            GenerateColorsBuffer();
			BindColors();

			glBufferData(GL_ARRAY_BUFFER, vertexCount * sizeof(glm::vec4), colors, GL_STATIC_DRAW);
        }

        if(UVs != nullptr)
        {
            GenerateUVsBuffer();
			BindUVs();
			glBufferData(GL_ARRAY_BUFFER, vertexCount * sizeof(glm::vec2), UVs, GL_STATIC_DRAW);
        }
    }

    // If we only want to write/upload, delete all data after it was uploaded
    if(deleteInternal)
    {
		DeleteInternal();
    }
}

void Mesh::Destroy()
{
	if(bufIdx)
		glDeleteBuffers(1, &bufIdx);

	if(bufPos)
		glDeleteBuffers(1, &bufPos);

	if(bufNor)
		glDeleteBuffers(1, &bufNor);

	if(bufCol)
		glDeleteBuffers(1, &bufCol);

	if(bufUV)
		glDeleteBuffers(1, &bufUV);

	if(bufInterleaved)
		glDeleteBuffers(1, &bufInterleaved);

	// Just in case...
	bufIdx = 0;
	bufPos = 0;
	bufNor = 0;
	bufCol = 0;
	bufUV = 0;
	bufInterleaved = 0;
}

void Mesh::DeleteInternal()
{
	if (indices != nullptr)
		delete[] indices;

	if (interleavedData != nullptr)
		delete[] interleavedData;

	if (vertices != nullptr)
		delete[] vertices;

	if (normals != nullptr)
		delete[] normals;

	if (colors != nullptr)
		delete[] colors;

	if (UVs != nullptr)
		delete[] UVs;

	indices = nullptr;
	interleavedData = nullptr;
	vertices = nullptr;
	normals = nullptr;
	colors = nullptr;
	UVs = nullptr;
}

void Mesh::Validate()
{
    bool valid = true;

    if(indices != nullptr)
    {
        if(vertices == nullptr && interleavedData == nullptr)
        {
            valid = false;
        }
        else
        {
            for(int i = 0; i < indicesCount; i++)
                if(indices[i] >= (glm::uint) vertexCount)
                    valid = false;
        }
    }

    //Engine::LogDebug("VALID? " + std::to_string(valid));
}

void Mesh::GenerateIndicesBuffer()
{
	if (!idxBound)
	{
		idxBound = true;
		glGenBuffers(1, &bufIdx);
	}
}

void Mesh::GenerateInterleavedBuffer()
{
	if (!interleavedBound)
	{
		interleavedBound = true;
		glGenBuffers(1, &bufInterleaved);
	}
}

void Mesh::GenerateVerticesBuffer()
{
	if (!posBound)
	{
		posBound = true;
		glGenBuffers(1, &bufPos);
	}
}

void Mesh::GenerateNormalsBuffer()
{
	if (!norBound)
	{
		norBound = true;
		glGenBuffers(1, &bufNor);
	}
}

void Mesh::GenerateColorsBuffer()
{
	if (!colBound)
	{
		colBound = true;
		glGenBuffers(1, &bufCol);
	}
}

void Mesh::GenerateUVsBuffer()
{
	if (!UVBound)
	{
		UVBound = true;
		glGenBuffers(1, &bufUV);
	}
}

bool Mesh::BindIndices()
{
    if(idxBound)
        glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, bufIdx);

    return idxBound;
}

bool Mesh::BindInterleaved()
{
    if(interleavedBound)
        glBindBuffer(GL_ARRAY_BUFFER, bufInterleaved);

    return interleavedBound;
}

bool Mesh::BindVertices()
{
    if(posBound)
        glBindBuffer(GL_ARRAY_BUFFER, bufPos);

    return posBound;
}

bool Mesh::BindNormals()
{
    if(norBound)
        glBindBuffer(GL_ARRAY_BUFFER, bufNor);

    return norBound;
}

bool Mesh::BindColors()
{
    if(colBound)
        glBindBuffer(GL_ARRAY_BUFFER, bufCol);

    return colBound;
}

bool Mesh::BindUVs()
{
   if(UVBound)
       glBindBuffer(GL_ARRAY_BUFFER, bufUV);

   return UVBound;
}
