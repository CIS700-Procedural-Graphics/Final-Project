//require('file-loader?name=[name].[ext]!../index.html');
import Stats from 'stats-js'
import DAT from 'dat-gui'
import WebGL2 from './webgl.js'


function init(callback, update) {
  var stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  //document.body.appendChild(stats.domElement);

  //var gui = new DAT.GUI();

  var framework = {
    //gui: gui,
    //stats: stats
  };

  window.addEventListener('load', function() {

    framework.canvas = canvas;
    framework.webgl = new WebGL2();
      
    window.addEventListener('resize', function() {
      resize(framework.webgl.gl.canvas);
    }, false);


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
  var cssToRealPixels = window.devicePixelRatio || 1;

  var displayWidth  = Math.floor(canvas.clientWidth  * cssToRealPixels);
  var displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);

  if (canvas.width  !== displayWidth ||
      canvas.height !== displayHeight) {
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}

export default {
  init: init
}