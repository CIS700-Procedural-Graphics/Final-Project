#include "meshfactory.h"
#include "mesh.h"

Mesh *MeshFactory::BuildQuad(bool writeOnly)
{
	int vertexCount = 4;
	int indicesCunt = 6;

	GLuint * indices = new GLuint[indicesCunt];
	glm::vec4 * vertices = new glm::vec4[vertexCount];
	glm::vec2 * UVs = new glm::vec2[vertexCount];

	int index = 0;

	// Vertices are optimized for full screen quad
	vertices[index++] = glm::vec4(-1, -1, 0, 1.0f);
	vertices[index++] = glm::vec4(1, -1, 0, 1.0f);
	vertices[index++] = glm::vec4(1, 1, 0, 1.0f);
	vertices[index++] = glm::vec4(-1, 1, 0, 1.0f);

	index = 0;
	UVs[index++] = glm::vec2(0, 0);
	UVs[index++] = glm::vec2(1, 0);
	UVs[index++] = glm::vec2(1, 1);
	UVs[index++] = glm::vec2(0, 1);

	// Upper side
	index = 0;
	indices[index++] = 0;
	indices[index++] = 1;
	indices[index++] = 2;

	indices[index++] = 2;
	indices[index++] = 3;
	indices[index++] = 0;

	Mesh * output = new Mesh();
	output->SetIndices(indices, indicesCunt);
	output->SetVertices(vertices, vertexCount);
	output->SetUVs(UVs, vertexCount);
	output->Upload(writeOnly);

	return output;
}

// Similar but from 0,0 to 1,1
Mesh * MeshFactory::BuildUIQuad(bool writeOnly)
{
	int vertexCount = 4;
	int indicesCunt = 6;

	GLuint * indices = new GLuint[indicesCunt];
	glm::vec4 * vertices = new glm::vec4[vertexCount];
	glm::vec2 * UVs = new glm::vec2[vertexCount];

	int index = 0;

	// Vertices are optimized for full screen quad
	vertices[index++] = glm::vec4(0, 0, 0, 1.0f);
	vertices[index++] = glm::vec4(1, 0, 0, 1.0f);
	vertices[index++] = glm::vec4(1, 1, 0, 1.0f);
	vertices[index++] = glm::vec4(0, 1, 0, 1.0f);

	index = 0;
	UVs[index++] = glm::vec2(0, 1);
	UVs[index++] = glm::vec2(1, 1);
	UVs[index++] = glm::vec2(1, 0);
	UVs[index++] = glm::vec2(0, 0);

	// Upper side
	index = 0;
	indices[index++] = 0;
	indices[index++] = 1;
	indices[index++] = 2;

	indices[index++] = 2;
	indices[index++] = 3;
	indices[index++] = 0;

	Mesh * output = new Mesh();
	output->SetIndices(indices, indicesCunt);
	output->SetVertices(vertices, vertexCount);
	output->SetUVs(UVs, vertexCount);
	output->Upload(writeOnly);

	return output;
}


static const int CUB_IDX_COUNT = 36;
static const int CUB_VERT_COUNT = 24;

