#include "../common.h"
#include "engine.h"
#include "input.h"
#include "gameobject.h"
#include "components/camera.h"
#include "components/renderer.h"
#include "material.h"
#include "log.h"
#include <sstream>
#include <thread>
#include "ShaderPass.h"
#include "assets\assetdatabase.h"

Engine * Engine::instance = nullptr;

Engine::Engine() : gameObjects(), cameras(), gameObjectsToAdd(),
    gameObjectsToDelete(), input(new Input()), log(new ConcurrentLog<MultiLog>(new MultiLog())), time(0.f), deltaTime(0.f), actualFrameTime(0.f), targetFramerate(-1), mouseLocked(false)
{
    this->log->GetInternalLogger()->AddLogger(new Log(&std::cout));
}

void Engine::RegisterRenderer(Renderer *renderer)
{
    LogVerbose("Registering renderer...");
    this->renderers.push_back(renderer);
}

void Engine::DeregisterRenderer(Renderer *renderer)
{
    LogVerbose("Deregistering renderer...");
    this->renderers.erase(std::find(renderers.begin(), renderers.end(), renderer));
}

void Engine::RegisterUIRenderer(UIRenderer *renderer)
{
    this->uiRenderers.push_back(renderer);
}

void Engine::DeregisterUIRenderer(UIRenderer *renderer)
{
    this->uiRenderers.erase(std::find(uiRenderers.begin(), uiRenderers.end(), renderer));
}

void Engine::RegisterCamera(Camera *camera)
{
    LogVerbose("Registering camera...");
    this->cameras.push_back(camera);
}

void Engine::DeregisterCamera(Camera *camera)
{
    // There's no concurrency problem here
    LogVerbose("Deregistering camera...");
    this->cameras.erase(std::find(cameras.begin(), cameras.end(), camera));
}

void Engine::RegisterGameObject(GameObject *o)
{
    this->gameObjectsToAdd.push_back(o);
}

void Engine::DeleteGameObject(GameObject *o)
{
    this->gameObjectsToDelete.push_back(o);
}

// This must be called before the frame is updated
void Engine::InitializeNewGameObjects()
{
    for(GameObjectIterator g = gameObjectsToAdd.begin(); g != gameObjectsToAdd.end(); g++)
        gameObjects.push_back(*g);

    gameObjectsToAdd.clear();
}

// This must be called after the frame is updated
void Engine::DeleteGameObjects()
{
    for(GameObjectIterator g = gameObjectsToDelete.begin(); g != gameObjectsToDelete.end(); g++)
    {
        gameObjects.erase(std::find(gameObjects.begin(), gameObjects.end(), *g));
        delete (*g);
    }

    gameObjectsToDelete.clear();
}

void Engine::RenderUI()
{
    Camera * camera = uiCamera;
    glm::mat4 viewProj = camera->GetViewProjectionMatrix();

	camera->Render();
	
    for (UIRendererIterator r = uiRenderers.begin(); r != uiRenderers.end(); r++)
    {
        UIRenderer * renderer = *r;

        if (renderer->GetGameObject()->IsEnabledInHierarchy() && renderer->IsEnabled())
            renderer->Render(viewProj, glm::vec4());
    }
}

void Engine::Initialize(sf::Window * window)
{
	this->window = window;
	this->window->setKeyRepeatEnabled(false);
    this->uiCamera = GameObject::Instantiate("UICamera")->AddComponent<UICamera>();
	this->lastFrameClock = std::chrono::high_resolution_clock::now();
		
	// Load GLEW
	GLenum err = glewInit();

	// Show this before, just in case there's an error
	std::cout << "--------------------------------------" << std::endl;
	std::cout << "OpenGL version: " << glGetString(GL_VERSION) << std::endl;;
	std::cout << "GLSL version: " << glGetString(GL_SHADING_LANGUAGE_VERSION) << std::endl;
	std::cout << "Vendor: " << glGetString(GL_VENDOR) << std::endl;;
	std::cout << "Renderer: " << glGetString(GL_RENDERER) << std::endl;
	std::cout << "--------------------------------------" << std::endl;
	
	if (err != GLEW_OK) {
		std::cerr << "glewInit failed: " << glewGetErrorString(err) << std::endl;
		exit(1);
	}

	if (!GLEW_VERSION_3_0)
	{
		LogError("OpenGL 3.0 not supported.");
		exit(1);
	}

	glEnable(GL_TEXTURE_2D);
}

