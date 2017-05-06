#include "DemoController.h"
#include "Terrain.h"
#include "UnderworldTerrain.h"
#include <random>

struct DemoContext
{
	Terrain * firstTerrain;
	UnderworldTerrain * secondTerrain;

	GameObject * water;
	Material * waterMaterial;

	GameObject * pillar;
	Material * pillarMaterial;

	GameObject * portal;
	Material * portalMaterial;

	Material * vignetteMaterial;
	DemoCameraController * camController;
};

class BaseDemoCamera : public CameraShotController
{
public:
	BaseDemoCamera(float duration, PerspectiveCamera * camera, DemoContext context) : CameraShotController(duration, camera)
	{
		this->context = context;
	}
protected:
	DemoContext context;
};

class WaitCamera : public BaseDemoCamera
{
public:
	WaitCamera(float duration, PerspectiveCamera * camera, DemoContext context) : BaseDemoCamera(duration, camera, context)
	{
	}

	virtual void OnExit()
	{
		context.camController->StartMusic();
	}

	virtual void OnUpdate(float time)
	{
		glm::vec3 pos = glm::vec3(705.0, 25, 552);
		glm::vec3 target = glm::vec3(650.0, -100.f, 552);

		this->camera->GetTransform()->SetLocalPosition(pos);
		this->camera->GetTransform()->LookAt(target);

		context.vignetteMaterial->SetFloat("Fade", glm::clamp(time * 1.5f, 0.f, 1.f));
	}

	virtual void OnSetActive()
	{
		context.firstTerrain->GetGameObject()->SetEnabled(true);
		context.firstTerrain->material->SetFeature(GL_STENCIL_TEST, false); // No stencil on this shot
		context.water->SetEnabled(true);
		context.portal->SetEnabled(false);

		camera->GetTransform()->SetLocalRotation(glm::vec3());

	}
};

class IntroCamera : public BaseDemoCamera
{
public:
	IntroCamera(float duration, PerspectiveCamera * camera, DemoContext context) : BaseDemoCamera(duration, camera, context)
	{
	}

	virtual void OnExit()
	{
		context.firstTerrain->GetGameObject()->SetEnabled(true);
		context.water->SetEnabled(true);
	}

	virtual void OnUpdate(float time)
	{
		glm::vec3 pos = glm::vec3(705.0, 25, 552) + glm::vec3(0.f, 60.f, -100.f) * time;
		glm::vec3 target = glm::vec3(650.0, -100.f, 552) + glm::vec3(0.f, 5.f, -80.f) * glm::smoothstep(0.f, 1.f, time);

		this->camera->GetTransform()->SetLocalPosition(pos);
		this->camera->GetTransform()->LookAt(target);

		context.waterMaterial->SetFloat("WaveTime", time * this->duration);
	}

	virtual void OnSetActive()
	{
		context.firstTerrain->GetGameObject()->SetEnabled(true);
		context.firstTerrain->material->SetFeature(GL_STENCIL_TEST, false); // No stencil on this shot
		context.water->SetEnabled(true);
		context.portal->SetEnabled(false);

		camera->GetTransform()->SetLocalRotation(glm::vec3());
	}
};

class TeleCamera : public BaseDemoCamera
{
public:
	TeleCamera(float duration, PerspectiveCamera * camera, DemoContext context) : BaseDemoCamera(duration, camera, context)
	{
	}

	virtual void OnExit()
	{
	}

	virtual void OnUpdate(float time)
	{
		glm::vec3 pos = glm::vec3(705.0, -59, 552) + glm::vec3(0.f, -20.f, -25.f) * time * .35f;
		glm::vec3 target = glm::vec3(650.0, -75.f, 502) + glm::vec3(0.f, 5.f, -100.f) * time * .35f;

		this->camera->GetTransform()->SetLocalPosition(pos);
		this->camera->GetTransform()->LookAt(target);
	}

	virtual void OnSetActive()
	{
		context.firstTerrain->GetGameObject()->SetEnabled(true);
		context.firstTerrain->material->SetFeature(GL_STENCIL_TEST, false); // No stencil on this shot
		context.water->SetEnabled(false);
		context.portal->SetEnabled(false);

		// Reset rotation
		camera->GetTransform()->SetLocalRotation(glm::vec3());
	}
};

