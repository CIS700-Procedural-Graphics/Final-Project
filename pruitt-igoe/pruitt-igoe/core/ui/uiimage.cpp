#include "uiimage.h"
#include "../assets/assetdatabase.h"
#include "../assets/texture.h"

void UIImage::Awake()
{
    this->renderer = gameObject->AddComponent<UIRenderer>();
    this->material = UIComponent::GetUIMaterialInstance();
    this->renderer->SetMaterial(material);
    this->renderer->SetMesh(UIComponent::GetUIQuadMesh());
    this->texture = nullptr;
    this->color = glm::vec4(1,1,1,1);
}

glm::vec2 UIImage::GetTextureSize()
{
    if(texture != nullptr)
        return glm::vec2(texture->GetWidth(), texture->GetHeight());

    return glm::vec2();
}

void UIImage::CenterOnScreen()
{
    glm::vec2 screenSize = Engine::GetScreenSize();
    glm::vec2 size = this->GetTransform()->UIGetSize();

    glm::vec2 pos = glm::vec2(screenSize.x * .5f  - size.x * .5f, screenSize.y * .5f  - size.y * .5f);
    GetTransform()->UISetLocalPosition(pos);
}

void UIImage::SetColor(const glm::vec4 &color)
{
    this->color = color;
    this->material->SetColor("Color", color);
}

void UIImage::SetTexture(const char *filename)
{
    this->texture = AssetDatabase::GetInstance()->LoadAsset<Texture>(filename,
		TextureParameters(GL_LINEAR_MIPMAP_LINEAR, GL_LINEAR, GL_REPEAT, GL_REPEAT));
    this->material->SetTexture("MainTexture", texture);
    this->GetTransform()->UISetSize(glm::vec2(texture->GetWidth(), texture->GetHeight()));
}
