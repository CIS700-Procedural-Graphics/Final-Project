using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InspectPoint {

    public Vector3 position;
    public float isovalue = 0f;

    public InspectPoint(float x, float y, float z)
    {
        this.position = new Vector3(x, y, z);
    }
}
