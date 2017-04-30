using UnityEngine;
using UnityEditor;
using System.Collections.Generic;

public class CacheMetaballs
{
    public static List<Vector3>[] frameVertices;
    public static List<Vector3>[] frameNormals;

    static CacheMetaballs()
    {
        Debug.Log("Up and running");
        //Cache("metaballSim.txt");

    }

    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
    static void OnBeforeSceneLoadRuntimeMethod()
    {
        Debug.Log("ONCE");
        string filePath = "metaballSim.txt";
        string[] lines = System.IO.File.ReadAllLines(filePath);
        if(lines.Length < 1)
        {
            Debug.Log("CACHE FAILED");
            return;
        }

        Debug.Log(lines.Length);
        //array of lists of vertices, 
        //each list contains vertices for a single frame
        frameVertices = new List<Vector3>[lines.Length];
        frameNormals = new List<Vector3>[lines.Length];


        for (int i = 0; i < lines.Length; i++) //for each line make a new list of vertices
        {
            frameVertices[i] = new List<Vector3>();
            frameNormals[i] = new List<Vector3>();

            string[] posValStrings = lines[i].Split(' ');
            int vertexCount = 0;

            for (int c = 0; c < posValStrings.Length - 3; c += 3) //parse each float
            {
                Vector3 meshVertex = new Vector3(
                    float.Parse(posValStrings[c]),
                    float.Parse(posValStrings[c + 1]),
                    float.Parse(posValStrings[c + 2])
                );

                frameVertices[i].Add(meshVertex);

                vertexCount++;

                //normal calculation
                if (vertexCount % 3 == 0) //for every 3 vertices (triangle) calc normals
                {
                    Vector3 triV2 = frameVertices[i][vertexCount - 1];
                    Vector3 triV1 = frameVertices[i][vertexCount - 2];
                    Vector3 triV0 = frameVertices[i][vertexCount - 3];

                    Vector3 e1 = triV1 - triV0;
                    Vector3 e2 = triV2 - triV1;

                    Vector3 normal = Vector3.Cross(e1, e2);
                    frameNormals[i].Add(normal);
                    frameNormals[i].Add(normal);
                    frameNormals[i].Add(normal);

                }
            }
        }

        Debug.Log("CACHED");

    }
}
