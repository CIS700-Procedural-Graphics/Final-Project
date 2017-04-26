using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Metaball : MonoBehaviour {
    public float radius = 1.0f;
	public float radiusSquared = 1.0f;
    private Rigidbody rigidbody;
    private Transform attractTrans;

	// Use this for initialization
	void Start () {
        rigidbody = this.GetComponent<Rigidbody>();
	}
	
	// Update is called once per frame
	void Update () {

        if (attractTrans)
        {
            transform.position = Vector3.MoveTowards(transform.position, attractTrans.position, Time.deltaTime * 0.5f);
        }

    }

    void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Wall"))
        {
            //reverse velocity
            rigidbody.AddForce(rigidbody.velocity * -2.0f, ForceMode.Impulse);

        }
    }

    public void EngageAttract(GameObject attractObject)
    {
        this.rigidbody.isKinematic = true;
        this.attractTrans = attractObject.transform;
    }

}
