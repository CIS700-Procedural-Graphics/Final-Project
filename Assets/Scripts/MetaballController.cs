using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MetaballController : MonoBehaviour {

    public bool writeToFile = true; //true if we are recording
    System.IO.StreamReader readFile; //the file we will read metaball vertex data from
    private List<Vector3>[] frameVertices;
    private List<Vector3>[] frameNormals;

    private int frameCount = 0;


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
    private int res3 = 4 * 4 * 4;

    public float maxSpeed = 0.01f;
    public int numMetaballs = 5;

    public Metaball inputMetaball;
	public Voxel[] voxels;
    public List<Metaball> balls;

    private Mesh metaballsMesh;


    void Awake()
    {
        this.gridCellWidth = this.gridWidth / this.res;
        this.halfCellWidth = this.gridCellWidth / 2.0f;
       
        this.res2 = res * res;
        this.res3 = res * res * res;
    }

    void ToVertices(string filePath)
    {
        string[] lines = System.IO.File.ReadAllLines(filePath);

        Debug.Log(lines.Length);
        //array of lists of vertices, 
        //each list contains vertices for a single frame
        frameVertices = new List<Vector3>[lines.Length];
        frameNormals = new List<Vector3>[lines.Length];


        for (int i = 0; i < lines.Length; i++) //for each line make a new list of vertices
        {
            frameVertices[i] = new List<Vector3>();
            frameNormals[i] = new List<Vector3>();

            string[] posValStrings = lines[i].Split(' ');
            int vertexCount = 0;

            for (int c = 0; c < posValStrings.Length - 3; c += 3) //parse each float
            {
                Vector3 meshVertex = new Vector3(
                    float.Parse(posValStrings[c]),
                    float.Parse(posValStrings[c + 1]),
                    float.Parse(posValStrings[c + 2])
                );

                frameVertices[i].Add(meshVertex);

                vertexCount++;

                //normal calculation
                if (vertexCount % 3 == 0) //for every 3 vertices (triangle) calc normals
                {
                    Vector3 triV2 = frameVertices[i][vertexCount - 1];
                    Vector3 triV1 = frameVertices[i][vertexCount - 2];
                    Vector3 triV0 = frameVertices[i][vertexCount - 3];

                    Vector3 e1 = triV1 - triV0;
                    Vector3 e2 = triV2 - triV1;

                    Vector3 normal = Vector3.Cross(e1, e2);
                    frameNormals[i].Add(normal);
                    frameNormals[i].Add(normal);
                    frameNormals[i].Add(normal);

                }
            }
        }

    }

	// Use this for initialization
	void Start () {
        if (!writeToFile)
        {
            //readFile =
            //   new System.IO.StreamReader("metaballSim.txt");
            ToVertices("metaballSim.txt");

        }
        else
        {
            setupCells();
            setupWalls();
            setupMetaballs();
        }

        makeMesh();
	}

    // Update is called once per frame
    void Update() {

        if (writeToFile) //only sample if we are recording
        {
            //Update isovalues of each voxel
            for (int c = 0; c < this.res3; c++)
            {

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
            }
        }

        updateMesh();
    }

    void setupCells()
    {
        // Allocate voxels based on our grid resolution
		this.voxels = new Voxel[this.res3];
        for (int i = 0; i < this.res3; i++)
        {
            var i3 = this.i1toi3(i);
            Vector3 voxelPos = this.i3toPos(i3);
            Voxel voxel = new Voxel(voxelPos, this.gridCellWidth);
			this.voxels[i] = voxel;
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

            GameObject metaball = Instantiate(Resources.Load("Metaball")) as GameObject;
            metaball.transform.localScale = Vector3.one * radius / 2.0f;
            metaball.transform.position = position;
            metaball.GetComponent<Rigidbody>().AddForce(velocity, ForceMode.Impulse);

            var ball = metaball.GetComponent<Metaball>();
            ball.radius = radius;
			ball.radiusSquared = Mathf.Pow (radius, 2.0f);

            this.balls.Add(ball);

            if (showSpheres)
            {
                metaball.GetComponent<MeshRenderer>().enabled = true;
            }

        }

        if (this.inputMetaball)
        {
            //inputMetaball.radius = inputMetaball.transform.localScale.x;
            //inputMetaball.radiusSquared = inputMetaball.radius * inputMetaball.radius;
            this.balls.Add(inputMetaball);
            this.numMetaballs++;
       }
    }

    void makeMesh()
    {
       metaballsMesh = GetComponent<MeshFilter>().mesh;

    }

    void updateMesh()
    {
        List<Vector3> meshVertices = new List<Vector3>();
        List<Vector3> meshNormals = new List<Vector3>();
        string meshVerticesString = "";

        if (writeToFile) //writing to file (recording metaball movement)
        {
            for (int i = 0; i < this.res3; i++)
            {
                var voxelPolygonMap = this.voxels[i].polygonize(this.isoLevel);
                if (voxelPolygonMap["vertPositions"].Count > 0)
                {
                    List<Vector3> voxelVertices = voxelPolygonMap["vertPositions"];

                    for (int c = 0; c < voxelVertices.Count; c++)
                    {
                        meshVertices.Add(voxelVertices[c]);

                        string posString =
                            voxelVertices[c].x.ToString()
                            + " " + voxelVertices[c].y.ToString()
                            + " " + voxelVertices[c].z.ToString()
                            + " ";

                        meshVerticesString += posString;

                    }

                }
            }

            using (System.IO.StreamWriter outputFile = new System.IO.StreamWriter("metaballSim.txt", true))
            {

                outputFile.WriteLine(meshVerticesString);
            }
        }else //reading from file
        {
            if (frameCount < frameVertices.Length)
            {
                meshVertices = frameVertices[frameCount];
                meshNormals = frameNormals[frameCount];
                frameCount++;
            }else
            {
                frameCount = 0;
            }


            //string line;
            //int vertexCount = 0;

            //if ((line = readFile.ReadLine()) != null)
            //{
            //    string[] posValStrings = line.Split(' ');
            //    for (int i = 0; i < posValStrings.Length - 3; i += 3)
            //    {
            //        Vector3 meshVertex = new Vector3(
            //            float.Parse(posValStrings[i]),
            //            float.Parse(posValStrings[i + 1]),
            //            float.Parse(posValStrings[i + 2])
            //        );

            //        meshVertices.Add(meshVertex);
            //        vertexCount++;

            //        //normal calculation
            //        if (vertexCount % 3 == 0) //for every 3 vertices (triangle) calc normals
            //        {
            //            Vector3 triV2 = meshVertices[vertexCount - 1];
            //            Vector3 triV1 = meshVertices[vertexCount - 2];
            //            Vector3 triV0 = meshVertices[vertexCount - 3];

            //            Vector3 e1 = triV1 - triV0;
            //            Vector3 e2 = triV2 - triV1;

            //            Vector3 normal = Vector3.Cross(e1, e2);
            //            meshNormals.Add(normal);
            //            meshNormals.Add(normal);
            //            meshNormals.Add(normal);

            //        }
            //    }

            //}
            //else
            //{
            //    readFile.Close();
            //    readFile =
            //  new System.IO.StreamReader("metaballSim.txt");
            //}


        }

        

  

        //create triangle indices
        int[] meshTriangles = new int[meshVertices.Count];

        for (int i = 0; i < meshTriangles.Length; i++)
        {
            //index in order because we add vertices in order
            meshTriangles[i] = i;

        }

        metaballsMesh.Clear();
        metaballsMesh.vertices = meshVertices.ToArray();
        metaballsMesh.normals = meshNormals.ToArray();
        metaballsMesh.triangles = meshTriangles;
        //metaballsMesh.RecalculateBounds();
    }

    float influence(Metaball ball, Vector3 point)
    {
		float rSquared = ball.radiusSquared;
		float xDiffSquared = (point.x - ball.transform.position.x) * (point.x - ball.transform.position.x);
		float yDiffSquared = (point.y - ball.transform.position.y) * (point.y - ball.transform.position.y);
		float zDiffSquared = (point.z - ball.transform.position.z) * (point.z - ball.transform.position.z);
        return (rSquared / (xDiffSquared + yDiffSquared + zDiffSquared));
    }

      float sample(Vector3 point)
    {
        float isovalue = 0.0f;

		for (int i = 0; i < numMetaballs; i++)
        {
			float rSquared = this.balls[i].radiusSquared;
			float xDiffSquared = (point.x - this.balls[i].transform.position.x) * (point.x - this.balls[i].transform.position.x);
			float yDiffSquared = (point.y - this.balls[i].transform.position.y) * (point.y - this.balls[i].transform.position.y);
			float zDiffSquared = (point.z - this.balls[i].transform.position.z) * (point.z - this.balls[i].transform.position.z);
			float influence =  (rSquared / (xDiffSquared + yDiffSquared + zDiffSquared));
			isovalue += influence;
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
