#include "uicomponent.h"
#include "../assets/meshfactory.h"
#include "../assets/assetdatabase.h"

Shader * UIComponent::uiShader = nullptr;
Mesh * UIComponent::uiQuadMesh = nullptr;

Material *UIComponent::GetUIMaterialInstance()
{
    if(uiShader == nullptr)
        uiShader = AssetDatabase::GetInstance()->LoadAsset<Shader>("ui");

    Material * mat = new Material(uiShader);
    mat->SetFeature(GL_DEPTH_TEST, false);
    mat->SetFeature(GL_CULL_FACE, false);
    mat->SetFeature(GL_BLEND, true);
    mat->SetBlendOperation(Material::BlendOperation(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA));
    mat->SetVector("Color", glm::vec4(1,1,1,1));

    return mat;
}

Mesh *UIComponent::GetUIQuadMesh()
{
    if(uiQuadMesh == nullptr)
        uiQuadMesh = MeshFactory::BuildUIQuad();

    return uiQuadMesh;
}

bool UIComponent::ContainsPoint(glm::vec2 p)
{
    Transform * t = gameObject->GetTransform();

    glm::vec3 worldPos = t->WorldPosition();
    glm::vec3 worldScale = t->WorldScale();

    glm::vec2 screenSize = Engine::GetScreenSize();

    p.y = screenSize.y - p.y;

    return p.x > worldPos.x && p.x < worldPos.x + worldScale.x &&
              p.y > worldPos.y && p.y < worldPos.y + worldScale.y;
}
