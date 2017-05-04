#pragma once

#include "../ui/uicomponent.h"
#include "../ui/uitext.h"

class FPSCounter : public UIComponent, public InputListener
{
public:
	void Awake();
	void Update();
	virtual void OnKeyReleaseEvent(sf::Event::KeyEvent * e);

private:
	UIText * text;
	int currentFrame;
	float currentFrameTimeAverage;
	float minTime;
	float maxTime;

	bool ignoreForcedFramerate;
};