void createCubeVertexPositions(glm::vec4 * cub_vert_pos)
{
    int idx = 0;
    //Front face
    //UR
    cub_vert_pos[idx++] = glm::vec4(0.5f, 0.5f, 0.5f, 1.0f);
    //LR
    cub_vert_pos[idx++] = glm::vec4(0.5f, -0.5f, 0.5f, 1.0f);
    //LL
    cub_vert_pos[idx++] = glm::vec4(-0.5f, -0.5f, 0.5f, 1.0f);
    //UL
    cub_vert_pos[idx++] = glm::vec4(-0.5f, 0.5f, 0.5f, 1.0f);

    //Right face
    //UR
    cub_vert_pos[idx++] = glm::vec4(0.5f, 0.5f, -0.5f, 1.0f);
    //LR
    cub_vert_pos[idx++] = glm::vec4(0.5f, -0.5f, -0.5f, 1.0f);
    //LL
    cub_vert_pos[idx++] = glm::vec4(0.5f, -0.5f, 0.5f, 1.0f);
    //UL
    cub_vert_pos[idx++] = glm::vec4(0.5f, 0.5f, 0.5f, 1.0f);

    //Left face
    //UR
    cub_vert_pos[idx++] = glm::vec4(-0.5f, 0.5f, 0.5f, 1.0f);
    //LR
    cub_vert_pos[idx++] = glm::vec4(-0.5f, -0.5f, 0.5f, 1.0f);
    //LL
    cub_vert_pos[idx++] = glm::vec4(-0.5f, -0.5f, -0.5f, 1.0f);
    //UL
    cub_vert_pos[idx++] = glm::vec4(-0.5f, 0.5f, -0.5f, 1.0f);

    //Back face
    //UR
    cub_vert_pos[idx++] = glm::vec4(-0.5f, 0.5f, -0.5f, 1.0f);
    //LR
    cub_vert_pos[idx++] = glm::vec4(-0.5f, -0.5f, -0.5f, 1.0f);
    //LL
    cub_vert_pos[idx++] = glm::vec4(0.5f, -0.5f, -0.5f, 1.0f);
    //UL
    cub_vert_pos[idx++] = glm::vec4(0.5f, 0.5f, -0.5f, 1.0f);

    //Top face
    //UR
    cub_vert_pos[idx++] = glm::vec4(0.5f, 0.5f, -0.5f, 1.0f);
    //LR
    cub_vert_pos[idx++] = glm::vec4(0.5f, 0.5f, 0.5f, 1.0f);
    //LL
    cub_vert_pos[idx++] = glm::vec4(-0.5f, 0.5f, 0.5f, 1.0f);
    //UL
    cub_vert_pos[idx++] = glm::vec4(-0.5f, 0.5f, -0.5f, 1.0f);

    //Bottom face
    //UR
    cub_vert_pos[idx++] = glm::vec4(0.5f, -0.5f, 0.5f, 1.0f);
    //LR
    cub_vert_pos[idx++] = glm::vec4(0.5f, -0.5f, -0.5f, 1.0f);
    //LL
    cub_vert_pos[idx++] = glm::vec4(-0.5f, -0.5f, -0.5f, 1.0f);
    //UL
    cub_vert_pos[idx++] = glm::vec4(-0.5f, -0.5f, 0.5f, 1.0f);
}

void createCubeVertexNormals(glm::vec4 * cub_vert_nor)
{
    int idx = 0;
    //Front
    for(int i = 0; i < 4; i++){
        cub_vert_nor[idx++] = glm::vec4(0,0,1,0);
    }
    //Right
    for(int i = 0; i < 4; i++){
        cub_vert_nor[idx++] = glm::vec4(1,0,0,0);
    }
    //Left
    for(int i = 0; i < 4; i++){
        cub_vert_nor[idx++] = glm::vec4(-1,0,0,0);
    }
    //Back
    for(int i = 0; i < 4; i++){
        cub_vert_nor[idx++] = glm::vec4(0,0,-1,0);
    }
    //Top
    for(int i = 0; i < 4; i++){
        cub_vert_nor[idx++] = glm::vec4(0,1,0,0);
    }
    //Bottom
    for(int i = 0; i < 4; i++){
        cub_vert_nor[idx++] = glm::vec4(0,-1,0,0);
    }
}

void createCubeIndices(GLuint * cub_idx)
{
    int idx = 0;
    for(int i = 0; i < 6; i++){
        cub_idx[idx++] = i*4+2;
        cub_idx[idx++] = i*4+1;
        cub_idx[idx++] = i*4;
        cub_idx[idx++] = i*4+3;
        cub_idx[idx++] = i*4+2;
        cub_idx[idx++] = i*4;
    }
}

Mesh *MeshFactory::BuildCube(bool interleaved, bool writeOnly)
{
    GLuint * indices = new GLuint[CUB_IDX_COUNT];
    glm::vec4 * vertices = new glm::vec4[CUB_VERT_COUNT];
    glm::vec4 * normals = new glm::vec4[CUB_VERT_COUNT];

	createCubeVertexPositions(vertices);
    createCubeVertexNormals(normals);
	createCubeIndices(indices);
	
    Mesh * output = new Mesh();
    output->SetIndices(indices, CUB_IDX_COUNT);
    output->SetVertices(vertices, CUB_VERT_COUNT);
    output->SetNormals(normals, CUB_VERT_COUNT);

    if(interleaved)
    {
        output->SetInterleaved(true);
        output->Interleave();
    }

    output->Upload(writeOnly);

    return output;
}

