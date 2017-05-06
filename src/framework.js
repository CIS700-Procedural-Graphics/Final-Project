//require('file-loader?name=[name].[ext]!../index.html');
import Stats from 'stats-js'
import DAT from 'dat-gui'
import WebGL2 from './webgl.js'
import Camera from './camera'
import Controls from './controls'
import Lyric from './lyric'
import Character from './character'


function init(callback, update) {
    var stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    //document.body.appendChild(stats.domElement);

    var gui = new DAT.GUI();

    var framework = {
        gui: gui,
       // stats: stats
    };

    window.addEventListener('load', function() {

        framework.webgl = new WebGL2();
        framework.canvas = framework.webgl.canvas;

        window.addEventListener('resize', function() {
            resize(framework.webgl.gl.canvas);
        }, false);

        framework.camera = new Camera(framework.canvas);
        framework.controls = new Controls(framework.canvas, framework.camera);
        framework.lyric = new Lyric();
    
        // begin the animation loop
        (function tick() {
            stats.begin();
            update(framework); // perform any requested updates
            stats.end();
            requestAnimationFrame(tick); // register to call this again when the browser renders a new frame
        })();

        // we will pass the scene, gui, renderer, camera, etc... to the callback function
        return callback(framework);
    });
}


function resize(canvas) {
    var cssToActualPixels = window.devicePixelRatio || 1;

    var screenWidth  = Math.floor(canvas.clientWidth  * cssToActualPixels);
    var screenHeight = Math.floor(canvas.clientHeight * cssToActualPixels);

    if (canvas.width  !== screenWidth || canvas.height !== screenHeight) 
    {
        canvas.width  = screenWidth;
        canvas.height = screenHeight;
    }
}

export default {
  init: init
}