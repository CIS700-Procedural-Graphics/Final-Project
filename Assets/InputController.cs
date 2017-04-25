using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InputController : MonoBehaviour
{

    private SteamVR_TrackedController controller;

    private void OnEnable()
    {
        controller = GetComponent<SteamVR_TrackedController>();
        controller.TriggerClicked += Attract;
    }

    // Use this for initialization
    void Start () {
          
	}

    // Update is called once per frame
    void Update()
    {

    }


    void Attract(object sender, ClickedEventArgs e)
    {
        Debug.Log("Attract");
    }
}