//Mesh *MeshFactory::BuildWireCube()
//{
//    int vertexCount = 8;
//    int indicesCunt = 24;
//
//    GLuint * indices = new GLuint[indicesCunt];
//    glm::vec4 * vertices = new glm::vec4[vertexCount];
//
//    int index = 0;
//    vertices[index++] = glm::vec4(0.5f, 0.5f, 0.5f, 1.0f);
//    vertices[index++] = glm::vec4(0.5f, 0.5f, -0.5f, 1.0f);
//    vertices[index++] = glm::vec4(-0.5f, 0.5f, -0.5f, 1.0f);
//    vertices[index++] = glm::vec4(-0.5f, 0.5f, 0.5f, 1.0f);
//
//    vertices[index++] = glm::vec4(0.5f, -0.5f, 0.5f, 1.0f);
//    vertices[index++] = glm::vec4(0.5f, -0.5f, -0.5f, 1.0f);
//    vertices[index++] = glm::vec4(-0.5f, -0.5f, -0.5f, 1.0f);
//    vertices[index++] = glm::vec4(-0.5f, -0.5f, 0.5f, 1.0f);
//
//    index = 0;
//
//    // Upper side
//    indices[index++] = 0;
//    indices[index++] = 1;
//
//    indices[index++] = 1;
//    indices[index++] = 2;
//
//    indices[index++] = 2;
//    indices[index++] = 3;
//
//    indices[index++] = 3;
//    indices[index++] = 0;
//
//    // Lower side
//    indices[index++] = 4;
//    indices[index++] = 5;
//
//    indices[index++] = 5;
//    indices[index++] = 6;
//
//    indices[index++] = 6;
//    indices[index++] = 7;
//
//    indices[index++] = 7;
//    indices[index++] = 4;
//
//    // Connections
//    indices[index++] = 0;
//    indices[index++] = 4;
//
//    indices[index++] = 1;
//    indices[index++] = 5;
//
//    indices[index++] = 2;
//    indices[index++] = 6;
//
//    indices[index++] = 3;
//    indices[index++] = 7;
//
//    Mesh * output = new Mesh();
//    output->SetIndices(indices, indicesCunt);
//    output->SetVertices(vertices, vertexCount);
//    output->SetWriteOnly(true); // So we don't worry about these arrays being leaked...
//    output->Upload();
//
//    return output;
//}

