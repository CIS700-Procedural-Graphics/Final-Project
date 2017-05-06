#include "renderer.h"
#include "../assets/mesh.h"
#include "../material.h"
#include "../gameobject.h"
#include "../engine.h"

Renderer::~Renderer()
{
    Engine::GetInstance()->DeregisterRenderer(this);
}

void Renderer::Awake()
{
    this->material = nullptr;
    Engine::GetInstance()->RegisterRenderer(this);
}

Material *Renderer::GetMaterial()
{
    return material;
}

void Renderer::SetMaterial(Material *material)
{
    this->material = material;
}

void MeshRenderer::SetMesh(Mesh *mesh)
{
    this->mesh = mesh;
}

Mesh *MeshRenderer::GetMesh()
{
    return mesh;
}

void MeshRenderer::Awake()
{
    Renderer::Awake();
    this->mesh = nullptr;
}

void MeshRenderer::Render(const glm::mat4 &viewProj, const glm::vec4& cameraParameters)
{
    if(this->material != nullptr && this->mesh != nullptr)
    {
        Transform * t = this->gameObject->GetTransform();
        this->material->Render(mesh, viewProj, cameraParameters, t->LocalToWorldMatrix(), t->WorldToLocalMatrix(), t->InverseTransposeMatrix(), Engine::Time());
    }
}

void UIRenderer::Awake()
{
    // Override registration for base renderer, as we need to be on other pass
    Engine::GetInstance()->RegisterUIRenderer(this);
    this->mesh = nullptr;
    this->material = nullptr;
}

UIRenderer::~UIRenderer()
{
    Engine::GetInstance()->DeregisterUIRenderer(this);
}

void UIRenderer::Render(const glm::mat4 &viewProj, const glm::vec4& cameraParameters)
{
    if(this->material != nullptr && this->mesh != nullptr)
    {
        Transform * t = this->gameObject->GetTransform();
        this->material->Render(mesh, viewProj, glm::vec4(), t->LocalToWorldMatrix(), t->WorldToLocalMatrix(), t->InverseTransposeMatrix(), Engine::Time());
    }
}