#pragma once
#include "../common.h"
#include <vector>

class GameObject;

class Transform final
{
public:
    Transform(GameObject * gameObject, const glm::vec3 &t, const glm::vec3 &r, const glm::vec3 &s);
    ~Transform();

    void UpdateMatrices();

    const glm::mat4 &LocalToWorldMatrix();
    const glm::mat4 &WorldToLocalMatrix();
    const glm::mat4 &InverseTransposeMatrix();

    const glm::vec3 &LocalPosition();
    const glm::vec3 WorldPosition();

    const glm::vec3 Forward();
    const glm::vec3 Up();
    const glm::vec3 Right();

    const glm::vec3 LocalScale();
    const glm::vec3 WorldScale();

    // UI methods (we can later copy Unity's RectTransform)
    void UISetSize(const glm::vec2& size);
    glm::vec2 UIGetSize();

	void UIScale(float scale);

    void UISetLocalPosition(glm::vec2 position);
    glm::vec2 UIGetLocalPosition();

    void UISetZValue(float value);

    // General Setters
    void SetWorldPosition(const glm::vec3& position);

    void SetLocalPosition(const glm::vec3 &position);
    void SetLocalRotation(const glm::vec3 &eulerAngles);
    void SetLocalScale(const glm::vec3& scale);

    void TranslateLocal(const glm::vec3& t);
    void RotateLocal(const glm::quat& q);

	void LookAt(const glm::vec3& target);

    // Scene graph related
    Transform * GetParent();
    Transform * GetChild(unsigned int i);
    void SetParent(Transform * t);
    GameObject * GetGameObject();

    void AddChild(Transform * t);
    void RemoveChild(Transform * t);
    int GetChildCount();

private:
	glm::vec3 position;
	glm::quat rotation;
	glm::vec3 scale;

	glm::mat4 worldTransform;
	glm::mat4 inverse_worldTransform;
	glm::mat4 inverse_transpose_worldTransform;

	Transform * parent;
	std::vector<Transform *> children;

	GameObject * gameObject;
	typedef std::vector<Transform *>::iterator TransformIterator;
};
