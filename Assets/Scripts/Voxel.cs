using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Voxel {

    public Vector3 position;
    public InspectPoint center, v1, v2, v3, v4, v5, v6, v7, v8;
    public float width = 1f;

    public Voxel(Vector3 pos, float cellWidth)
    {
        this.position = pos;
        this.width = cellWidth;
        makeInspectPoints();
    }

    void makeInspectPoints()
    {
        float halfGridCellWidth = width / 2f;

        float x = this.position.x;
        float y = this.position.y;
        float z = this.position.z;
        this.center = new InspectPoint(x, y, z);

        float v1x = x - halfGridCellWidth;
        float v1y = y + halfGridCellWidth;
        float v1z = z - halfGridCellWidth;
        this.v1 = new InspectPoint(v1x, v1y, v1z);

        float v2x = v1x;
        float v2y = v1y;
        float v2z = z + halfGridCellWidth;
        this.v2 = new InspectPoint(v2x, v2y, v2z);

        float v3x = x + halfGridCellWidth;
        float v3y = v2y;
        float v3z = v2z;
        this.v3 = new InspectPoint(v3x, v3y, v3z);

        float v4x = v3x;
        float v4y = v3y;
        float v4z = v1z;
        this.v4 = new InspectPoint(v4x, v4y, v4z);

        float v5x = v1x;
        float v5y = y - halfGridCellWidth;
        float v5z = v1z;
        this.v5 = new InspectPoint(v5x, v5y, v5z);

        float v6x = v5x;
        float v6y = v5y;
        float v6z = v2z;
        this.v6 = new InspectPoint(v6x, v6y, v6z);

        float v7x = v3x;
        float v7y = v6y;
        float v7z = v6z;
        this.v7 = new InspectPoint(v7x, v7y, v7z);

        float v8x = v7x;
        float v8y = v7y;
        float v8z = v4z;
        this.v8 = new InspectPoint(v8x, v8y, v8z);
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
            return vertA.position;
        if (Mathf.Abs(isolevel - vertB.isovalue) < 0.00001)
            return vertB.position;
        if (Mathf.Abs(vertA.isovalue - vertB.isovalue) < 0.00001)
            return vertA.position;

        mu = (isolevel - vertA.isovalue) / (vertB.isovalue - vertA.isovalue);

        lerpPos.x = vertA.position.x + mu *
            (vertB.position.x - vertA.position.x);

        lerpPos.y = vertA.position.y + mu *
            (vertB.position.y - vertA.position.y);

        lerpPos.z = vertA.position.z + mu *
            (vertB.position.z - vertA.position.z);

        return lerpPos;
    }
}
