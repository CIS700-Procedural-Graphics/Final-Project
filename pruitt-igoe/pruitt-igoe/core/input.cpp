#include "input.h"
#include "engine.h"
#include "gameobject.h"
#include <iostream>
#include <typeinfo>

Input::Input() : listeners()
{
}

void Input::HandleEvent(sf::Event * e)
{
	switch (e->type)
	{
		case sf::Event::EventType::KeyPressed:
			this->DispatchKeyPressEvent(&e->key);
			break;
		case sf::Event::EventType::KeyReleased:
			this->DispatchKeyReleaseEvent(&e->key);
			break;

		case sf::Event::EventType::MouseButtonPressed:
			this->DispatchMousePressEvent(&e->mouseButton);
			break;
		case sf::Event::EventType::MouseButtonReleased:
			this->DispatchMouseReleaseEvent(&e->mouseButton);
			break;

		case sf::Event::EventType::MouseMoved:
			this->DispatchMouseMoveEvent(&e->mouseMove);
			break;

		case sf::Event::EventType::MouseWheelMoved:
			this->DispatchMouseWheelEvent(&e->mouseWheel);
			break;
	}

}

void Input::RegisterListener(InputListener *l)
{
    this->listeners.push_back(l);

    Component * c = dynamic_cast<Component*>(l);

    if(c != nullptr)
        Engine::LogVerbose("Registering a listener: " + c->ToString());
    else
        Engine::LogVerbose("Registering a listener...");
}

void Input::DeregisterListener(InputListener *l)
{
    InputListenerIterator i = std::find(this->listeners.begin(), this->listeners.end(), l);

    if(i != this->listeners.end())
        this->listeners.erase(i);

    Component * c = dynamic_cast<Component*>(l);

    if(c != nullptr)
        Engine::LogVerbose("Deregistering a listener: " + c->ToString());
    else
        Engine::LogVerbose("Deregistering a listener...");
}

void Input::DispatchKeyPressEvent(sf::Event::KeyEvent *e)
{
//    Engine::LogVerbose("Dispatching key press event...");
    for(InputListenerIterator i = listeners.begin(); i != listeners.end(); i++)
        (*i)->OnKeyPressEvent(e);
}

void Input::DispatchKeyReleaseEvent(sf::Event::KeyEvent  *e)
{
//    Engine::LogVerbose("Dispatching key release event... ");
    for(InputListenerIterator i = listeners.begin(); i != listeners.end(); i++)
        (*i)->OnKeyReleaseEvent(e);
}

void Input::DispatchMousePressEvent(sf::Event::MouseButtonEvent *e)
{
//    Engine::LogVerbose("Dispatching mouse press event... ");

    for(InputListenerIterator i = listeners.begin(); i != listeners.end(); i++)
        (*i)->OnMousePressEvent(e);
}

void Input::DispatchMouseReleaseEvent(sf::Event::MouseButtonEvent *e)
{
//    Engine::LogVerbose("Dispatching mouse release event... ");

    for(InputListenerIterator i = listeners.begin(); i != listeners.end(); i++)
        (*i)->OnMouseReleaseEvent(e);
}

void Input::DispatchMouseMoveEvent(sf::Event::MouseMoveEvent *e)
{
    // Too much frequency
//    Engine::LogDebug("Dispatching mouse move event... ");
	
    for(InputListenerIterator i = listeners.begin(); i != listeners.end(); i++)
        (*i)->OnMouseMoveEvent(e);
}

void Input::DispatchMouseWheelEvent(sf::Event::MouseWheelEvent *e)
{
//    Engine::LogVerbose("Dispatching mouse wheel event... ");

    for(InputListenerIterator i = listeners.begin(); i != listeners.end(); i++)
        (*i)->OnMouseWheelEvent(e);
}