class TeleCameraPrePortal : public BaseDemoCamera
{
public:
	TeleCameraPrePortal(float duration, PerspectiveCamera * camera, DemoContext context) : BaseDemoCamera(duration, camera, context)
	{
	}

	virtual void OnExit()
	{
	}

	virtual void OnUpdate(float time)
	{
		glm::vec3 pos = glm::vec3(700, -80, 780) + glm::vec3(-50.f, 10.f, -50.f) * time;
		glm::vec3 target = glm::vec3(600, -75.f, 650) + glm::vec3(-10.f, 5.f, -200.f) * time;

		this->camera->GetTransform()->SetLocalPosition(pos);
		this->camera->GetTransform()->LookAt(target);
	}

	virtual void OnSetActive()
	{
		context.firstTerrain->GetGameObject()->SetEnabled(true);
		context.firstTerrain->material->SetFeature(GL_STENCIL_TEST, false); // No stencil on this shot
		context.water->SetEnabled(false);
		context.portal->SetEnabled(false);

		// Reset rotation
		camera->GetTransform()->SetLocalRotation(glm::vec3());
	}
};


class PortalCamera : public BaseDemoCamera
{
public:
	PortalCamera(float duration, PerspectiveCamera * camera, DemoContext context) : BaseDemoCamera(duration, camera, context)
	{
	}

	virtual void OnExit()
	{
	}

	virtual void OnUpdate(float time)
	{
		glm::vec3 target = glm::vec3(588.694092, -63.046982, 746.651306);
		glm::vec3 pos = glm::vec3(613.818787, -61.468536, 777.569641);

		glm::vec3 dir = glm::normalize(target - pos);
		pos += dir * 200.f * time;

		context.secondTerrain->material->SetFloat("Fade", glm::clamp(time * 3.f - .1f, 0.f, 1.f));

		if (time > .58f)
		{
			context.firstTerrain->GetGameObject()->SetEnabled(false);
			context.portal->SetEnabled(false);
			context.secondTerrain->material->SetFeature(GL_STENCIL_TEST, false);
		}

		this->camera->SetFieldOfView(30.f - time * 5.f);

		this->camera->GetTransform()->SetLocalPosition(pos);
		
		glm::quat rot = glm::angleAxis(Engine::DeltaTime() * .2f, dir);
		this->camera->GetTransform()->RotateLocal(rot);
	}

	virtual void OnSetActive()
	{
		context.firstTerrain->GetGameObject()->SetEnabled(true);
		context.firstTerrain->material->SetFeature(GL_STENCIL_TEST, true);
		context.portal->SetEnabled(true);

		// Reset rotation
		camera->GetTransform()->SetLocalRotation(glm::vec3());

		glm::vec3 target = glm::vec3(588.694092, -63.046982, 746.651306);
		glm::vec3 pos = glm::vec3(613.818787, -61.468536, 777.569641);
		
		this->camera->GetTransform()->SetLocalPosition(pos);
		this->camera->GetTransform()->LookAt(target);
		this->camera->SetFieldOfView(30.f);
	}
};

class UnderworldCamera : public BaseDemoCamera
{
public:
	UnderworldCamera(float duration, PerspectiveCamera * camera, DemoContext context) : BaseDemoCamera(duration, camera, context)
	{
	}

	virtual void OnExit()
	{
	}

	virtual void OnUpdate(float time)
	{
		glm::vec3 target = glm::vec3(-151.466568, -59.993839, 248.944382);
		glm::vec3 pos = glm::vec3(-113.519089, -60.204563, 261.591309);

		glm::vec3 dir = glm::normalize(target - pos);
		pos += dir * 300.f * (time + .2f);

		context.vignetteMaterial->SetFloat("Fade", 1.0f - glm::smoothstep(.8f, 1.f, time));

		this->camera->GetTransform()->SetLocalPosition(pos);
		this->camera->GetTransform()->LookAt(target);
	}

