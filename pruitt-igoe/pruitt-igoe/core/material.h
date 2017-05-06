#ifndef MATERIAL_H
#define MATERIAL_H

#include "../common.h"
#include <unordered_map>

class Mesh;
class Shader;
class Texture;

class ShaderListener
{
public:
	virtual void OnShaderReloaded() = 0;
};

class Material : public ShaderListener
{
public:
    enum RenderingQueue
    {
        Background = 1000,
        Geometry = 2000,
        Transparent = 3000,
        PostProcess = 4000,
        Overlay = 5000
    };

    struct BlendOperation
    {
        GLenum source;
        GLenum destination;
        BlendOperation(GLenum source, GLenum destination) : source(source), destination(destination){}
    };

	struct StencilOperation
	{
		GLuint mask;
		GLenum operation;
		GLenum pass;
		GLenum fail;
		GLenum zFail;
	};

    Material(Shader * shader);
    Material(std::string shader);

    Shader * GetShader();
	void Reload();

    void Render(Mesh * mesh, const glm::mat4& viewProj, const glm::vec4& cameraParameters, const glm::mat4 &localToWorld, const glm::mat4 &worldToLocal, const glm::mat4 &invTranspose, float currentTime);

    void SetInt(std::string name, int i);
    void SetFloat(std::string name, float f);
    void SetVector(std::string name, const glm::vec4& v);
    void SetColor(std::string name, const glm::vec4& v);
    void SetMatrix(std::string name, const glm::mat4& m);
    void SetMatrixArray(std::string name, glm::mat4 *m, int size);

    void SetTexture(std::string name, Texture* texture);
    void SetCubeTexture(std::string name, GLuint i);
    void SetOverrideDrawingMode(GLenum mode);

    void SetFeature(GLenum id, bool value);
    bool GetFeature(GLenum id);

    void SetBlendOperation(BlendOperation op);
	void SetStencilOperation(StencilOperation op);

	void SetDepthWrite(bool write);

    void SetRenderingQueue(RenderingQueue queue);
    RenderingQueue GetRenderingQueue();

    float GetFloat(std::string name);
    glm::vec4 GetVector(std::string name);
    glm::mat4 GetMatrix(std::string name);

    static bool Compare(const Material& lhs, const Material& rhs);

protected:
	template <typename T>
	struct MaterialUniform
	{
	public:
		int id;
		int size; // In case of array, break glass
		bool perObjectUniform;
		T value;
	};

	BlendOperation blendOperation;
	StencilOperation stencilOperation;
	int overrideDrawingMode;
	RenderingQueue queue;
	Shader * shader;
	bool depthWrite;

	// Mainly for blending, depth testing, etc...
	std::unordered_map<GLenum, bool> featureMap;
	typedef std::unordered_map<GLenum, bool>::iterator FeatureIterator;

	typedef std::unordered_map<std::string, MaterialUniform<int>>::iterator IntUniformIterator;
	typedef std::unordered_map<std::string, MaterialUniform<float>>::iterator FloatUniformIterator;
	typedef std::unordered_map<std::string, MaterialUniform<glm::vec4>>::iterator VectorUniformIterator;
	typedef std::unordered_map<std::string, MaterialUniform<glm::mat4>>::iterator MatrixUniformIterator;
	typedef std::unordered_map<std::string, MaterialUniform<glm::mat4*>>::iterator MatrixArrayUniformIterator;

	typedef std::unordered_map<std::string, MaterialUniform<Texture*>>::iterator TextureUniformIterator;
	typedef std::unordered_map<std::string, MaterialUniform<GLuint>>::iterator cubetextureUniformIterator;

	std::unordered_map<std::string, MaterialUniform<int>> intUniforms;
	std::unordered_map<std::string, MaterialUniform<float>> floatUniforms;
	std::unordered_map<std::string, MaterialUniform<glm::vec4>> vectorUniforms;
	std::unordered_map<std::string, MaterialUniform<glm::mat4>> matrixUniforms;
	std::unordered_map<std::string, MaterialUniform<glm::mat4*>> matrixArrayUniforms;

	std::unordered_map<std::string, MaterialUniform<Texture*>> textureUniforms;
	std::unordered_map<std::string, MaterialUniform<GLuint>> cubetextureUniforms;

	void PrepareCoreUniforms();
	const std::string GetUniformName(std::string baseName);

	// Helper functions
	template<typename T> T GetUniformValue(std::string name, std::unordered_map<std::string, MaterialUniform<T>>& map);
	template<typename T> void ReloadUniformValue(std::string name, std::unordered_map<std::string, MaterialUniform<T>>& map);
	template<typename T> void SetUniformValue(std::string name, std::unordered_map<std::string, MaterialUniform<T>>& map, const T& value, bool perObjectUniform, int size);

	virtual void OnShaderReloaded();
};


#endif // MATERIAL_H
