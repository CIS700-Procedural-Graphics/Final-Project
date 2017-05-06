#ifndef GAMEOBJECT_H
#define GAMEOBJECT_H

#include "../common.h"
#include "engine.h"
#include "input.h"
#include "component.h"
#include "transform.h"
#include <vector>
#include <unordered_map>
#include <typeindex>
#include <iostream>


typedef std::unordered_map<std::type_index, std::vector<Component*>>::iterator ComponentEntryIterator;

class GameObject final
{
public:
    static GameObject * Instantiate(const std::string &name);
    static GameObject * Instantiate();

    Transform * GetTransform();
    void Update();
    void PhysicsUpdate();
    void Destroy();

    std::string ToString();
    const std::string& Name();

	int GetLayer();
	void SetLayer(int layer);

    bool IsEnabledInHierarchy(); // Warning: recursive
    void SetEnabled(bool enabled);

    // This method uses the RTTI type for T as an index
    // for a hashmap.
    template <class T>
    T* AddComponent()
    {
		T * t = new T();
		t->SetParentGameObject(this);

		// If the new component requires input, register it
		InputListener * listener = dynamic_cast<InputListener*>(t);

		if (listener != nullptr)
			Engine::GetInstance()->GetInput()->RegisterListener(listener);

		components[typeid(T)].push_back(t);
		componentsToStart.push_back(t);
		t->Awake();
		return t;
    }

    // Similar to AddComponent, this method expects the type to match,
    // dynamically casting the result to T.
    // The return value is the first component found
    template<class T>
    T * GetComponent()
    {
        std::vector<Component*>& list = components[typeid(T)];

        if(list.size() > 0)
            return dynamic_cast<T*>(list[0]);

        return nullptr;
    }

    template<class T>
    void GetComponent(std::vector<T*>& result)
    {
        result.clear();
        std::vector<Component*>& list = components[typeid(T)];

        if(list.size() > 0)
        {
            for(std::vector<Component*>::iterator i = list.begin(); i != list.end(); i++)
                result.push_back(dynamic_cast<T*>(*i));
        }
    }

    // Prevent the user from doing funny stuff
    GameObject(const GameObject &) = delete;
    GameObject & operator=(const GameObject &) = delete;
    GameObject(GameObject &&) = delete;
    GameObject & operator=(GameObject &&) = delete;

private:
	friend class Engine;
	friend class Component;

	std::string name;
	std::unordered_map<std::type_index, std::vector<Component*>> components;
	std::vector<Component*> componentsToStart;
	Transform transform;
	bool isDestroyed;
	bool enabled;
	int layer;

	// We don't want any stack allocated game object...
	GameObject(const std::string &name);
	~GameObject();

	void * operator new(std::size_t size);
	void operator delete(void * ptr);

	void DestroyComponent(Component * c);
};

std::ostream& operator<< (std::ostream& stream, GameObject& o);

#endif // GAMEOBJECT_H
