using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class VoxelGO : MonoBehaviour {

    public InspectPoint center, v1, v2, v3, v4, v5, v6, v7, v8;
    private Material mat;
    private Color col;
	// Use this for initialization
	void Start () {

        makeInspectPoints();
        mat = new Material(Shader.Find("Transparent/Diffuse"));
        col = Color.green;
        col.a = 0.0f;
        mat.color = col;
        this.GetComponent<Renderer>().material = mat;
        this.enabled = false;
    
    }

    public void show()
    {
        col.a = 0.80f;
        mat.color = col;
    }

    public void hide()
    {
        col.a = 0f;
        mat.color = col;
    }

    void makeInspectPoints()
    {
        float halfGridCellWidth = 0.5f;

        GameObject centerInspect = Instantiate(Resources.Load("InspectPoint")) as GameObject;
        centerInspect.transform.parent = this.gameObject.transform;
        float x = 0.0f;
        float y = 0.0f;
        float z = 0.0f;
        centerInspect.transform.localPosition = new Vector3(x,y,z);
        this.center = centerInspect.GetComponent<InspectPoint>();

        GameObject v1Inspect = Instantiate(Resources.Load("InspectPoint")) as GameObject;
        v1Inspect.transform.parent = this.gameObject.transform;
        float v1x = x - halfGridCellWidth;
        float v1y = x + halfGridCellWidth;
        float v1z = x - halfGridCellWidth;
        v1Inspect.transform.localPosition = new Vector3(v1x, v1y, v1z);
        this.v1 = v1Inspect.GetComponent<InspectPoint>();

        GameObject v2Inspect = Instantiate(Resources.Load("InspectPoint")) as GameObject;
        v2Inspect.transform.parent = this.gameObject.transform;
        float v2x = v1x;
        float v2y = v1y;
        float v2z = x + halfGridCellWidth;
        v2Inspect.transform.localPosition = new Vector3(v2x, v2y, v2z);
        this.v2 = v2Inspect.GetComponent<InspectPoint>();

        GameObject v3Inspect = Instantiate(Resources.Load("InspectPoint")) as GameObject;
        v3Inspect.transform.parent = this.gameObject.transform;
        float v3x = x + halfGridCellWidth;
        float v3y = v2y;
        float v3z = v2z;
        v3Inspect.transform.localPosition = new Vector3(v3x, v3y, v3z);
        this.v3 = v3Inspect.GetComponent<InspectPoint>();

        GameObject v4Inspect = Instantiate(Resources.Load("InspectPoint")) as GameObject;
        v4Inspect.transform.parent = this.gameObject.transform;
        float v4x = v3x;
        float v4y = v3y;
        float v4z = v1z;
        v4Inspect.transform.localPosition = new Vector3(v4x, v4y, v4z);
        this.v4 = v4Inspect.GetComponent<InspectPoint>();

        GameObject v5Inspect = Instantiate(Resources.Load("InspectPoint")) as GameObject;
        v5Inspect.transform.parent = this.gameObject.transform;
        float v5x = v1x;
        float v5y = y - halfGridCellWidth;
        float v5z = v1z;
        v5Inspect.transform.localPosition = new Vector3(v5x, v5y, v5z);
        this.v5 = v5Inspect.GetComponent<InspectPoint>();

        GameObject v6Inspect = Instantiate(Resources.Load("InspectPoint")) as GameObject;
        v6Inspect.transform.parent = this.gameObject.transform;
        float v6x = v5x;
        float v6y = v5y;
        float v6z = v2z;
        v6Inspect.transform.localPosition = new Vector3(v6x, v6y, v6z);
        this.v6 = v6Inspect.GetComponent<InspectPoint>();

        GameObject v7Inspect = Instantiate(Resources.Load("InspectPoint")) as GameObject;
        v7Inspect.transform.parent = this.gameObject.transform;
        float v7x = v3x;
        float v7y = v6y;
        float v7z = v6z;
        v7Inspect.transform.localPosition = new Vector3(v7x, v7y, v7z);
        this.v7 = v7Inspect.GetComponent<InspectPoint>();

        GameObject v8Inspect = Instantiate(Resources.Load("InspectPoint")) as GameObject;
        v8Inspect.transform.parent = this.gameObject.transform;
        float v8x = v7x;
        float v8y = v7y;
        float v8z = v4z;
        v8Inspect.transform.localPosition = new Vector3(v8x, v8y, v8z);
        this.v8 = v8Inspect.GetComponent<InspectPoint>();

        if (this.GetComponent<Renderer>().enabled)//if we're debugging show them
        {
            this.center.GetComponent<MeshRenderer>().enabled = true;
            this.v1.GetComponent<MeshRenderer>().enabled = true;
            this.v2.GetComponent<MeshRenderer>().enabled = true;
            this.v3.GetComponent<MeshRenderer>().enabled = true;
            this.v4.GetComponent<MeshRenderer>().enabled = true;
            this.v5.GetComponent<MeshRenderer>().enabled = true;
            this.v6.GetComponent<MeshRenderer>().enabled = true;
            this.v7.GetComponent<MeshRenderer>().enabled = true;
            this.v8.GetComponent<MeshRenderer>().enabled = true;

        }
    }

    public Dictionary<string, List<Vector3>> polygonize(float isolevel)
    {
        //List<Vector3> vertexList = new List<Vector3>();//use to lookup voxel vertex positions
        Vector3[] vertexList = new Vector3[12];
        List<Vector3> normalList = new List<Vector3>();//use to lookup voxel vertex normals
        Dictionary<string, List<Vector3>> polyMap = new Dictionary<string, List<Vector3>>();
        polyMap["vertPositions"] = new List<Vector3>();
        polyMap["vertNormals"] = new List<Vector3>();

        /*
           Determine the index into the edge table which
           tells us which vertices are inside of the surface
        */
        int cubeindex = 0;

        var v0 = this.v6;
        var v1 = this.v7;
        var v2 = this.v8;
        var v3 = this.v5;
        var v4 = this.v2;
        var v5 = this.v3;
        var v6 = this.v4;
        var v7 = this.v1;

        if (v0.isovalue < isolevel) cubeindex |= 1;
        if (v1.isovalue < isolevel) cubeindex |= 2;
        if (v2.isovalue < isolevel) cubeindex |= 4;
        if (v3.isovalue < isolevel) cubeindex |= 8;
        if (v4.isovalue < isolevel) cubeindex |= 16;
        if (v5.isovalue < isolevel) cubeindex |= 32;
        if (v6.isovalue < isolevel) cubeindex |= 64;
        if (v7.isovalue < isolevel) cubeindex |= 128;

        //Debug.Log("Cube Index = " + cubeindex);

        /* Cube is entirely in/out of the surface */
        if (LUT.EDGE_TABLE[cubeindex] == 0)
            return polyMap; //returns empty map

        /* Find the vertices where the surface intersects the cube */
        if ((LUT.EDGE_TABLE[cubeindex] & 1) != 0)
        {
            vertexList[0] =
               this.vertexInterpolation(isolevel, v0, v1);
        }

        if ((LUT.EDGE_TABLE[cubeindex] & 2) != 0)
        {
            vertexList[1] =
                 this.vertexInterpolation(isolevel, v1, v2);
        }

        if ((LUT.EDGE_TABLE[cubeindex] & 4) != 0)
        {
            vertexList[2] =
               this.vertexInterpolation(isolevel, v2, v3);
        }

        if ((LUT.EDGE_TABLE[cubeindex] & 8) != 0)
        {
            vertexList[3] =
               this.vertexInterpolation(isolevel, v3, v0);
        }

        if ((LUT.EDGE_TABLE[cubeindex] & 16) != 0)
        {
            vertexList[4] =
               this.vertexInterpolation(isolevel, v4, v5);
        }

        if ((LUT.EDGE_TABLE[cubeindex] & 32) != 0)
        {
            vertexList[5] =
               this.vertexInterpolation(isolevel, v5, v6);
        }

        if ((LUT.EDGE_TABLE[cubeindex] & 64) != 0)
        {
            vertexList[6] =
               this.vertexInterpolation(isolevel, v6, v7);
        }

        if ((LUT.EDGE_TABLE[cubeindex] & 128) != 0)
        {
            vertexList[7] =
               this.vertexInterpolation(isolevel, v7, v4);
        }
        if ((LUT.EDGE_TABLE[cubeindex] & 256) != 0)
        {
            vertexList[8] =
               this.vertexInterpolation(isolevel, v0, v4);
        }

        if ((LUT.EDGE_TABLE[cubeindex] & 512) != 0)
        {
            vertexList[9] =
               this.vertexInterpolation(isolevel, v1, v5);
        }

        if ((LUT.EDGE_TABLE[cubeindex] & 1024) != 0)
        {
            vertexList[10] =
               this.vertexInterpolation(isolevel, v2, v6);
        }

        if ((LUT.EDGE_TABLE[cubeindex] & 2048) != 0)
        {
            vertexList[11] =
               this.vertexInterpolation(isolevel, v3, v7);
        }



        List<Vector3> vertPositions = new List<Vector3>();
        List<Vector3> vertNormals = new List<Vector3>();

        //Create triangles
        for (int i = 0; LUT.TRI_TABLE[cubeindex * 16 + i] != -1; i += 3)
        {            
            var triV0 = vertexList[LUT.TRI_TABLE[cubeindex * 16 + i]];
            var triV1 = vertexList[LUT.TRI_TABLE[cubeindex * 16 + i + 1]];
            var triV2 = vertexList[LUT.TRI_TABLE[cubeindex * 16 + i + 2]];
            vertPositions.Add(triV0);
            vertPositions.Add(triV1);
            vertPositions.Add(triV2);
        }

        polyMap["vertPositions"] = vertPositions;
        polyMap["vertNormals"] = vertNormals;

        return polyMap;

    }

    Vector3 vertexInterpolation(float isolevel, InspectPoint vertA, InspectPoint vertB)
    {
        float mu;
        Vector3 lerpPos = new Vector3();

        if (Mathf.Abs(isolevel - vertA.isovalue) < 0.00001)
            return vertA.gameObject.transform.position;
        if (Mathf.Abs(isolevel - vertB.isovalue) < 0.00001)
            return vertB.gameObject.transform.position;
        if (Mathf.Abs(vertA.isovalue - vertB.isovalue) < 0.00001)
            return vertA.gameObject.transform.position;

        mu = (isolevel - vertA.isovalue) / (vertB.isovalue - vertA.isovalue);

        lerpPos.x = vertA.gameObject.transform.position.x + mu * 
            (vertB.gameObject.transform.position.x - vertA.gameObject.transform.position.x);

        lerpPos.y = vertA.gameObject.transform.position.y + mu * 
            (vertB.gameObject.transform.position.y - vertA.gameObject.transform.position.y);

        lerpPos.z = vertA.gameObject.transform.position.z + mu * 
            (vertB.gameObject.transform.position.z - vertA.gameObject.transform.position.z);

        return lerpPos;
    }
}
