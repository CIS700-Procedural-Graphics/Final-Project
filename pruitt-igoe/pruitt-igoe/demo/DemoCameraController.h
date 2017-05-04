#include "../core/engine_common.h"

class CameraShotController
{
public:
	CameraShotController(float duration, PerspectiveCamera * camera);
	bool Update(float time);
	void SetActive(float time);
	virtual void OnExit() = 0;

protected:
	virtual void OnUpdate(float time) = 0;
	virtual void OnSetActive() = 0;

	float duration;
	float startTime;
	PerspectiveCamera * camera;
};

#pragma once
class DemoCameraController : public Component, public InputListener
{
public:
	void Awake();
	void Start();
	void PhysicsUpdate();

	void OnKeyPressEvent(sf::Event::KeyEvent * e);
	void OnKeyReleaseEvent(sf::Event::KeyEvent * e);

	void AddCameraShot(CameraShotController* cam);

	void StartMusic();

	PerspectiveCamera * camera;

private:

	void UpdateCurrentShot();

	glm::ivec3 velocity;
	float speed;
	float verticalAngle;
	float horizontalAngle;

	bool manualMode;
	float currentTime;

	std::vector<CameraShotController*> shotControllers;
	int currentShot;
	sf::Music music;
	bool musicStarted;
};

