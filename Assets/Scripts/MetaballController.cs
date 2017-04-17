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

    private Mesh metaballsMesh;

  
    void Awake()
    {
        this.gridCellWidth = this.gridWidth / this.res;
        this.halfCellWidth = this.gridCellWidth / 2.0f;
       
        this.res2 = res * res;
        this.res3 = res * res * res;
    }

	// Use this for initialization
	void Start () {
        setupCells();
        setupWalls();
        setupMetaballs();
        makeMesh();
	}

    // Update is called once per frame
    void Update() {

        //Update isovalues of each voxel
        for (int c = 0; c < this.res3; c++)
        {
            this.voxels[c].center.isovalue = this.sample
                (this.voxels[c].center.position);

            this.voxels[c].v1.isovalue = this.sample
                (this.voxels[c].v1.position);

            this.voxels[c].v2.isovalue = this.sample
                (this.voxels[c].v2.position);

            this.voxels[c].v3.isovalue = this.sample
                (this.voxels[c].v3.position);

            this.voxels[c].v4.isovalue = this.sample
                (this.voxels[c].v4.position);

            this.voxels[c].v5.isovalue = this.sample
                (this.voxels[c].v5.position);

            this.voxels[c].v6.isovalue = this.sample
                (this.voxels[c].v6.position);

            this.voxels[c].v7.isovalue = this.sample
                (this.voxels[c].v7.position);

            this.voxels[c].v8.isovalue = this.sample
                (this.voxels[c].v8.position);

            //if (visualDebug)
            //{
            //    if(this.voxels[c].center.isovalue > this.isoLevel)
            //    {
            //        this.voxels[c].show();
            //    }else
            //    {
            //        this.voxels[c].hide();
            //    }
            //}
        }


        updateMesh();
    }

    void setupCells()
    {
        // Allocate voxels based on our grid resolution
        this.voxels = new List<Voxel>();
        for (int i = 0; i < this.res3; i++)
        {
            //GameObject voxel = Instantiate(Resources.Load("Voxel")) as GameObject;
            //voxel.isStatic = true;
            var i3 = this.i1toi3(i);
            Vector3 voxelPos = this.i3toPos(i3);
            Voxel voxel = new Voxel(voxelPos, this.gridCellWidth);
            //voxel.transform.localScale = Vector3.one * gridCellWidth;
            //this.voxels.Add(voxel.GetComponent<Voxel>());
            this.voxels.Add(voxel);
            //if (visualDebug)
            //{
            //    voxel.GetComponent<MeshRenderer>().enabled = true;
            //}
        }

     
    }

    //Constrains movement of metaballs
    void setupWalls()
    {

        List<Vector3> wallPositions = new List<Vector3>();
        wallPositions.Add(new Vector3(0.0f, 1.0f, 1.0f));
        wallPositions.Add(new Vector3(1.0f, 1.0f, 0.0f));
        wallPositions.Add(new Vector3(1.0f, 0.0f, 1.0f));
        wallPositions.Add(new Vector3(2.0f,1.0f,1.0f));
        wallPositions.Add(new Vector3(1.0f, 1.0f, 2.0f));
        wallPositions.Add(new Vector3(1.0f, 2.0f, 1.0f));

        List<Vector3> wallScales = new List<Vector3>();
        wallScales.Add(new Vector3(0.0f, 1.0f, 1.0f));
        wallScales.Add(new Vector3(1.0f, 1.0f, 0.0f));
        wallScales.Add(new Vector3(1.0f, 0.0f, 1.0f));


        for (int i = 0; i < wallPositions.Count; i++)
        {
            GameObject wall = Instantiate(Resources.Load("Wall")) as GameObject;
            Vector3 pos = wallPositions[i] * this.gridWidth / 2.0f;
            wall.transform.position = pos;
            wall.transform.localScale = wallScales[i % 3] * this.gridWidth;
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
            //radius = 1.0f;

            GameObject metaball = Instantiate(Resources.Load("Metaball")) as GameObject;
            metaball.transform.localScale = Vector3.one * radius / 2.0f;
            metaball.transform.position = position;
            metaball.GetComponent<Rigidbody>().AddForce(velocity, ForceMode.Impulse);

            var ball = metaball.GetComponent<Metaball>();
            ball.radius = radius;

            this.balls.Add(ball);

            if (visualDebug)
            {
                metaball.GetComponent<MeshRenderer>().enabled = true;
            }

        }
    }

    void makeMesh()
    {
       metaballsMesh = GetComponent<MeshFilter>().mesh;

    }

    void updateMesh()
    {
        List<Vector3> meshVertices = new List<Vector3>();

        for (int i = 0; i < this.res3; i++)
        {
            var voxelPolygonMap = this.voxels[i].polygonize(this.isoLevel);
            if (voxelPolygonMap["vertPositions"].Count > 0)
            {
                List<Vector3> voxelVertices = voxelPolygonMap["vertPositions"];

                for (int c = 0; c < voxelVertices.Count; c++)
                {
                    meshVertices.Add(voxelVertices[c]);
                }

            }
        }

        //////add test vertices
        //meshVertices.Add(new Vector3(0f, 0f, 0f));
        //meshVertices.Add(new Vector3(0f, 1f, 0f));
        //meshVertices.Add(new Vector3(1f, 1f, 0f));

        //meshVertices.Add(new Vector3(2f, 0f, 0f));
        //meshVertices.Add(new Vector3(2f, 1f, 0f));
        //meshVertices.Add(new Vector3(3f, 1f, 0f));


        //create triangle indices
        int[] meshTriangles = new int[meshVertices.Count];
        for (int i = 0; i < meshTriangles.Length; i++)
        {
            //index in order because we add vertices in order
            meshTriangles[i] = i;
        }


        metaballsMesh.Clear();
        metaballsMesh.vertices = meshVertices.ToArray();
        metaballsMesh.triangles = meshTriangles;
        metaballsMesh.RecalculateBounds();
    }

    float influence(Metaball ball, Vector3 point)
    {
        float rSquared = Mathf.Pow(ball.radius, 2.0f);
        float xDiffSquared = Mathf.Pow(point.x - ball.transform.position.x, 2.0f);
        float yDiffSquared = Mathf.Pow(point.y - ball.transform.position.y, 2.0f);
        float zDiffSquared = Mathf.Pow(point.z - ball.transform.position.z, 2.0f);
        return (rSquared / (xDiffSquared + yDiffSquared + zDiffSquared));
    }

      float sample(Vector3 point)
    {
        float isovalue = 0.0f;

        for (int i = 0; i < this.balls.Count; i++)
        {
            isovalue += this.influence(this.balls[i], point);
        }

        return isovalue;
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
