#ifndef TEXTURE_H
#define TEXTURE_H

#include "../../common.h"
#include "asset.h"

struct TextureParameters
{
	GLint minFilter;
	GLint magFilter;
	GLint wrapS;
	GLint wrapT;

	TextureParameters() : minFilter(GL_LINEAR), magFilter(GL_LINEAR), wrapS(GL_REPEAT), wrapT(GL_REPEAT) {}
	TextureParameters(GLint minFilter, GLint magFilter, GLint wrapS, GLint wrapT) : minFilter(minFilter), magFilter(magFilter), wrapS(wrapS), wrapT(wrapT) {}
};

class Texture : public Asset
{
public:
    Texture();
    virtual ~Texture();

    int GetWidth();
    int GetHeight();
	bool IsValid();

    GLuint GetTextureID();

	void LoadFromRaw(const uint8_t * pixels, int width, int height, const TextureParameters& p);
	void LoadFromRawFP(const float * pixels, int width, int height, const TextureParameters& p);

    virtual void LoadFromFilename(const std::string& filename);
	virtual void LoadFromFilename(const std::string& filename, const TextureParameters& p);

protected:
	int width;
	int height;
	GLuint textureID;
	TextureParameters parameters;
};

class ReadableTexture : public Texture
{
public: 
	ReadableTexture();

	const uint8_t * GetRawPixels() const;
	virtual void LoadFromFilename(const std::string& filename, const TextureParameters& p);

protected:
	uint8_t * pixels;
};

class RenderTexture : public Texture
{
public:
	RenderTexture(int width, int height, bool stencil, TextureParameters p);
	virtual ~RenderTexture();

	GLuint GetFramebufferID();
	GLuint GetDepthbufferID();

	void AddDrawBuffer(GLenum buffer);
	void Load();
	void GenerateMipmaps();

protected:
	GLuint framebufferID;
	GLuint depthbufferID;
	std::vector<GLenum> drawBuffers;
	bool stencil;
};

#endif // TEXTURE_H
