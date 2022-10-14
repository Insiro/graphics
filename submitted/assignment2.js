let gl;
let points = [];
let sphere_length = 0;
let snows = 0;
let moveLoc;
let movedX = 0;
let movedY = 2;
let direction = -1;

window.onload = function init() {
    document.getElementById("wind_direction").onclick = () => (direction = -direction);
    document.getElementById("reset_snow").onclick = () => (movedY = 2);
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU

    //snowman

    let body = sphere();
    body.scale(0.3, 0.3, 0.3);
    body.translate(0, -0.8, 0.0);
    points = points.concat(body.TriangleVertices);
    sphere_length = points.length;
    let head = sphere();
    head.scale(0.2, 0.2, 0.2);
    head.translate(0, -0.4, 0);
    points = points.concat(head.TriangleVertices);

    //generate snows with randon x, y
    for (let i = 0; i < 60; i++)
        for (let j = 0; j < 30; j++) {
            randx = Math.random() / 10;
            randy = Math.random() / 10;
            let snow = sphere();
            snow.scale(0.03, 0.03, 0.03);
            snow.translate(0.2 * i + randx - 4, 0.2 * j - 1 + randy, 0);
            points = points.concat(snow.TriangleVertices);
            //count snows
            snows += 1;
        }

    let bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate vertex data buffer with shader variables
    let vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    //Uniform for movement
    moveLoc = gl.getUniformLocation(program, "vMove");
    requestAnimationFrame(animate);
};

function animate() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //rendering snowman
    gl.uniform4fv(moveLoc, vec4(0, 0, 0, 0));
    render_parts(0, sphere_length * 2);

    //move snows
    randy = Math.random() / 100;
    movedY -= randy;
    randX = (Math.random() / 100) * direction;
    movedX -= randX;
    if (movedY < -3) movedY = 0;
    if (movedX < -2 || movedX > 2) movedX = 0;
    gl.uniform4fv(moveLoc, vec4(movedX, movedY, 0.1, 0));
    //rendering snows
    render_parts(sphere_length * 2, snows * sphere_length);
    requestAnimationFrame(animate);
}

function render_parts(offset, size) {
    gl.drawArrays(gl.TRIANGLES, offset, size);
}
