#include "assetdatabase.h"
#include "../engine.h"

AssetDatabase * AssetDatabase::instance = nullptr;
bool AssetDatabase::deleted = false;

void AssetDatabase::Update()
{
	reloadMutex.lock();
	
	for (int i = 0; i < assetsToReload.size(); i++)
		assetsToReload[i]->Reload();

	if (assetsToReload.size())
		Engine::LogInfo("Reloaded " + std::to_string(assetsToReload.size()) + " assets.");

	assetsToReload.clear();

	reloadMutex.unlock();
}

AssetDatabase::~AssetDatabase()
{
	deleted = true;
}

AssetDatabase::AssetDatabase()
{
	this->updateThread = std::thread(&AssetDatabase::WatchAssets, this);
}

void AssetDatabase::WatchAssets()
{
	while (!AssetDatabase::deleted)
	{
		for (auto typeEntry : assetMap)
		{
			for (auto idEntry : typeEntry.second)
			{
				if (idEntry.second->ShouldReload())
				{
					reloadMutex.lock();
					this->assetsToReload.push_back(idEntry.second);
					reloadMutex.unlock();
				}
			}
		}

		std::this_thread::sleep_for(std::chrono::seconds(1));
	}
}

AssetDatabase *AssetDatabase::GetInstance()
{
    if(instance == nullptr)
        instance = new AssetDatabase();

    return instance;
}
