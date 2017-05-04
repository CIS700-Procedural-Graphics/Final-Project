#include "texture.h"
#include "../engine.h"

Texture::Texture() : Asset(), textureID(-1), width(0), height(0)
{
}

Texture::~Texture()
{
	if(IsValid())
		glDeleteTextures(1, &textureID);
}

int Texture::GetWidth()
{
    return width;
}

int Texture::GetHeight()
{
    return height;
}

bool Texture::IsValid()
{
	return textureID != -1;
}

GLuint Texture::GetTextureID()
{
    return textureID;
}

void Texture::LoadFromRaw(const uint8_t * pixels, int width, int height, const TextureParameters & p)
{
	if (this->IsValid())
		return;

	this->width = width;
	this->height = height;

	glGenTextures(1, &textureID);
	glBindTexture(GL_TEXTURE_2D, textureID);

	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, p.minFilter);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, p.magFilter);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, p.wrapS);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, p.wrapT);

	glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_BGRA_EXT, GL_UNSIGNED_BYTE, pixels);

	if (p.minFilter == GL_LINEAR_MIPMAP_LINEAR)
		glGenerateMipmap(GL_TEXTURE_2D);

	glBindTexture(GL_TEXTURE_2D, 0);
}

void Texture::LoadFromRawFP(const float * pixels, int width, int height, const TextureParameters & p)
{
	if (this->IsValid())
		return;

	this->width = width;
	this->height = height;

	glGenTextures(1, &textureID);
	glBindTexture(GL_TEXTURE_2D, textureID);

	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, p.minFilter);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, p.magFilter);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, p.wrapS);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, p.wrapT);

	glTexImage2D(GL_TEXTURE_2D, 0, GL_R32F, width, height, 0, GL_RED, GL_FLOAT, pixels);

	if (p.minFilter == GL_LINEAR_MIPMAP_LINEAR)
		glGenerateMipmap(GL_TEXTURE_2D);

	glBindTexture(GL_TEXTURE_2D, 0);
}

void Texture::LoadFromFilename(const std::string& filename)
{
	LoadFromFilename(filename, TextureParameters());
}

void Texture::LoadFromFilename(const std::string & filename, const TextureParameters & p)
{
	sf::Image image;

	if (!image.loadFromFile(filename))
	{
		Engine::LogError("Could not load " + filename);
		return;
	}
		
	const uint8_t * pixels = image.getPixelsPtr();

    if (!pixels)
        return;

	LoadFromRaw(pixels, image.getSize().x, image.getSize().y, p);
}

RenderTexture::RenderTexture(int width, int height, bool stencil, TextureParameters p) : Texture(), stencil(stencil)
{
	this->width = width;
	this->height = height;
	this->parameters = p;
	this->framebufferID = -1;
	this->depthbufferID = -1;

	this->AddDrawBuffer(GL_COLOR_ATTACHMENT0);
}

RenderTexture::~RenderTexture()
{
	glDeleteFramebuffers(1, &framebufferID);
	glDeleteFramebuffers(1, &depthbufferID);
}

GLuint RenderTexture::GetFramebufferID()
{
	return framebufferID;
}

GLuint RenderTexture::GetDepthbufferID()
{
	return depthbufferID;
}

void RenderTexture::AddDrawBuffer(GLenum buffer)
{
	this->drawBuffers.push_back(buffer);
}

void RenderTexture::Load()
{
	// Texture generation
	glGenTextures(1, &textureID);
	glBindTexture(GL_TEXTURE_2D, textureID);
/*
	if(stencil)
		glTexImage2D(GL_TEXTURE_2D, 0, GL_DEPTH24_STENCIL8, width, height, 0, GL_DEPTH_STENCIL, GL_RGBA, NULL);
	else*/
		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA, GL_FLOAT, NULL);

	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, parameters.minFilter);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, parameters.magFilter);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, parameters.wrapS);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, parameters.wrapT);

	if (parameters.minFilter == GL_LINEAR_MIPMAP_LINEAR || parameters.minFilter == GL_LINEAR_MIPMAP_NEAREST || 
		parameters.minFilter == GL_NEAREST_MIPMAP_NEAREST || parameters.minFilter == GL_NEAREST_MIPMAP_LINEAR)
		glGenerateMipmap(GL_TEXTURE_2D);

	// FBO generation
	glGenFramebuffers(1, &framebufferID);
	glBindFramebuffer(GL_FRAMEBUFFER, framebufferID);

	// Depth buffer
	glGenRenderbuffers(1, &depthbufferID);
	glBindRenderbuffer(GL_RENDERBUFFER, depthbufferID);

	if (stencil)
	{
		glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH24_STENCIL8, width, height);
		glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, depthbufferID);
		glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT, GL_RENDERBUFFER, depthbufferID);
	}
	else
	{
		glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT, width, height);
		glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, depthbufferID);
	}

	glFramebufferTexture(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, textureID, 0);

	glDrawBuffers(this->drawBuffers.size(), this->drawBuffers.data());

	if (glCheckFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE)
		Engine::LogError("Framebuffer not complete!");

	glBindFramebuffer(GL_FRAMEBUFFER, 0);
	glBindTexture(GL_TEXTURE_2D, 0);
	glBindRenderbuffer(GL_RENDERBUFFER, 0);
}

void RenderTexture::GenerateMipmaps()
{
	if (parameters.minFilter == GL_LINEAR_MIPMAP_LINEAR || parameters.minFilter == GL_LINEAR_MIPMAP_NEAREST ||
		parameters.minFilter == GL_NEAREST_MIPMAP_NEAREST || parameters.minFilter == GL_NEAREST_MIPMAP_LINEAR)
	{
		glBindFramebuffer(GL_FRAMEBUFFER, framebufferID);
		glBindTexture(GL_TEXTURE_2D, textureID);
		glGenerateMipmap(GL_TEXTURE_2D);
		glBindFramebuffer(GL_FRAMEBUFFER, 0);
		glBindTexture(GL_TEXTURE_2D, 0);
	}
}

ReadableTexture::ReadableTexture() : Texture()
{
}

const uint8_t * ReadableTexture::GetRawPixels() const
{
	return pixels;
}

void ReadableTexture::LoadFromFilename(const std::string & filename, const TextureParameters & p)
{
	sf::Image image;

	if (!image.loadFromFile(filename))
	{
		Engine::LogError("Could not load " + filename);
		return;
	}

	const uint8_t * pixels = image.getPixelsPtr();

	if (!pixels)
		return;
	
	LoadFromRaw(pixels, image.getSize().x, image.getSize().y, p);

	int size = image.getSize().x * image.getSize().y;
	this->pixels = new uint8_t[size * 4];

	std::memcpy(this->pixels, pixels, size * sizeof(uint8_t) * 4);
}
