using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InspectPoint : MonoBehaviour {

    public float isovalue = 0f;
    private MeshRenderer textRenderer;

	// Use this for initialization
	void Start () {
        textRenderer = this.GetComponent<MeshRenderer>();
        this.gameObject.isStatic = true;
        this.enabled = false;
	}
	
	// Update is called once per frame
	//void Update () {
 //       //if (textRenderer.enabled)
 //       //{
 //       //    this.GetComponent<TextMesh>().text = isovalue.ToString();
 //       //}
 //   }
}
