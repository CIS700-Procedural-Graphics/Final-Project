$(document).ready(function() {
    var os = navigator.platform;
    if (os === 'Linux i686' || os === 'Linux armv7l') {
        alert("Please note that graphics packages do not properly run on Linux");
    }
});