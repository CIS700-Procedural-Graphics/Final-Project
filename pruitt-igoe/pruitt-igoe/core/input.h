#ifndef INPUT_H
#define INPUT_H

#include "../common.h"
#include <vector>

// Good old-fashioned observer pattern
class InputListener
{
public:
    // These are the only ones we need now...
    virtual void OnKeyPressEvent(sf::Event::KeyEvent * e){}
    virtual void OnKeyReleaseEvent(sf::Event::KeyEvent * e){}

    virtual void OnMousePressEvent(sf::Event::MouseButtonEvent * e){}
    virtual void OnMouseReleaseEvent(sf::Event::MouseButtonEvent * e){}
    virtual void OnMouseMoveEvent(sf::Event::MouseMoveEvent * e){}
    virtual void OnMouseWheelEvent(sf::Event::MouseWheelEvent * e){}

    virtual ~InputListener(){}
};

// Input handler for our engine
// For now, is uses Qt's input primitives, but in the future it should be abstracted...
class Input
{
protected:
    std::vector<InputListener*> listeners;
    typedef std::vector<InputListener*>::iterator InputListenerIterator;

public:
    Input();

	void HandleEvent(sf::Event * e);

    void RegisterListener(InputListener * l);
    void DeregisterListener(InputListener * l);

    void DispatchKeyPressEvent(sf::Event::KeyEvent * e);
    void DispatchKeyReleaseEvent(sf::Event::KeyEvent * e);

    void DispatchMousePressEvent(sf::Event::MouseButtonEvent * e);
    void DispatchMouseReleaseEvent(sf::Event::MouseButtonEvent * e);
    void DispatchMouseMoveEvent(sf::Event::MouseMoveEvent * e);
    void DispatchMouseWheelEvent(sf::Event::MouseWheelEvent * e);
};

#endif // INPUT_H