	virtual void OnSetActive()
	{
		context.firstTerrain->GetGameObject()->SetEnabled(false);
		context.water->SetEnabled(false);
		context.portal->SetEnabled(false);
		context.secondTerrain->GetGameObject()->SetEnabled(true);
		context.secondTerrain->GetTransform()->SetLocalRotation(glm::vec3());
		context.secondTerrain->GetTransform()->SetLocalPosition(glm::vec3());
		context.pillar->SetEnabled(true);
		context.secondTerrain->material->SetFeature(GL_STENCIL_TEST, false);

		// Reset rotation
		camera->GetTransform()->SetLocalRotation(glm::vec3());
		this->camera->SetFieldOfView(25.f);

		context.secondTerrain->material->SetFloat("Underworld", 1.f);
	}
};

void DemoController::Awake()
{
	glm::vec2 screenSize = glm::vec2(Engine::GetScreenSize());
	//RenderTexture * raymarchingTarget = new RenderTexture(screenSize.x, screenSize.y, true, TextureParameters(GL_LINEAR_MIPMAP_LINEAR, GL_LINEAR, GL_CLAMP, GL_CLAMP));
	//raymarchingTarget->Load();

	Texture * randomTexture = BuildRandomTexture();

	GameObject * raymarchingCamera = GameObject::Instantiate("raymarchingCamera");
	this->cameraController = raymarchingCamera->AddComponent<DemoCameraController>();
	this->cameraController->GetTransform()->SetWorldPosition(glm::vec3(1024, 64, 512));
	this->cameraController->GetTransform()->LookAt(glm::vec3(0.0, 20.0, 0.0));
	//this->cameraController->camera->SetRenderTexture(raymarchingTarget);
	this->cameraController->camera->backgroundColor = glm::vec4(0.f, 0.f, 0.f, 1.0);
	this->cameraController->camera->SetFarClip(2000);
	this->cameraController->camera->SetNearClip(10);
	this->cameraController->camera->clearStencil = true;
	this->cameraController->camera->SetFieldOfView(25.f);
	this->cameraController->camera->viewport = glm::vec4(0.f, 120.f, 0.f, 240.f);


	glm::vec3 pTarget = glm::vec3(588.694092, -65.046982, 746.651306);
	glm::vec3 pPos = glm::vec3(613.818787, -61.468536, 777.569641);
	glm::vec3 dir = glm::normalize(pTarget - pPos);

	Engine::LogInfo(glm::to_string(pTarget + dir * 90.f));

	GameObject * portalGO = GameObject::Instantiate("portal");
	portalGO->GetTransform()->SetLocalScale(glm::vec3(5.f, 30.f, 12.f));
	portalGO->GetTransform()->SetLocalPosition(pTarget + dir * 90.f + glm::vec3(0.f, 5.f, 0.f));
	portalGO->GetTransform()->SetLocalRotation(glm::vec3(0.f, -.607f, 0.f));
	MeshRenderer * portalRenderer = portalGO->AddComponent<MeshRenderer>();
	portalRenderer->SetMesh(MeshFactory::BuildCube(true));
	Material * portalMaterial = new Material("flat");
	portalRenderer->SetMaterial(portalMaterial);

	Material::StencilOperation stencilPortal;
	stencilPortal.mask = 0xFF;
	stencilPortal.operation = GL_ALWAYS;
	stencilPortal.fail = GL_REPLACE;
	stencilPortal.zFail = GL_REPLACE;
	stencilPortal.pass = GL_REPLACE;
	portalMaterial->SetFeature(GL_STENCIL_TEST, true);
	portalMaterial->SetDepthWrite(false);
	portalMaterial->SetStencilOperation(stencilPortal);

	GameObject * terrainGO = GameObject::Instantiate("terrain");
	this->terrain = terrainGO->AddComponent<Terrain>();

	Material::StencilOperation stencilTerrain;
	stencilTerrain.mask = 0x00;
	stencilTerrain.operation = GL_NOTEQUAL;
	stencilTerrain.fail = GL_KEEP;
	stencilTerrain.zFail = GL_KEEP;
	stencilTerrain.pass = GL_KEEP;
	this->terrain->material->SetFeature(GL_STENCIL_TEST, true);
	this->terrain->material->SetStencilOperation(stencilTerrain);

	GameObject * secondaryTerrainGO = GameObject::Instantiate("terrain");
	UnderworldTerrain * secondaryTerrain = secondaryTerrainGO->AddComponent<UnderworldTerrain>();
	secondaryTerrain->GetTransform()->SetLocalRotation(glm::vec3(glm::radians(180.f), 0.f, 0.f));
	secondaryTerrain->GetTransform()->SetLocalPosition(glm::vec3(-500.f, -140.f, 1024.f));

	Material::StencilOperation stencilTerrainSecondary;
	stencilTerrainSecondary.mask = 0x00;
	stencilTerrainSecondary.operation = GL_EQUAL;
	stencilTerrainSecondary.fail = GL_KEEP;
	stencilTerrainSecondary.zFail = GL_KEEP;
	stencilTerrainSecondary.pass = GL_KEEP;
	secondaryTerrain->material->SetFeature(GL_STENCIL_TEST, true);
	secondaryTerrain->material->SetStencilOperation(stencilTerrainSecondary);
	secondaryTerrain->material->SetFloat("Underworld", 0.f);
	secondaryTerrain->material->SetFloat("Fade", 0.f);

	GameObject * waterGO = GameObject::Instantiate("water");
	waterGO->GetTransform()->SetLocalPosition(glm::vec3(625, -90.f, 472));
	waterGO->GetTransform()->SetLocalRotation(glm::vec3(glm::radians(-90.f), 0.f, 0.f));
	waterGO->GetTransform()->SetLocalScale(glm::vec3(180, 180, 1));
	MeshRenderer * waterRenderer = waterGO->AddComponent<MeshRenderer>();
	waterRenderer->SetMesh(MeshFactory::BuildQuad());
	Material * waterMaterial = new Material("raymarched/water");
	waterMaterial->SetTexture("ReflectedHeightfield", terrain->floatingPointHeightmap);
	waterMaterial->SetVector("TerrainScale", glm::vec4(1.f / 1024.f, 1.f, 1.f / 1024.f, 0.f));
	waterMaterial->SetTexture("RandomTexture", randomTexture);
	waterMaterial->SetFeature(GL_BLEND, true);
	waterMaterial->SetBlendOperation(Material::BlendOperation(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA));
	waterRenderer->SetMaterial(waterMaterial);


	GameObject * lightPillar = GameObject::Instantiate("lightPillar");
	MeshRenderer * pillarRenderer = lightPillar->AddComponent<MeshRenderer>();
	pillarRenderer->SetMesh(MeshFactory::BuildCube(true, true));
	pillarRenderer->GetTransform()->SetLocalScale(glm::vec3(10.f, 1000.f, 10.f));
	pillarRenderer->GetTransform()->SetLocalPosition(glm::vec3(645.617249, 64.196426, 673.341614));

	Material * pillarMaterial = new Material("raymarched/light_pillar");
	pillarMaterial->SetTexture("RandomTexture", randomTexture);
	pillarMaterial->SetFeature(GL_BLEND, true);
	pillarMaterial->SetBlendOperation(Material::BlendOperation(GL_ONE, GL_ONE));
	pillarRenderer->SetMaterial(pillarMaterial);

	lightPillar->SetEnabled(false);
	
	raymarchedMaterials.push_back(pillarMaterial);
	raymarchedMaterials.push_back(terrain->material);
	raymarchedMaterials.push_back(waterMaterial);
	raymarchedMaterials.push_back(secondaryTerrain->material);
/*
	ShaderPassComposer * composer = new ShaderPassComposer();
	composer->SetSourceTarget(raymarchingTarget);*/

	//// Iterative raymarcher
	
	//ShaderPass * raymarchingPass = new ShaderPass("terrain", raymarchingTarget);
	//mainQuadMaterial = raymarchingPass->GetMaterial();

	//composer->AddPass(raymarchingPass);

	//// Copy buffer to feedback buffer
	//RenderTexture * feedbackBuffer = new RenderTexture(screenSize.x, screenSize.y, true, 32, TextureParameters(GL_LINEAR_MIPMAP_LINEAR, GL_LINEAR, GL_CLAMP, GL_CLAMP));
	//ShaderPass * copyPass = new ShaderPass("minKernel", feedbackBuffer);
	//copyPass->SetIgnoreTarget(true);
	//composer->AddPass(copyPass);

	//mainQuadMaterial->SetTexture("Heightfield", heightmap);
	//mainQuadMaterial->SetTexture("FeedbackBuffer", feedbackBuffer);

	GameObject * vignetteGO = GameObject::Instantiate("vignette");
	MeshRenderer *vignetteRenderer = vignetteGO->AddComponent<MeshRenderer>();
	vignetteRenderer->SetMesh(MeshFactory::BuildQuad());

	Material * vignetteMaterial = new Material("vignette");
	Texture * vignetteTexture = AssetDatabase::GetInstance()->LoadAsset<Texture>("resources/vignette.png");
	vignetteMaterial->SetTexture("Texture", vignetteTexture);
	vignetteMaterial->SetFeature(GL_BLEND, true);
	vignetteMaterial->SetFeature(GL_DEPTH_TEST, false);
	vignetteMaterial->SetDepthWrite(false);
	vignetteMaterial->SetBlendOperation(Material::BlendOperation(GL_DST_COLOR, GL_SRC_COLOR));
	vignetteRenderer->SetMaterial(vignetteMaterial);

	DemoContext context;
	context.firstTerrain = terrain;
	context.water = waterGO;
	context.waterMaterial = waterMaterial;
	context.portal = portalGO;
	context.portalMaterial = portalMaterial;
	context.secondTerrain = secondaryTerrain;
	context.vignetteMaterial = vignetteMaterial;
	context.camController = cameraController;
	context.pillar = lightPillar;
	context.pillarMaterial = pillarMaterial;

	this->cameraController->AddCameraShot(new WaitCamera(3.5f, this->cameraController->camera, context));
	this->cameraController->AddCameraShot(new IntroCamera(12.5f, this->cameraController->camera, context));
	this->cameraController->AddCameraShot(new TeleCamera(4.65f, this->cameraController->camera, context));
	this->cameraController->AddCameraShot(new TeleCameraPrePortal(8.65f, this->cameraController->camera, context));
	this->cameraController->AddCameraShot(new PortalCamera(17.5f, this->cameraController->camera, context));
	this->cameraController->AddCameraShot(new UnderworldCamera(20.f, this->cameraController->camera, context));
	
	//// Glitch pass
	//ShaderPass * shadingPass = new ShaderPass("glitch");
	//composer->AddPass(shadingPass);
	//Engine::GetInstance()->AddShaderComposer(composer);
}

