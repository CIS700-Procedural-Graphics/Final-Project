#include "transform.h"

Transform::Transform(GameObject *gameObject, const glm::vec3 &t, const glm::vec3 &r, const glm::vec3 &s):
    gameObject(gameObject),
    position(t),
    rotation(r),
    scale(s),
    parent(nullptr),
    children()
{
    UpdateMatrices();
}

Transform::~Transform()
{
    if(parent != nullptr)
        parent->RemoveChild(this);
}

void Transform::UpdateMatrices()
{
    worldTransform = glm::translate(glm::mat4(1.0f), position)
            * glm::mat4_cast(rotation)
            * glm::scale(glm::mat4(1.0f), scale);

    if(parent != nullptr)
        worldTransform = parent->worldTransform * worldTransform;

    inverse_worldTransform = glm::inverse(worldTransform);
    inverse_transpose_worldTransform = glm::inverse(glm::transpose(worldTransform));

    // Propagate (TODO: dirty flag!)
    for(TransformIterator c = children.begin(); c != children.end(); c++)
        (*c)->UpdateMatrices();
}

const glm::mat4& Transform::LocalToWorldMatrix()
{
    return worldTransform;
}

const glm::mat4& Transform::WorldToLocalMatrix()
{
    return inverse_worldTransform;
}
const glm::mat4& Transform::InverseTransposeMatrix()
{
    return inverse_transpose_worldTransform;
}

const glm::vec3& Transform::LocalPosition()
{
    return position;
}

const glm::vec3 Transform::WorldPosition()
{
    return glm::vec3(worldTransform * glm::vec4(0,0,0,1));
}

const glm::vec3 Transform::Forward()
{
	// Right handed
    return glm::vec3(worldTransform * glm::vec4(0,0,-1,0));
}

const glm::vec3 Transform::Up()
{
    return glm::vec3(worldTransform * glm::vec4(0,1,0,0));
}

const glm::vec3 Transform::Right()
{
    return glm::vec3(worldTransform * glm::vec4(1,0,0,0));
}

const glm::vec3 Transform::LocalScale()
{
    return scale;
}

const glm::vec3 Transform::WorldScale()
{
    return glm::vec3(worldTransform * glm::vec4(1,1,1,0));
}

void Transform::UISetSize(const glm::vec2 &size)
{
    SetLocalScale(glm::vec3(size.x, size.y, scale.z));
}

glm::vec2 Transform::UIGetSize()
{
    return glm::vec2(scale.x, scale.y);
}

void Transform::UIScale(float scale)
{
	this->scale.x *= scale;	
	this->scale.y *= scale;
	UpdateMatrices();
}

void Transform::UISetLocalPosition(glm::vec2 position)
{
    SetLocalPosition(glm::vec3(position.x, position.y, this->position.z));
}

glm::vec2 Transform::UIGetLocalPosition()
{
    return glm::vec2(position.x, position.y);
}

void Transform::UISetZValue(float value)
{
    SetLocalPosition(glm::vec3(this->position.x, this->position.y, value));
}

void Transform::SetWorldPosition(const glm::vec3 &position)
{
    if(parent != nullptr)
        this->position = glm::vec3(parent->inverse_worldTransform * glm::vec4(position, 1.0));
    else
        this->position = position;

    UpdateMatrices();
}

void Transform::SetLocalPosition(const glm::vec3& position)
{
    this->position = position;
    UpdateMatrices();
}

void Transform::SetLocalRotation(const glm::vec3& eulerAngles)
{
    this->rotation = glm::quat(eulerAngles);
    UpdateMatrices();
}

void Transform::SetLocalScale(const glm::vec3 &scale)
{
    this->scale = scale;
    UpdateMatrices();
}

void Transform::TranslateLocal(const glm::vec3 &t)
{
    this->position += t;
    UpdateMatrices();
}

void Transform::RotateLocal(const glm::quat &q)
{
    this->rotation  = q * rotation;
    UpdateMatrices();
}

void Transform::LookAt(const glm::vec3 & target)
{
	glm::mat4 lookAtM = glm::lookAt(position, target, this->Up());
	this->rotation = glm::conjugate(glm::toQuat(lookAtM));
	UpdateMatrices();
}

Transform *Transform::GetParent()
{
    return this->parent;
}

void Transform::AddChild(Transform *t)
{
    t->SetParent(this);
}

void Transform::RemoveChild(Transform *t)
{
    this->children.erase(std::find(children.begin(), children.end(), t));
    t->parent = nullptr;
}

int Transform::GetChildCount()
{
    return this->children.size();
}

Transform *Transform::GetChild(unsigned int i)
{
    if(i <= children.size())
        return this->children[i];

    return nullptr;
}

void Transform::SetParent(Transform *t)
{
    if(this->parent != nullptr)
        this->parent->RemoveChild(this);

    this->parent = t;

    if(parent != nullptr)
        this->parent->children.push_back(this);

    this->UpdateMatrices();
}

GameObject *Transform::GetGameObject()
{
    return gameObject;
}
