#include "gameobject.h"
#include "engine.h"
#include "component.h"
#include "input.h"
#include <iostream>

GameObject::GameObject(const std::string& name) : name(name), components(), transform(this, glm::vec3(0.f), glm::vec3(0.f), glm::vec3(1.f)), isDestroyed(false), enabled(true), layer(1)
{
}

GameObject::~GameObject()
{
    // Remember to delete components!
    for(ComponentEntryIterator entry = components.begin(); entry != components.end(); entry++)
    {
        std::vector<Component*>& list = entry->second;

        for(unsigned int i = 0; i < list.size(); i++)
        {
            Component * c = list[i];

			// If the new component was registered, deregister it
			InputListener * listener = dynamic_cast<InputListener*>(c);

			if (listener != nullptr)
				Engine::GetInstance()->GetInput()->DeregisterListener(listener);

            delete c;
        }
    }
}

void GameObject::Update()
{
    if(!this->isDestroyed)
    {
        // Start components
        for(std::vector<Component*>::iterator c = componentsToStart.begin(); c != componentsToStart.end(); c ++ )
            (*c)->Start();

        componentsToStart.clear();

        // Update components
        for(ComponentEntryIterator entry = components.begin(); entry != components.end(); entry++)
        {
            std::vector<Component*>& comps = entry->second;

            for(std::vector<Component*>::iterator c = comps.begin(); c != comps.end(); c ++ )                
                if((*c)->IsEnabled())
                    (*c)->Update();
        }
    }
}

void GameObject::PhysicsUpdate()
{
    if(!this->isDestroyed)
    {
        // Update components
        for(ComponentEntryIterator entry = components.begin(); entry != components.end(); entry++)
        {
            std::vector<Component*>& comps = entry->second;

            for(std::vector<Component*>::iterator c = comps.begin(); c != comps.end(); c ++ )
                if((*c)->IsEnabled())
                    (*c)->PhysicsUpdate();
        }
    }
}

void GameObject::Destroy()
{
    if(!this->isDestroyed)
    {
        this->isDestroyed = true;

        // Tell the engine this game object should be destroyed
        Engine::GetInstance()->DeleteGameObject(this);
    }
}

std::string GameObject::ToString()
{
    return name + " [" + std::to_string(components.size()) + " components]";
}

const std::string &GameObject::Name()
{
    return name;
}

int GameObject::GetLayer()
{
	return layer;
}

void GameObject::SetLayer(int layer)
{
	this->layer = layer;
}

bool GameObject::IsEnabledInHierarchy()
{
    bool result = this->enabled;

    if(!result)
        return false;

    if(transform.GetParent() != nullptr)
        return transform.GetParent()->GetGameObject()->IsEnabledInHierarchy();

    return true;
}

void GameObject::SetEnabled(bool enabled)
{
    this->enabled = enabled;
}

// Not very efficient because we must find it, be careful!
void GameObject::DestroyComponent(Component *c)
{
    ComponentEntryIterator entry;

    for(entry = components.begin(); entry != components.end(); entry++)
    {
        std::vector<Component*>& list = entry->second;
        std::vector<Component*>::iterator i;

        for(i = list.begin(); i != list.end(); i++)
        {
            // If we find the component, destroy it
            if(*i == c)
            {
                c->OnDestroy(); // We only destroy it if it is part of this game object
                list.erase(i);
                delete c;
                return;
            }
        }
    }

    Engine::LogError("Tried to destroy an invalid component!");
}

std::ostream &operator<<(std::ostream &stream, GameObject &o)
{
    return stream << o.ToString();
}

void *GameObject::operator new(std::size_t size)
{
    // TODO: ask memory from pool to Engine
    return ::new char [size];
}

void GameObject::operator delete(void *ptr)
{
    // TODO: handle memory pool with Engine
    delete[] static_cast<char*>(ptr);
}

GameObject *GameObject::Instantiate(const std::string& name)
{
    GameObject * o = new GameObject(name);

    // Tell the engine this game object exists
    Engine::GetInstance()->RegisterGameObject(o);

    return o;
}

GameObject *GameObject::Instantiate()
{
    return Instantiate("GameObject");
}

Transform *GameObject::GetTransform()
{
    return &transform;
}
