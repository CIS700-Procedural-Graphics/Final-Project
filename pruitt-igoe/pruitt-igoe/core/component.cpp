#include "component.h"
#include "gameobject.h"
#include "engine.h"

Component::Component() : gameObject(nullptr), enabled(true)
{
}

Component::~Component()
{
}

void Component::Awake()
{
}

void Component::Start()
{
}

void Component::Update()
{
}

void Component::PhysicsUpdate()
{
}

void Component::Destroy()
{
    this->gameObject->DestroyComponent(this);
}

void Component::OnDestroy()
{
}

void Component::SetEnabled(bool enabled)
{
    this->enabled = enabled;
}

bool Component::IsEnabled()
{
    return enabled;
}

GameObject *Component::GetGameObject()
{
    return gameObject;
}

Transform *Component::GetTransform()
{
    return &gameObject->transform;
}

std::string Component::ToString()
{
    return typeid(*this).name() + std::string(" [") + gameObject->Name() + "]";
}

void Component::SetParentGameObject(GameObject *gameObject)
{
    this->gameObject = gameObject;
}
