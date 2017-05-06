#pragma once

#include "../component.h"
#include "../input.h"
#include "../material.h"
#include "../engine.h"

class ShaderReloader : public Component, public InputListener
{
public:
	Material * material;
	virtual void OnKeyPressEvent(sf::Event::KeyEvent * e);
};