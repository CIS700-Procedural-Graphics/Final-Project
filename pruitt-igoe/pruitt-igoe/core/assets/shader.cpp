#include "shader.h"
#include "mesh.h"
#include "texture.h"
#include "../material.h"
#include <iostream>
#include <fstream>
#include <regex>
#include "../engine.h"

const std::string SHADER_BASE_DIRECTORY = "./glsl/";
const std::string SHADER_LIBRARY_DIRECTORY = "./glsl/library/";

Shader::Shader() : Asset(), shaderName(""),
    prog(-1), attrPos(-1), attrNor(-1), attrCol(-1), attrUV(-1), loaded(false), lastChecksum(-1)
{
    vertexFilename = "";
    fragmentFilename = "";
}

Shader::~Shader()
{
	Destroy();
}

void Shader::LoadFromFilename(std::string filename)
{
    shaderName = filename;
    vertexFilename = SHADER_BASE_DIRECTORY + shaderName + ".vert.glsl";
    fragmentFilename = SHADER_BASE_DIRECTORY + shaderName + ".frag.glsl";
}

void Shader::Destroy()
{
	if (prog != -1)
		glDeleteProgram(prog);
}

void Shader::Reload()
{
	// It hasn't been loaded yet...
	if (!loaded)
		return;

	Engine::LogInfo("Reloading " + vertexFilename);
	Engine::LogInfo("Reloading " + fragmentFilename);

	GLuint vertShader = glCreateShader(GL_VERTEX_SHADER);
	GLuint fragShader = glCreateShader(GL_FRAGMENT_SHADER);

	std::string vertexSource = ReadFile(vertexFilename);
	std::string fragmentSource = ReadFile(fragmentFilename);
	
	const char * vertSource = vertexSource.c_str();
	const char * fragSource = fragmentSource.c_str();

	// Send the shader text to OpenGL and store it in the shaders specified by the handles vertShader and fragShader
	glShaderSource(vertShader, 1, &vertSource, 0);
	glShaderSource(fragShader, 1, &fragSource, 0);

	// Tell OpenGL to compile the shader text stored above
	glCompileShader(vertShader);
	glCompileShader(fragShader);

	// Check if everything compiled OK
	GLint compiled;

	glGetShaderiv(vertShader, GL_COMPILE_STATUS, &compiled);
	if (!compiled)
		PrintShaderInfoLog(vertShader);

	glGetShaderiv(fragShader, GL_COMPILE_STATUS, &compiled);
	if (!compiled)
		PrintShaderInfoLog(fragShader);

	// Tell prog that it manages these particular vertex and fragment shaders
	glAttachShader(prog, vertShader);
	glAttachShader(prog, fragShader);
	glLinkProgram(prog);

	// Check for linking success
	GLint linked;
	glGetProgramiv(prog, GL_LINK_STATUS, &linked);

	if (!linked)
		PrintShaderInfoLog(prog);

	glDetachShader(prog, vertShader);
	glDetachShader(prog, fragShader);

	glDeleteShader(vertShader);
	glDeleteShader(fragShader);

	attrPos = glGetAttribLocation(prog, "vertexPosition");
	attrNor = glGetAttribLocation(prog, "vertexNormal");
	attrCol = glGetAttribLocation(prog, "vertexColor");
	attrUV = glGetAttribLocation(prog, "vertexUV");

	DispatchReloadEvent();
}

bool Shader::ShouldReload()
{
	if (lastChecksum == -1)
		return false;

	int vertChecksum = GetFileChecksum(vertexFilename);
	int fragChecksum = GetFileChecksum(fragmentFilename);

	int sum = vertChecksum + fragChecksum;

	if (sum != lastChecksum)
	{
		lastChecksum = sum;
		return true;
	}

	return false;
}

