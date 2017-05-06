#ifndef UIIMAGE_H
#define UIIMAGE_H

#include "uicomponent.h"
#include "../material.h"
#include "../assets/mesh.h"
#include "../components/renderer.h"

// An utility component, which wraps a UIComponent and a UIRenderer
class UIImage : public UIComponent
{
protected:
    UIRenderer * renderer;
    Material * material;
    Texture * texture;
    glm::vec4 color;

public:
    void Awake();

    glm::vec2 GetTextureSize();
    void CenterOnScreen();

    void SetColor(const glm::vec4& color);
    void SetTexture(const char * filename);
};

#endif // UIIMAGE_H
