using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Metaball : MonoBehaviour {
    public float radius = 1.0f;
	public float radiusSquared = 1.0f;
    private Rigidbody rigidbody;

	// Use this for initialization
	void Start () {
        rigidbody = this.GetComponent<Rigidbody>();
	}
	
	// Update is called once per frame
	void Update () {

	}

    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Wall"))
        {
            //reverse velocity
            rigidbody.AddForce(rigidbody.velocity * -2.0f, ForceMode.Impulse);

        }
    }

}
