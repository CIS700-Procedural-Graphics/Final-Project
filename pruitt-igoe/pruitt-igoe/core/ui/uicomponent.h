#ifndef UICOMPONENT_H
#define UICOMPONENT_H

#include "../gameobject.h"
#include "../component.h"
#include "../material.h"
#include "../assets/shader.h"
#include "../assets/mesh.h"

// No batching nor atlasing... for now
class UIComponent : public Component
{
protected:

    static Mesh * uiQuadMesh;
    static Shader * uiShader;

    static Material * GetUIMaterialInstance();
    static Mesh * GetUIQuadMesh();

public:
    bool ContainsPoint(glm::vec2 p);
};

#endif // UICOMPONENT_H
