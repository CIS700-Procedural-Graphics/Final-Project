using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MetaballController : MonoBehaviour {

    public bool isPaused = false;
    public bool visualDebug = true;
    public bool showSpheres = true;
    public bool showGrid = true;

    public float isoLevel = 1.0f;
    public float minRadius = 0.5f;
    public float maxRadius = 1.0f;

    public float gridWidth = 10.0f;
    private float gridCellWidth = 10.0f/4.0f;
    private float halfCellWidth = 10.0f / 2.0f;

    public int res = 4;
    private int res2 = 4 * 4;
    private float res3 = 4 * 4 * 4;

    public float maxSpeed = 0.01f;
    public int numMetaballs = 5;

    public List<Voxel> voxels;
    public GameObject[] labels;
    public List<Metaball> balls;

  
    void Awake()
    {
        this.gridCellWidth = this.gridWidth / this.res;
        this.halfCellWidth = this.gridCellWidth / 2.0f;
       
        this.res2 = res * res;
        this.res3 = res * res * res;
    }

	// Use this for initialization
	void Start () {
        Debug.Log("HI");
        setupCells();
        setupMetaballs();
	}
	
	// Update is called once per frame
	void Update () {
		
	}

    void setupCells()
    {
        // Allocate voxels based on our grid resolution
        this.voxels = new List<Voxel>();
        for (int i = 0; i < this.res3; i++)
        {
            GameObject voxel = Instantiate(Resources.Load("Voxel")) as GameObject;
            var i3 = this.i1toi3(i);
            Vector3 voxelPos = this.i3toPos(i3);
            voxel.transform.position = voxelPos;
            voxel.transform.localScale = Vector3.one * gridCellWidth;
            this.voxels.Add(voxel.GetComponent<Voxel>());

            if (this.visualDebug)
            {
                voxel.GetComponent<MeshRenderer>().enabled = true;
            }
        }

     
    }

    void setupMetaballs()
    {
        float px, py, pz, vx, vy, vz, radius;
        Vector3 position, velocity;

        var maxRadiusTRippled = this.maxRadius * 3;
        var maxRadiusDoubled = this.maxRadius * 2;

        for (int i = 0; i < this.numMetaballs; i++)
        {
            px = this.gridWidth / 2;
            py = this.gridWidth / 2;
            pz = this.gridWidth / 2;
            position = new Vector3(px, py, pz);

            vx = (Random.Range(0,1.0f) * 2 - 1) * this.maxSpeed;
            vy = (Random.Range(0, 1.0f) * 2 - 1) * this.maxSpeed;
            vz = (Random.Range(0, 1.0f) * 2 - 1) * this.maxSpeed;
            velocity = new Vector3(vx, vy, vz);

            radius = Random.Range(0, 1.0f) * (this.maxRadius - this.minRadius) + this.minRadius;

            GameObject metaball = Instantiate(Resources.Load("Metaball")) as GameObject;
            metaball.transform.localScale = Vector3.one * radius / 2.0f;
            metaball.transform.position = position;
            metaball.GetComponent<Rigidbody>().velocity = velocity;

            this.balls.Add(metaball.GetComponent<Metaball>());

            if (this.visualDebug)
            {
                metaball.GetComponent<MeshRenderer>().enabled = true;
            }

        }
    }

    //convert 1 dimensional index to 3 dimensional index
    int[] i1toi3(int i1)
    {

        // [i % w, i % (h * w)) / w, i / (h * w)]

        // @note: ~~ is a fast substitute for Math.floor()

        int[] threeDimesionalIndex = new int[] {
            i1 % this.res,
            ~~ ((i1 % this.res2) / this.res),
            ~~ (i1 / this.res2)
        };

        return threeDimesionalIndex;

    }

    //convert from a 3 dimensional index to a 1 dimensional index
    int i3toi1(int i3x, int i3y, int i3z)
    {
        return i3x + i3y * this.res + i3z * this.res2;
    }


    // Convert from 3D indices to 3D positions
    Vector3 i3toPos(int[] i3)
    {

        return new Vector3(
          i3[0] * this.gridCellWidth + this.transform.position.x + this.halfCellWidth,
          i3[1] * this.gridCellWidth + this.transform.position.y + this.halfCellWidth,
          i3[2] * this.gridCellWidth + this.transform.position.z + this.halfCellWidth
          );
    }
}
