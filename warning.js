$(document).ready(function() {
    var os = navigator.platform;
    if (os.substring(0, 5) === 'Linux') {
        alert("Please note that this graphics packages may not run properly on Linux");
    }
});