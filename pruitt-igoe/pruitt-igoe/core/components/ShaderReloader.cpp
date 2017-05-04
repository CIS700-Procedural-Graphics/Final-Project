#include "ShaderReloader.h"

void ShaderReloader::OnKeyPressEvent(sf::Event::KeyEvent * e)
{
	if (e->code == sf::Keyboard::Key::R)
	{
		if (material != nullptr)
		{
			material->Reload();
			Engine::LogInfo("Reloading shader!");
		}
	}
}