void Engine::Update(float deltaTime)
{
    deltaTime = glm::clamp(deltaTime, 0.0f, .05f); // At most, 10fps internally
    this->time += deltaTime;
    this->deltaTime = deltaTime;

    log->FlushAll();

    // Make sure time has passed!
    if(deltaTime > .00001f)
    {
        InitializeNewGameObjects();

        // For now, objects are updated disregarding their hierarchy. When/if needed,
        // we can implement this
        for(GameObjectIterator g = gameObjects.begin(); g!= gameObjects.end(); g++)
            if((*g)->IsEnabledInHierarchy())
                (*g)->Update();

        for(GameObjectIterator g = gameObjects.begin(); g!= gameObjects.end(); g++)
            if((*g)->IsEnabledInHierarchy())
                (*g)->PhysicsUpdate();

        DeleteGameObjects();
    }

    // Rendering is independent on time
    Render();

	AssetDatabase::GetInstance()->Update();
}

bool CompareRenderers(Renderer * lhs, Renderer * rhs)
{
    return Material::Compare(*lhs->GetMaterial(), *rhs->GetMaterial());
}

void Engine::Render()
{
	// Sort renderers by their material queues (TODO: Do something more optimized in case we have many renderers)
	//std::sort(renderers.begin(), renderers.end(), CompareRenderers);

	glm::ivec2 screenSize = GetScreenSize();

	for (CameraIterator c = cameras.begin(); c != cameras.end(); c++)
	{
		Camera * camera = *c;
        camera->UpdateScreenSize();
		glm::mat4 viewProj = camera->GetViewProjectionMatrix();

		camera->Render();

		for (RendererIterator r = renderers.begin(); r != renderers.end(); r++)
		{
			Renderer * renderer = *r;

            if (renderer->GetGameObject()->IsEnabledInHierarchy() && !camera->Cull(renderer->GetGameObject()->GetLayer()) && renderer->IsEnabled())
                renderer->Render(viewProj, camera->GetCameraParameters());
		}

		camera->FinishRender();
	}   

	// Render shader passes
	for (PassIterator p = composers.begin(); p != composers.end(); p++)
		(*p)->Render();

    // Now render the UI
    RenderUI();
}

// This is the main loop
void Engine::Start()
{
	if (window == nullptr)
		LogError("Window not assigned!");

	while (window->isOpen())
	{
		std::chrono::steady_clock::time_point frameClock = std::chrono::high_resolution_clock::now();
		double delta = std::chrono::duration<double, std::milli>(frameClock - lastFrameClock).count() / 1000.0;
		this->lastFrameClock = frameClock;

		sf::Event event;
		while (window->pollEvent(event))
		{
			if (event.type == sf::Event::Resized)
				this->OnOpenGLContextChanged();

			if (event.type == sf::Event::Closed ||
				(event.type == sf::Event::KeyPressed && event.key.code == sf::Keyboard::Key::Escape))
				window->close();
					

			if (event.type == sf::Event::MouseEntered)
			{
				window->setMouseCursorGrabbed(true);
				window->setMouseCursorVisible(false);
				mouseLocked = true;
				CenterMousePosition();
			}

			if (event.type == sf::Event::MouseLeft ||
				(event.type == sf::Event::KeyPressed && event.key.code == sf::Keyboard::Key::Space))
			{
				window->setMouseCursorGrabbed(false);
				window->setMouseCursorVisible(true);
				mouseLocked = false;
			}

			this->input->HandleEvent(&event);
		}
		
		this->Update(delta);

		this->Render();

		window->display();

		if (targetFramerate > 0 && targetFramerate <= 60)
		{
			int ms = 1000.f / targetFramerate;
			double frameDeltaMilli = std::chrono::duration<double, std::milli>(std::chrono::high_resolution_clock::now() - frameClock).count();

			this->actualFrameTime = frameDeltaMilli / 1000.f;

			if (frameDeltaMilli < ms)
				std::this_thread::sleep_for(std::chrono::milliseconds(ms - (int)frameDeltaMilli - 1));
		}
	}
}

void Engine::OnOpenGLContextChanged()
{
    for(CameraIterator c = cameras.begin(); c != cameras.end(); c++)
        (*c)->UpdateScreenSize();

    uiCamera->UpdateScreenSize();

	LogInfo("Window resized");
}

