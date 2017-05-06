#ifndef MESHFACTORY_H
#define MESHFACTORY_H

#include "../../common.h"

class Mesh;

// Just a collection of common meshes we need
class MeshFactory
{
public:
    static Mesh * BuildQuad(bool writeOnly = true);
	static Mesh * BuildUIQuad(bool writeOnly = true);
    static Mesh * BuildCube(bool interleave, bool writeOnly = true);
    //static Mesh * BuildMeshFromTexture(ReadableTexture * texture);
};

#endif // MESHFACTORY_H
