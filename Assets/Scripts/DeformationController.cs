using System.Collections;
using System.Collections.Generic;
using UnityEngine.Audio;
using UnityEngine;

public class DeformationController : MonoBehaviour {

    public Material metaballMat;
    public AudioMixer audioMixer;

	// Update is called once per frame
	void Update () {
        metaballMat.SetVector("_InfluencePoint", this.transform.position);
        metaballMat.SetFloat("_DTime", Time.timeSinceLevelLoad);

        Vector3 forward = transform.TransformDirection(Vector3.forward);
        Debug.DrawRay(transform.position, forward * 0.40f, Color.green);

        RaycastHit hit;

        if (Physics.Raycast(transform.position, forward, out hit, 0.40f))
        {
            // print("Found an object - distance: " + hit.distance);
            RevealAudio(hit.distance);

        }else
        {
            HideAudio();
        }

    }

    float normalizeVal(float val, float min, float max)
    {
        return (val - min) / (max - min);
    }

    void RevealAudio(float distance)
    {
        //float value;
        //audioMixer.GetFloat("lowpassFreq", out value);
        //Debug.Log(value);
        float freqAmount;
        float clampedDist = Mathf.Clamp(distance, 0.10f, 0.30f);
        freqAmount = Mathf.Lerp(330f, 15000f, 1f - normalizeVal(clampedDist, 0.10f, 0.30f));
        audioMixer.SetFloat("lowpassFreq", freqAmount);
    }

    void HideAudio()
    {
        audioMixer.SetFloat("lowpassFreq", 330f);
    }

    //void OnTriggerEnter(Collider other)
    //{

    //}
}