void DemoController::Start()
{

}

void DemoController::Update()
{
	/*this->mainQuadMaterial->SetVector("CameraPosition", glm::vec4(this->cameraController->GetTransform()->WorldPosition(), 1.0));
	glm::mat4 invProj = glm::inverse(this->cameraController->camera->GetViewProjectionMatrix());
	this->mainQuadMaterial->SetMatrix("InvViewProjection", invProj);*/

	for(int i = 0; i < raymarchedMaterials.size(); i++)
		raymarchedMaterials[i]->SetVector("CameraPosition", glm::vec4(this->cameraController->GetTransform()->WorldPosition(), 1.0));
}

Texture * DemoController::BuildRandomTexture()
{
	int length = 512;
	int size = length * length;
	std::mt19937 mersenne(140401956);
	std::uniform_real_distribution<> distr(0, 255);

	uint8_t * pixels = new uint8_t[size*4];

	for (int i = 0; i < size; i++)
	{
		glm::uint r = distr(mersenne);
		glm::uint g = distr(mersenne);
		glm::uint b = distr(mersenne);
		glm::uint a = distr(mersenne);

		pixels[i * 4] = r;
		pixels[i * 4 + 1] = g;
		pixels[i * 4 + 2] = b;
		pixels[i * 4 + 3] = a;
	}

	Texture * t = new Texture();
	t->LoadFromRaw(pixels, length, length, TextureParameters(GL_LINEAR, GL_LINEAR, GL_REPEAT, GL_REPEAT));
	return t;
}
