using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InputController : MonoBehaviour
{

    private SteamVR_TrackedController controller;
    private MetaballController metaballController;

    private void OnEnable()
    {
        controller = GetComponent<SteamVR_TrackedController>();
        controller.TriggerClicked += HandleTriggerDown;
        controller.TriggerUnclicked += HandleTriggerUp;
        metaballController = GameObject.Find("MetaballController").GetComponent<MetaballController>();
    }

    // Use this for initialization
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {

    }


    void HandleTriggerDown(object sender, ClickedEventArgs e)
    {
        Debug.Log("Attract");
        Debug.Log(metaballController.numMetaballs);
        for (int i = 0; i < metaballController.numMetaballs - 1; i++)
        {
            metaballController.balls[i].EngageAttract(this.gameObject);
        }
    }

    void HandleTriggerUp(object sender, ClickedEventArgs e)
    {

    }
}
