#include "ShaderPass.h"
#include "assets\texture.h"
#include "assets\mesh.h"
#include "assets\meshfactory.h"
#include "material.h"
#include "components\camera.h"
#include "engine.h"

ShaderPass::ShaderPass(const std::string & shaderName, RenderTexture * target, Camera * sourceCamera) : target(target), sourceCamera(sourceCamera)
{
	this->material = new Material(shaderName);
	this->material->SetFeature(GL_DEPTH_TEST, false);

	if (target)
		target->Load();
}

ShaderPass::~ShaderPass()
{
	if (target != nullptr)
		delete target;

	if (material != nullptr)
		delete material;
}

void ShaderPass::Update()
{
}

RenderTexture * ShaderPass::Render(Mesh * quad, RenderTexture * source)
{
	if (target != nullptr)
	{
		glBindFramebuffer(GL_FRAMEBUFFER, target->GetFramebufferID());
		glViewport(0, 0, target->GetWidth(), target->GetHeight());
	}
	else
	{
		glBindFramebuffer(GL_FRAMEBUFFER, 0);
		glm::vec2 screenSize = Engine::GetScreenSize();
		glViewport(0, 0, screenSize.x, screenSize.y);
	}

	if (source != nullptr)
	{
		glm::vec4 txSize = glm::vec4(source->GetWidth(), source->GetHeight(), 1.f / source->GetWidth(), 1.f / source->GetHeight());
		this->material->SetTexture("SourceTexture", source);
		this->material->SetVector("SourceTextureSize", txSize);
	}
	
	if(sourceCamera != nullptr)
		this->material->Render(quad, sourceCamera->GetViewProjectionMatrix(), sourceCamera->GetCameraParameters(), glm::mat4(), glm::mat4(), glm::mat4(), Engine::Time());
	else
		this->material->Render(quad, glm::mat4(), glm::vec4(), glm::mat4(), glm::mat4(), glm::mat4(), Engine::Time());

	return this->target;
}

Material * ShaderPass::GetMaterial()
{
	return this->material;
}

bool ShaderPass::IgnoreTarget()
{
	return ignoreTarget;
}

void ShaderPass::SetIgnoreTarget(bool ignore)
{
	this->ignoreTarget = ignore;
}

ShaderPassComposer::ShaderPassComposer()
{
	this->quad = MeshFactory::BuildQuad();
}

ShaderPassComposer::~ShaderPassComposer()
{
	delete this->quad;
}

void ShaderPassComposer::Render()
{
	RenderTexture * currentTarget = source;

	for (int i = 0; i < passes.size(); i++)
	{
		if (currentTarget != nullptr)
			currentTarget->GenerateMipmaps();

		passes[i]->Update();
		RenderTexture * resultTarget = passes[i]->Render(this->quad, currentTarget);

		// If the pass is set to ignore, we just jump to the next pass, but we generate the mipmaps anyway
		if (passes[i]->IgnoreTarget() && resultTarget != nullptr)
			resultTarget->GenerateMipmaps();
		else
			currentTarget = resultTarget;
	}

	glBindFramebuffer(GL_FRAMEBUFFER, 0);
}

void ShaderPassComposer::AddPass(ShaderPass * pass)
{
	this->passes.push_back(pass);
}

void ShaderPassComposer::SetSourceTarget(RenderTexture * source)
{
	this->source = source;
}
