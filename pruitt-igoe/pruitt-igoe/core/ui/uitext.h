#ifndef UITEXT_H
#define UITEXT_H

#include "uicomponent.h"
#include "../material.h"
#include "../assets/mesh.h"
#include "../components/renderer.h"
#include <string>

class UIText : public UIComponent
{
public:
    void Awake();

    void SetTextSize(int size);
    void SetText(std::string text);
    void SetColor(const glm::vec4& color);

protected:
	UIRenderer * renderer;
	Material * material;
	Texture * texture;
	glm::vec4 color;
	std::string text;
	int textSize;

	Mesh * RebuildMesh();
	void Rebuild();
};

#endif // UITEXT_H