void Shader::Upload()
{    
    if(loaded)
        return;

    Engine::LogInfo("Loading " + vertexFilename);
    Engine::LogInfo("Loading " + fragmentFilename);
	
	GLuint vertShader = glCreateShader(GL_VERTEX_SHADER);
	GLuint fragShader = glCreateShader(GL_FRAGMENT_SHADER);
    prog = glCreateProgram();

	std::string vertexSource = ReadFile(vertexFilename);
	std::string fragmentSource = ReadFile(fragmentFilename);

	int vertChecksum = GetFileChecksum(vertexFilename);
	int fragChecksum = GetFileChecksum(fragmentFilename);

	lastChecksum = vertChecksum + fragChecksum;

	//Engine::LogVerbose("VERTEX SHADER: \n" + vertexSource);
	//Engine::LogVerbose("FRAGMENT SHADER: \n" + fragmentSource);

	const char * vertSource = vertexSource.c_str();
	const char * fragSource = fragmentSource.c_str();

    // Send the shader text to OpenGL and store it in the shaders specified by the handles vertShader and fragShader
    glShaderSource(vertShader, 1, &vertSource, 0);
    glShaderSource(fragShader, 1, &fragSource, 0);

    // Tell OpenGL to compile the shader text stored above
    glCompileShader(vertShader);
    glCompileShader(fragShader);

    // Check if everything compiled OK
    GLint compiled;

    glGetShaderiv(vertShader, GL_COMPILE_STATUS, &compiled);
    if (!compiled)
		PrintShaderInfoLog(vertShader);

    glGetShaderiv(fragShader, GL_COMPILE_STATUS, &compiled);
    if (!compiled)
		PrintShaderInfoLog(fragShader);

    // Tell prog that it manages these particular vertex and fragment shaders
    glAttachShader(prog, vertShader);
    glAttachShader(prog, fragShader);
    glLinkProgram(prog);

    // Check for linking success
    GLint linked;
    glGetProgramiv(prog, GL_LINK_STATUS, &linked);

    if (!linked)
		PrintShaderInfoLog(prog);

	glDetachShader(prog, vertShader);
	glDetachShader(prog, fragShader);

	glDeleteShader(vertShader);
	glDeleteShader(fragShader);

    attrPos = glGetAttribLocation(prog, "vertexPosition");
    attrNor = glGetAttribLocation(prog, "vertexNormal");
    attrCol = glGetAttribLocation(prog, "vertexColor");
    attrUV = glGetAttribLocation(prog, "vertexUV");

    loaded = true;
}

void Shader::Bind()
{
	glUseProgram(prog);
}

void Shader::Render(Mesh *mesh, GLenum drawMode)
{
    Bind();
	
    if(mesh->IsInterleaved())
    {
        if(mesh->BindInterleaved())
        {
            if (attrPos != -1)
            {
                glEnableVertexAttribArray(attrPos);
                glVertexAttribPointer(attrPos, 4, GL_FLOAT, false, sizeof(Vertex), 0);
            }

            if (attrNor != -1)
            {
                glEnableVertexAttribArray(attrNor);
                glVertexAttribPointer(attrNor, 4, GL_FLOAT, false, sizeof(Vertex), (void*)(sizeof(glm::vec4)));
            }

            if (attrCol != -1)
            {
                glEnableVertexAttribArray(attrCol);
                glVertexAttribPointer(attrCol, 4, GL_FLOAT, false, sizeof(Vertex), (void*)(2 * sizeof(glm::vec4)));
            }

            if (attrUV != -1)
            {
                glEnableVertexAttribArray(attrUV);
                glVertexAttribPointer(attrUV, 2, GL_FLOAT, false, sizeof(Vertex), (void*)(3 * sizeof(glm::vec4)));
            }
        }
    }
    else
    {
        if (attrPos != -1 && mesh->BindVertices()) {
            glEnableVertexAttribArray(attrPos);
            glVertexAttribPointer(attrPos, 4, GL_FLOAT, false, 0, NULL);
        }

        if (attrNor != -1 && mesh->BindNormals()) {
            glEnableVertexAttribArray(attrNor);
            glVertexAttribPointer(attrNor, 4, GL_FLOAT, false, 0, NULL);
        }

        if (attrCol != -1 && mesh->BindColors()) {
            glEnableVertexAttribArray(attrCol);
            glVertexAttribPointer(attrCol, 4, GL_FLOAT, false, 0, NULL);
        }

        if (attrUV != -1 && mesh->BindUVs()) {
            glEnableVertexAttribArray(attrUV);
            glVertexAttribPointer(attrUV, 2, GL_FLOAT, false, 0, NULL);
        }
    }

    // Bind the index buffer and then draw shapes from it.
    // This invokes the shader program, which accesses the vertex buffers.
    mesh->BindIndices();
    glDrawElements(drawMode, mesh->GetIndicesCount(), GL_UNSIGNED_INT, 0);

    glDisableVertexAttribArray(attrPos);
    if (attrNor != -1) glDisableVertexAttribArray(attrNor);
    if (attrCol != -1) glDisableVertexAttribArray(attrCol);
    if (attrUV != -1) glDisableVertexAttribArray(attrUV);
}