void Engine::Test()
{
//    GameObject * player = GameObject::Instantiate("Player");
//    Component * c1 = player->AddComponent<Component>();
//    Component * c2 = player->AddComponent<ComponentExample>();
//    Component * c3 = player->AddComponent<ComponentWithInputExample>();

//    Component * e1 = player->GetComponent<Component>();
//    Component * e2 = player->GetComponent<ComponentExample>();
//    Component * e3 = player->GetComponent<ComponentWithInputExample>();

//    assert(c1 == e1);
//    assert(c2 == e2);
//    assert(c3 == e3);
//    assert(typeid(*c2) == typeid(*e2));
//    assert(typeid(*c3) == typeid(*e3));

//    LogDebug(player->ToString());

////    std::cout << c1 << ", " << e1 << std::endl;
////    std::cout << c2 << ", " << e2 << std::endl;
////    std::cout << c3 << ", " << e3 << std::endl;
////    std::cout << typeid(*c2).name() << ", " << typeid(*e2).name() << std::endl;
////    std::cout << typeid(*c3).name() << ", " << typeid(*e3).name() << std::endl;

//    player->Destroy();
//    this->Update(1.0/60.0);
//    assert(this->gameObjects.size() == 0);

//    GameObject * cameraContainer = GameObject::Instantiate("Camera");
//    cameraContainer->AddComponent<PerspectiveCamera>();
//    cameraContainer->Destroy();
//    this->Update(1.0/60.0);
//    assert(this->gameObjects.size() == 0);
//    assert(this->cameras.size() == 0);
}

Input * Engine::GetInput()
{
	return input;
}

void Engine::AddLogger(Log *logger)
{
    this->log->GetInternalLogger()->AddLogger(logger);
}

sf::Window * Engine::GetWindow()
{
	return this->window;
}

void Engine::SetTargetFramerate(int fps)
{
	this->targetFramerate = fps;
}

void Engine::AddShaderComposer(ShaderPassComposer * composer)
{
	this->composers.push_back(composer);
}

// Note: NOT thread safe!
Engine *Engine::GetInstance()
{
    if(instance == nullptr)
        instance = new Engine();

    return instance;
}

Log *Engine::GetLog()
{
    return GetInstance()->log;
}

float Engine::Time()
{
    return GetInstance()->time;
}

float Engine::DeltaTime()
{
    return GetInstance()->deltaTime;
}

float Engine::ActualFrameTime()
{
	return GetInstance()->actualFrameTime;
}

void Engine::CheckGLError()
{
	int error = glGetError();

	if (error != GL_NO_ERROR)
	{
		LogError("OpenGL Error: " + std::string((char*)glewGetErrorString(error)) + " (" + std::to_string(error) + ")");
	}
}

glm::ivec2 Engine::GetScreenSize()
{
	Engine * e = GetInstance();
	sf::Vector2u s = e->window->getSize();
	return glm::ivec2(s.x, s.y);
}

glm::ivec2 Engine::GetCurrentMousePosition()
{
	sf::Vector2i p = sf::Mouse::getPosition(*GetInstance()->window);
	return glm::ivec2(p.x, p.y);
}

void Engine::CenterMousePosition()
{
	if (instance == nullptr)
		return;

	if (instance->mouseLocked)
	{
		// Hacky, but SFML is not very flexible with this...
		glm::vec2 screenCenter = glm::vec2(Engine::GetScreenSize()) * .5f;
		sf::Mouse::setPosition(sf::Vector2i(screenCenter.x, screenCenter.y), * instance->GetWindow());
	}
}

bool Engine::MouseLocked()
{
	return GetInstance()->mouseLocked;
}

void Engine::LogVerbose(const std::string &str)
{
    GetInstance()->log->LogLine(Log::Verbose, str);
}

void Engine::LogDebug(const std::string &str)
{
    GetInstance()->log->LogLine(Log::Debug, str);
}

void Engine::LogInfo(const std::string& str)
{
    GetInstance()->log->LogLine(Log::Info, str);
}

void Engine::LogWarning(const std::string &str)
{
    GetInstance()->log->LogLine(Log::Warning, str);
}

void Engine::LogError(const std::string &str)
{
    GetInstance()->log->LogLine(Log::Error, str);
}
