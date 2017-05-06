#pragma once

#include <vector>

class RenderTexture;
class Material;
class Mesh;
class Camera;

class ShaderPass
{
public:
	ShaderPass(const std::string& shaderName, RenderTexture * target = nullptr, Camera * sourceCamera = nullptr);
	virtual ~ShaderPass();

	// If specific passes need some information updated before render
	virtual void Update();
	RenderTexture * Render(Mesh * quad, RenderTexture * source);
	Material * GetMaterial();

	bool IgnoreTarget();
	void SetIgnoreTarget(bool ignore);

private:
	RenderTexture * target; // The target buffer of this pass
	Material * material;
	Camera * sourceCamera; // Which projection matrices to send
	bool ignoreTarget;
};

class ShaderPassComposer
{
public:
	ShaderPassComposer();
	~ShaderPassComposer();
	void Render();
	void AddPass(ShaderPass * pass);
	void SetSourceTarget(RenderTexture * source);

private:
	std::vector<ShaderPass*> passes;
	RenderTexture * source;
	Mesh * quad;
};