//Mesh *MeshFactory::BuildMeshFromTexture(ReadableTexture *texture)
//{
//    std::vector<glm::uint> indices;
//    std::vector<glm::vec4> vertices;
//    std::vector<glm::vec4> normals;
//    std::vector<glm::vec2> uvs;
//
//    int width = texture->GetWidth();
//    int height = texture->GetHeight();
//
//    glm::vec2 pixelSize = glm::vec2(1.f / width, 1.f / height);
//    uint8_t * pixels = texture->GetPixels();
//
//    glm::vec4 vertexOffset = glm::vec4(.5f, .5f, 0, 0);
//
//    int index = 0;
//
//    for(int x = 0; x < width; x++)
//    {
//        for(int y = 0; y < height; y++)
//        {
//            int i = y * width + x;
//            uint8_t alpha = pixels[i * 4 + 3];
//
//            glm::vec2 uvOffset = pixelSize * glm::vec2(x,y);
//
//            if(alpha > 0)
//            {
//                int sectionIndexOffset = index;
//
//                glm::vec2 uv1 = glm::vec2(0,0) * pixelSize + uvOffset;
//                glm::vec2 uv2 = glm::vec2(1,0) * pixelSize + uvOffset;
//                glm::vec2 uv3 = glm::vec2(1,1) * pixelSize + uvOffset;
//                glm::vec2 uv4 = glm::vec2(0,1) * pixelSize + uvOffset;
//
//                // Upper side of the pixel
//                vertices.push_back(glm::vec4(uv1.x, uv1.y, 0, 1.0f) - vertexOffset);
//                vertices.push_back(glm::vec4(uv2.x, uv2.y, 0, 1.0f) - vertexOffset);
//                vertices.push_back(glm::vec4(uv3.x, uv3.y, 0, 1.0f) - vertexOffset);
//                vertices.push_back(glm::vec4(uv4.x, uv4.y, 0, 1.0f) - vertexOffset);
//
//                uvs.push_back(uv1);
//                uvs.push_back(uv2);
//                uvs.push_back(uv3);
//                uvs.push_back(uv4);
//
//                normals.push_back(glm::vec4(0,0,1,0));
//                normals.push_back(glm::vec4(0,0,1,0));
//                normals.push_back(glm::vec4(0,0,1,0));
//                normals.push_back(glm::vec4(0,0,1,0));
//
//                indices.push_back(index);
//                indices.push_back(index + 1);
//                indices.push_back(index + 2);
//
//                indices.push_back(index + 2);
//                indices.push_back(index + 3);
//                indices.push_back(index);
//
//                index += 4;
//
//                // Lower side of the pixel
//                vertices.push_back(glm::vec4(uv1.x, uv1.y, -1, 1.0f) - vertexOffset);
//                vertices.push_back(glm::vec4(uv2.x, uv2.y, -1, 1.0f) - vertexOffset);
//                vertices.push_back(glm::vec4(uv3.x, uv3.y, -1, 1.0f) - vertexOffset);
//                vertices.push_back(glm::vec4(uv4.x, uv4.y, -1, 1.0f) - vertexOffset);
//
//                uvs.push_back(uv1);
//                uvs.push_back(uv2);
//                uvs.push_back(uv3);
//                uvs.push_back(uv4);
//
//                normals.push_back(glm::vec4(0,0,-1,0));
//                normals.push_back(glm::vec4(0,0,-1,0));
//                normals.push_back(glm::vec4(0,0,-1,0));
//                normals.push_back(glm::vec4(0,0,-1,0));
//
//
//                indices.push_back(index);
//                indices.push_back(index + 1);
//                indices.push_back(index + 2);
//
//                indices.push_back(index + 2);
//                indices.push_back(index + 3);
//                indices.push_back(index);
//
//                index += 4;
//
//                // Now we need to check adjacent pixels
//                // Note: readibility can be improved by having a set of
//                // offset indices for each extrusion side (this is basically an extrusion)
//                int adjX = x + 1;
//                uint8_t adjAlpha = alpha;
//
//                // Right side pixel comparison
//                if(adjX < width)
//                {
//                    i = y * width + adjX;
//                    adjAlpha = pixels[i * 4 + 3];
//
//                    if(adjAlpha != alpha)
//                    {
//                        int v1 = sectionIndexOffset + 5;
//                        int v2 = sectionIndexOffset + 6;
//                        int v3 = sectionIndexOffset + 2;
//                        int v4 = sectionIndexOffset + 1;
//
//                        vertices.push_back(vertices[v1]);
//                        vertices.push_back(vertices[v2]);
//                        vertices.push_back(vertices[v3]);
//                        vertices.push_back(vertices[v4]);
//
//                        normals.push_back(glm::vec4(1,0,0,0));
//                        normals.push_back(glm::vec4(1,0,0,0));
//                        normals.push_back(glm::vec4(1,0,0,0));
//                        normals.push_back(glm::vec4(1,0,0,0));
//
//                        uvs.push_back(uvs[sectionIndexOffset]);
//                        uvs.push_back(uvs[sectionIndexOffset + 1]);
//                        uvs.push_back(uvs[sectionIndexOffset + 2]);
//                        uvs.push_back(uvs[sectionIndexOffset + 3]);
//
//                        indices.push_back(index);
//                        indices.push_back(index + 1);
//                        indices.push_back(index + 2);
//
//                        indices.push_back(index + 2);
//                        indices.push_back(index + 3);
//                        indices.push_back(index);
//
//                        index += 4;
//                    }
//                }
//
//                adjX = x - 1;
//
//                // Left side pixel comparison
//                if(adjX >= 0)
//                {
//                    i = y * width + adjX;
//                    adjAlpha = pixels[i * 4 + 3];
//
//                    if(adjAlpha != alpha)
//                    {
//                        int v1 = sectionIndexOffset + 4;
//                        int v2 = sectionIndexOffset + 7;
//                        int v3 = sectionIndexOffset + 3;
//                        int v4 = sectionIndexOffset + 0;
//
//                        vertices.push_back(vertices[v1]);
//                        vertices.push_back(vertices[v2]);
//                        vertices.push_back(vertices[v3]);
//                        vertices.push_back(vertices[v4]);
//
//                        normals.push_back(glm::vec4(-1,0,0,0));
//                        normals.push_back(glm::vec4(-1,0,0,0));
//                        normals.push_back(glm::vec4(-1,0,0,0));
//                        normals.push_back(glm::vec4(-1,0,0,0));
//
//                        uvs.push_back(uvs[sectionIndexOffset]);
//                        uvs.push_back(uvs[sectionIndexOffset + 1]);
//                        uvs.push_back(uvs[sectionIndexOffset + 2]);
//                        uvs.push_back(uvs[sectionIndexOffset + 3]);
//
//                        indices.push_back(index);
//                        indices.push_back(index + 1);
//                        indices.push_back(index + 2);
//
//                        indices.push_back(index + 2);
//                        indices.push_back(index + 3);
//                        indices.push_back(index);
//
//                        index += 4;
//                    }
//                }
//
//                int adjY = y - 1;
//
//                // Lower side pixel comparison
//                if(adjY >= 0)
//                {
//                    i = adjY * width + x;
//                    adjAlpha = pixels[i * 4 + 3];
//
//                    if(adjAlpha != alpha)
//                    {
//                        int v1 = sectionIndexOffset + 4;
//                        int v2 = sectionIndexOffset + 5;
//                        int v3 = sectionIndexOffset + 1;
//                        int v4 = sectionIndexOffset + 0;
//
//                        vertices.push_back(vertices[v1]);
//                        vertices.push_back(vertices[v2]);
//                        vertices.push_back(vertices[v3]);
//                        vertices.push_back(vertices[v4]);
//
//                        normals.push_back(glm::vec4(0,-1,0,0));
//                        normals.push_back(glm::vec4(0,-1,0,0));
//                        normals.push_back(glm::vec4(0,-1,0,0));
//                        normals.push_back(glm::vec4(0,-1,0,0));
//
//                        uvs.push_back(uvs[sectionIndexOffset]);
//                        uvs.push_back(uvs[sectionIndexOffset + 1]);
//                        uvs.push_back(uvs[sectionIndexOffset + 2]);
//                        uvs.push_back(uvs[sectionIndexOffset + 3]);
//
//                        indices.push_back(index);
//                        indices.push_back(index + 1);
//                        indices.push_back(index + 2);
//
//                        indices.push_back(index + 2);
//                        indices.push_back(index + 3);
//                        indices.push_back(index);
//
//                        index += 4;
//                    }
//                }
//
//                adjY = y + 1;
//
//                // Upper side pixel comparison
//                if(adjY < height)
//                {
//                    i = adjY * width + x;
//                    adjAlpha = pixels[i * 4 + 3];
//
//                    if(adjAlpha != alpha)
//                    {
//                        int v1 = sectionIndexOffset + 7;
//                        int v2 = sectionIndexOffset + 6;
//                        int v3 = sectionIndexOffset + 2;
//                        int v4 = sectionIndexOffset + 3;
//
//                        vertices.push_back(vertices[v1]);
//                        vertices.push_back(vertices[v2]);
//                        vertices.push_back(vertices[v3]);
//                        vertices.push_back(vertices[v4]);
//
//                        normals.push_back(glm::vec4(0,1,0,0));
//                        normals.push_back(glm::vec4(0,1,0,0));
//                        normals.push_back(glm::vec4(0,1,0,0));
//                        normals.push_back(glm::vec4(0,1,0,0));
//
//                        uvs.push_back(uvs[sectionIndexOffset]);
//                        uvs.push_back(uvs[sectionIndexOffset + 1]);
//                        uvs.push_back(uvs[sectionIndexOffset + 2]);
//                        uvs.push_back(uvs[sectionIndexOffset + 3]);
//
//                        indices.push_back(index);
//                        indices.push_back(index + 1);
//                        indices.push_back(index + 2);
//
//                        indices.push_back(index + 2);
//                        indices.push_back(index + 3);
//                        indices.push_back(index);
//
//                        index += 4;
//                    }
//                }
//            }
//        }
//    }
//
//    int indicesCount = indices.size();
//    int vertexCount = vertices.size();
//
//    Mesh * output = new Mesh();
//    output->SetIndices(indices.data(), indicesCount);
//    output->SetVertices(vertices.data(), vertexCount);
//    output->SetNormals(normals.data(), vertexCount);
//    output->SetUVs(uvs.data(), vertexCount);
//
//    // We dont need to delete the data, as the vectors will on their destructors
//    output->Upload();
//
//    return output;
//}