void Shader::AddListener(ShaderListener * l)
{
	this->listeners.push_back(l);
}

int Shader::GetFileChecksum(const std::string & filename)
{
	std::ifstream in(filename, std::ios::in);

	if (in)
	{
		std::string contents;
		in.seekg(0, std::ios::end);
		contents.resize(in.tellg());
		in.seekg(0, std::ios::beg);
		in.read(&contents[0], contents.size());
		in.close();

		int sum = 0;

		for (int i = 0; i < contents.size(); i++)
			sum += contents.data()[i];
		
		return sum;
	}

	return 0;
}

std::string Shader::ReadFile(const std::string& filename, std::unordered_map<std::string, bool> map)
{
	std::ifstream in(filename, std::ios::in);
	
	if (in)
	{
		// Prevent circular references
		if (map.find(filename) != map.end())
		{
			std::cerr << "Circular reference while parsing include " << filename << ". Ignoring include... " <<  std::endl;
			return "";
		}

		map[filename] = true;
		std::string contents;
		std::string line;
		
		std::regex word_regex("#include <[aA-zZ]+>");

		int includeCharLength = std::string("#include <").size();

		while (!in.eof())
		{
			std::getline(in, line);

			auto words_begin = std::sregex_iterator(line.begin(), line.end(), word_regex);
			auto words_end = std::sregex_iterator();

			int distance = std::distance(words_begin, words_end);

			// We found a match
			if (distance == 1)
			{
				std::string library = line.substr(includeCharLength, line.size() - includeCharLength - 1);
				library = SHADER_LIBRARY_DIRECTORY + library + ".glsl";
				contents += ReadFile(library, map);
			}
			else
			{
				contents += line + '\n';
			}
		}

		in.close();
		return(contents);
	}

	std::cerr << "Could not find " << filename << std::endl;
	return "";
}

std::string Shader::GetName()
{
    return shaderName;
}

void Shader::PrintShaderInfoLog(int shader)
{
    int infoLogLen = 0;
    int charsWritten = 0;
    GLchar * infoLog;

    glGetShaderiv(shader, GL_INFO_LOG_LENGTH, &infoLogLen);

    if (infoLogLen > 0)
    {
        infoLog = new GLchar[infoLogLen + 1];
        glGetShaderInfoLog(shader, infoLogLen, &charsWritten, infoLog);
        std::cout << "ShaderInfoLog:" << std::endl << infoLog << std::endl;
        delete [] infoLog;
    }
}

void Shader::DispatchReloadEvent()
{
	for (int i = 0; i < listeners.size(); i++)
		listeners[i]->OnShaderReloaded();
}

int Shader::GetUniformLocation(const char *uniform)
{
    Bind();

    return glGetUniformLocation(prog, uniform);
}

void Shader::SetIntUniform(int uniform, int value)
{
    Bind();

    if(uniform != -1)
        glUniform1i(uniform, value);
}

void Shader::SetFloatUniform(int uniform, float value)
{
    Bind();

    if(uniform != -1)
        glUniform1f(uniform, value);
}

void Shader::SetTextureUniform(int uniform, GLuint value, int textureUnit)
{
    Bind();

    if(uniform != -1)
    {	
		GLenum activeTexture = GL_TEXTURE0 + textureUnit;

		glUniform1i(uniform, textureUnit);
        glActiveTexture(activeTexture);
        glBindTexture(GL_TEXTURE_2D, value);
    }
}

void Shader::SetMatrixUniform(int uniform, const glm::mat4 &matrix)
{
        Bind();

        if(uniform != -1)
            glUniformMatrix4fv(uniform, 1, GL_FALSE, &matrix[0][0]);
}

void Shader::SetMatrixArrayUniform(int uniform, glm::mat4 *matrix, int size)
{
    Bind();

    if(uniform != -1)
        glUniformMatrix4fv(uniform, size, GL_FALSE, &(matrix[0])[0][0]);
}

void Shader::SetVectorUniform(int uniform, const glm::vec4 &v)
{
    Bind();

    if(uniform != -1)
        glUniform4fv(uniform, 1, &v[0]);
}

void Shader::SetIVectorUniform(int uniform, const glm::ivec4 &v)
{
    Bind();

    if(uniform != -1)
        glUniform4iv(uniform, 1, &v[0]);
}