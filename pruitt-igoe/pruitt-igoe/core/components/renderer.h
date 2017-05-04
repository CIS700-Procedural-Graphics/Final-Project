#ifndef RENDERER_H
#define RENDERER_H

#include "../../common.h"
#include "../component.h"

class Mesh;
class Material;

class Renderer : public Component
{
public:
	virtual void Awake();
	virtual void Render(const glm::mat4& viewProj, const glm::vec4& cameraParameters) = 0;

	Material * GetMaterial();
	void SetMaterial(Material *material);

protected:
	Material * material;
	virtual ~Renderer();
};

class MeshRenderer : public Renderer
{
public:
	virtual void Awake();
	virtual void Render(const glm::mat4& viewProj, const glm::vec4& cameraParameters);
	void SetMesh(Mesh * mesh);
	Mesh * GetMesh();

protected:
	Mesh * mesh;
};

class UIRenderer : public MeshRenderer
{
public:
	virtual void Awake();
	virtual ~UIRenderer();
	virtual void Render(const glm::mat4& viewProj, const glm::vec4& cameraParameters);
};

#endif // RENDERER_H
