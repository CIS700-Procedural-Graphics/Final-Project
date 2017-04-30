using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DeformationController : MonoBehaviour {

    public Material metaballMat;

	// Update is called once per frame
	void Update () {
        metaballMat.SetVector("_InfluencePoint", this.transform.position);
        metaballMat.SetFloat("_Time", Time.timeSinceLevelLoad);
    }

    void OnCollisionEnter(Collision collision)
    {
        Debug.Log("Collision");
    }
}
