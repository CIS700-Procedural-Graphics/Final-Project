#include "common.h"

#include "core\assets\assetdatabase.h"
#include "core\assets\texture.h"
#include "core\assets\shader.h"
#include "core\engine.h"
#include "core\material.h"
#include "core\gameobject.h"
#include "core\components\renderer.h"
#include "core\components\FPSCounter.h"
#include "core\components\camera.h"
#include "core\assets\meshfactory.h"
#include "core\ui\uitext.h"
#include "core\ui\uiimage.h"
#include "demo\DemoController.h"

#include <iostream>

#define DEBUG true

int main()
{
	Engine * engine = Engine::GetInstance();

	sf::ContextSettings window_settings;
	window_settings.depthBits = 24;
	window_settings.stencilBits = 8;
	window_settings.majorVersion = 4;
	window_settings.minorVersion = 0;

	sf::Window * window = new sf::Window(sf::VideoMode(sf::VideoMode::getDesktopMode().width, sf::VideoMode::getDesktopMode().height, 32), 
										"pruitt-igoe", sf::Style::Fullscreen, window_settings);	
	window->setMouseCursorVisible(false);
	//window->setVerticalSyncEnabled(true);
	
	engine->Initialize(window);
	engine->GetLog()->SetLogLevel(Log::LogLevel::Verbose);
	engine->SetTargetFramerate(60);

	GameObject * demo = GameObject::Instantiate("demo");
	demo->AddComponent<DemoController>();
	
	if (DEBUG)
	{
		GameObject * fpsCounter = GameObject::Instantiate("fps");
		fpsCounter->AddComponent<FPSCounter>();
	}
	
	engine->Start();
	
	return 0;
}