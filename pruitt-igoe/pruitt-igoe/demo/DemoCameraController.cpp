#include "DemoCameraController.h"

void DemoCameraController::Awake()
{
	this->camera = this->gameObject->AddComponent<PerspectiveCamera>();
	this->speed = 15.f;
	this->horizontalAngle = 0.f;
	this->verticalAngle = 0.f;
	this->manualMode = true;
	this->currentTime = 0.f;
	this->currentShot = -1;
	this->musicStarted = false;

	// Hacky, but SFML is not very flexible with this...
	glm::vec2 screenCenter = glm::vec2(Engine::GetScreenSize()) * .5f;
	sf::Mouse::setPosition(sf::Vector2i(screenCenter.x, screenCenter.y), *Engine::GetInstance()->GetWindow());
}

void DemoCameraController::Start()
{
	music.openFromFile("resources/music.ogg");
	manualMode = false;
}

void DemoCameraController::PhysicsUpdate()
{
	if (manualMode)
	{
		Transform * t = this->gameObject->GetTransform();

		glm::vec3 forward = t->Forward();
		glm::vec3 right = t->Right();
		glm::vec3 displacement = right * velocity.x + forward * velocity.z;

		float multiplier = 1.f;

		if (sf::Keyboard::isKeyPressed(sf::Keyboard::Key::LShift))
			multiplier = 4.f;

		t->SetLocalPosition(t->LocalPosition() + displacement * Engine::DeltaTime() * speed * multiplier);

		if (Engine::GetInstance()->GetWindow()->hasFocus() && Engine::MouseLocked())
		{
			glm::vec2 mousePos = Engine::GetInstance()->GetCurrentMousePosition();
			glm::vec2 screenCenter = glm::vec2(Engine::GetScreenSize()) * .5f;

			glm::vec2 delta = mousePos - screenCenter;

			if (std::fabs(delta.x) < 0.1f && std::fabs(delta.y) < .1f)
				return;

			float sensibility = .25f;

			this->verticalAngle -= delta.y * sensibility * Engine::DeltaTime();
			this->horizontalAngle -= delta.x * sensibility * Engine::DeltaTime();

			Engine::CenterMousePosition();
		}

		// Clamp vertical angle
		this->verticalAngle = glm::clamp(verticalAngle, -.49f * glm::pi<float>(), .49f * glm::pi<float>());
		t->SetLocalRotation(glm::vec3(verticalAngle, horizontalAngle, 0.f));
	}
	else
	{
		// We only consider time in demo mode
		currentTime += Engine::DeltaTime();
		UpdateCurrentShot();

		// Just center the mouse so when it gets reenabled the offset does not explode
		if (Engine::GetInstance()->GetWindow()->hasFocus() && Engine::MouseLocked())
			Engine::CenterMousePosition();
	}
}

void DemoCameraController::OnKeyPressEvent(sf::Event::KeyEvent * e)
{
	if (e->code == sf::Keyboard::Key::W)
		this->velocity.z += 1;

	if (e->code == sf::Keyboard::Key::D)
		this->velocity.x += 1;

	if (e->code == sf::Keyboard::Key::S)
		this->velocity.z += -1;

	if (e->code == sf::Keyboard::Key::A)
		this->velocity.x += -1;
}

void DemoCameraController::OnKeyReleaseEvent(sf::Event::KeyEvent * e)
{
	if (e->code == sf::Keyboard::Key::Q)
	{
		Engine::LogInfo(glm::to_string(this->GetTransform()->LocalPosition()));
		Engine::LogInfo(glm::to_string(this->GetTransform()->LocalPosition() + this->GetTransform()->Forward() * 40.f));
	}

	if (e->code == sf::Keyboard::Key::BackSpace)
	{
		this->manualMode = !manualMode;

		if (this->manualMode)
			music.pause();
		else if(musicStarted)
			music.play();
	}

	if (e->code == sf::Keyboard::Key::W)
		this->velocity.z -= 1;

	if (e->code == sf::Keyboard::Key::D)
		this->velocity.x -= 1;

	if (e->code == sf::Keyboard::Key::S)
		this->velocity.z -= -1;

	if (e->code == sf::Keyboard::Key::A)
		this->velocity.x -= -1;
}

void DemoCameraController::AddCameraShot(CameraShotController * cam)
{
	this->shotControllers.push_back(cam);
}

void DemoCameraController::StartMusic()
{
	music.play();
	musicStarted = true;
}

void DemoCameraController::UpdateCurrentShot()
{
	// Enable first camera
	if (currentShot == -1 && shotControllers.size() > 0)
	{
		currentShot = 0;
		shotControllers[currentShot]->SetActive(currentTime);
	}

	if (currentShot < shotControllers.size())
	{
		CameraShotController * c = shotControllers[currentShot];

		bool next = c->Update(currentTime);

		if (next)
		{
			c->OnExit();
			currentShot++;

			if (currentShot < shotControllers.size())
				shotControllers[currentShot]->SetActive(currentTime);
		}
	}

	this->camera->PhysicsUpdate();
}

CameraShotController::CameraShotController(float duration, PerspectiveCamera * camera)
{
	this->startTime = 0.f;
	this->duration = duration;
	this->camera = camera;
}

bool CameraShotController::Update(float time)
{
	float t = glm::clamp((time - this->startTime) / this->duration, 0.f, 1.f);
	this->OnUpdate(t);
	return t >= 1.f;
}

void CameraShotController::SetActive(float time)
{
	this->startTime = time;
	this->OnSetActive();
	this->OnUpdate(0.f);
}
