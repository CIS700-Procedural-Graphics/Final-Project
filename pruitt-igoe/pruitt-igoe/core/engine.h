#ifndef ENGINE_H
#define ENGINE_H

#include "log.h"
#include <vector>
#include <chrono>

class GameObject;
class Component;
class Camera;
class Renderer;
class UIRenderer;
class UICamera;
class Input;
class ShaderPassComposer;

typedef std::vector<GameObject*>::iterator GameObjectIterator;
typedef std::vector<Camera*>::iterator CameraIterator;
typedef std::vector<Renderer*>::iterator RendererIterator;
typedef std::vector<UIRenderer*>::iterator UIRendererIterator;
typedef std::vector<ShaderPassComposer*>::iterator PassIterator;

// Basic engine inspired by Unity's entity-component architecture
class Engine
{
public:
    void Initialize(sf::Window * window);
    void Update(float deltaTime);
    void Render();
	void Start();
    void Test();
	Input * GetInput();

	void AddShaderComposer(ShaderPassComposer * composer);
    void OnOpenGLContextChanged();
    void AddLogger(Log * logger);
	sf::Window * GetWindow();

	void SetTargetFramerate(int fps);
	
    static Engine* GetInstance();
    static Log* GetLog();
    static float Time();
    static float DeltaTime();
	static float ActualFrameTime();
	static void CheckGLError();

    static glm::ivec2 GetScreenSize();
    static glm::ivec2 GetCurrentMousePosition();
	static void CenterMousePosition();
	static bool MouseLocked();

    // Simplified logging
    static void LogVerbose(const std::string &str);
    static void LogDebug(const std::string &str);
    static void LogInfo(const std::string &str);
    static void LogWarning(const std::string &str);
    static void LogError(const std::string &str);

private:
	friend class GameObject;
	friend class Camera; // There's some cooperation needed with cameras that is simpler this way
	friend class Renderer;
	friend class UIRenderer;

	Engine();

	static Engine * instance;
	Input * input;
	sf::Window * window;
	float time;
	float deltaTime;
	float actualFrameTime;
	int targetFramerate;
	bool mouseLocked;
	std::chrono::steady_clock::time_point lastFrameClock;

	std::vector<GameObject*> gameObjects;
	std::vector<Camera*> cameras;
	std::vector<Renderer*> renderers;
	std::vector<ShaderPassComposer*> composers;

	std::vector<UIRenderer*> uiRenderers;
	UICamera * uiCamera;

	// These lists are to prevent concurrent modification of the main list
	// while updating the frame
	std::vector<GameObject*> gameObjectsToAdd;
	std::vector<GameObject*> gameObjectsToDelete;
	ConcurrentLog<MultiLog> * log;

	void RegisterRenderer(Renderer * renderer);
	void DeregisterRenderer(Renderer * renderer);

	void RegisterUIRenderer(UIRenderer * renderer);
	void DeregisterUIRenderer(UIRenderer * renderer);

	void RegisterCamera(Camera* camera);
	void DeregisterCamera(Camera* camera);

	void RegisterGameObject(GameObject * o);
	void DeleteGameObject(GameObject * o);

	void InitializeNewGameObjects();
	void DeleteGameObjects();

	void RenderUI();
};

#endif // ENGINE_H
