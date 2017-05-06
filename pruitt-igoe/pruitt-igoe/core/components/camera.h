#ifndef CAMERA_H
#define CAMERA_H

#include "../../common.h"
#include "../component.h"
#include "../assets/texture.h"

enum CullingMask
{
	All = 0xffffff,
	Default = 1 << 0,
	Layer1 = 1 << 1,
	Layer2 = 1 << 2,
	Layer3 = 1 << 3
};

class Camera : public Component
{
public:
    virtual void Awake();
    virtual void PhysicsUpdate();
    void UpdateScreenSize();

	const glm::mat4& GetProjectionMatrix();
    const glm::mat4& GetViewProjectionMatrix();
    const glm::vec3 GetViewVector();
	const glm::vec4 GetCameraParameters();
	
	float GetFarClip();
	float GetNearClip();

	void SetFarClip(float farClip);
	void SetNearClip(float nearClip);

	void Render();
	void FinishRender();
	bool Cull(int layer);

	void SetRenderTexture(RenderTexture * rt);
	RenderTexture * GetRenderTexture();

	glm::vec4 viewport;
	glm::vec4 backgroundColor;
	bool clearDepth;
	bool clearColor;
	bool clearStencil;
	CullingMask mask;

protected:
	virtual ~Camera();

	// Computed
	float aspect;
	glm::mat4 viewProjectionMatrix;
	glm::mat4 projectionMatrix;

	// Input
	int width;
	int height;
	float nearClip;
	float farClip;
	RenderTexture * renderTexture;

	// Depends on each camera type!
	virtual glm::mat4 ComputeProjectionMatrix() = 0;
};

class PerspectiveCamera : public Camera
{
public:
    virtual void Awake();
	void SetFieldOfView(float fieldOfView);
	float GetFieldOfView();

protected:
	float fieldOfView;
	virtual glm::mat4 ComputeProjectionMatrix();
};

class OrthographicCamera: public Camera
{
    virtual glm::mat4 ComputeProjectionMatrix();
};

class UICamera: public Camera
{
public:
    virtual void Awake();
    virtual ~UICamera();
    virtual glm::mat4 ComputeProjectionMatrix();
	virtual void PhysicsUpdate();
};

#endif // CAMERA_H
