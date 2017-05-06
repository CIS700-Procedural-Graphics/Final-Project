#ifndef SHADER_H
#define SHADER_H

#include "../../common.h"
#include "asset.h"
#include <vector>
#include <unordered_map>

class Mesh;
class ShaderListener;

class Shader: public Asset
{
public:
    Shader();
    ~Shader();

	void LoadFromFilename(std::string filename);
	std::string GetName();

	void Destroy();

	void Reload();
	bool ShouldReload();

    void Upload();
    void Bind();
    void Render(Mesh * mesh, GLenum drawMode);

	void AddListener(ShaderListener * l);

    void SetIntUniform(int uniform, int value);
    void SetFloatUniform(int uniform, float value);
    void SetMatrixUniform(int uniform, const glm::mat4& matrix);
    void SetMatrixArrayUniform(int uniform, glm::mat4* matrix, int size);
    void SetVectorUniform(int uniform, const glm::vec4& v);
    void SetIVectorUniform(int uniform, const glm::ivec4 &v);
    void SetTextureUniform(int uniform, GLuint value, int textureUnit);

	int GetUniformLocation(const char *uniform);

protected:
	int GetFileChecksum(const std::string& filename);
	std::string ReadFile(const std::string& filename, std::unordered_map<std::string, bool> map = std::unordered_map<std::string, bool>());
	void PrintShaderInfoLog(int shader);

	void DispatchReloadEvent();
	
private:
	std::string shaderName;
	std::string vertexFilename;
	std::string fragmentFilename;

	GLuint prog;

	int attrPos;
	int attrNor;
	int attrCol;
	int attrUV;

	bool loaded;
	int lastChecksum;

	std::vector<ShaderListener *> listeners;
};

#endif // SHADER_H
