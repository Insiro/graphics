let pointsArray = [];
let normalArray = [];
let vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1),
    vec4(0.5, 0.5, 0.5, 1),
    vec4(0.5, -0.5, 0.5, 1),
    vec4(-0.5, -0.5, -0.5, 1),
    vec4(-0.5, 0.5, -0.5, 1),
    vec4(0.5, 0.5, -0.5, 1),
    vec4(0.5, -0.5, -0.5, 1),
];
let texCoord = [vec2(0, 0), vec2(0, 1), vec2(1, 1), vec2(1, 0)];
let gl, program;
let texCoordsArray = [];
let xAxis = 0;
let yAxis = 1;
let zAxis = 2;
let axis = xAxis;
let theta = [0, 0, 0];

function configureTexture(image) {
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    return texture;
}

function quard(a, b, c, d) {
    pointsArray.push(vertices[a]);
    texCoordsArray.push(texCoord[0]);
    pointsArray.push(vertices[b]);
    texCoordsArray.push(texCoord[1]);
    pointsArray.push(vertices[c]);
    texCoordsArray.push(texCoord[2]);
    pointsArray.push(vertices[a]);
    texCoordsArray.push(texCoord[0]);
    pointsArray.push(vertices[c]);
    texCoordsArray.push(texCoord[2]);
    pointsArray.push(vertices[d]);
    texCoordsArray.push(texCoord[3]);
}
function colorCube() {
    quard(1, 0, 3, 2);
    quard(2, 3, 7, 6);
    quard(3, 0, 4, 7);
    quard(6, 5, 1, 2);
    quard(4, 5, 6, 7);
    quard(5, 4, 0, 1);
}
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    modelView = mat4();
    modelView = mult(modelView, rotate(theta[xAxis], [0, 0, 1]));
    modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0]));
    modelView = mult(modelView, rotate(theta[zAxis], [1, 0, 0]));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(modelView));
    gl.drawArrays(gl.TRIANGLES, 0, 36);
}

window.onload = () => {
    let canvas = document.getElementById("canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("gl not init");
        return;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    colorCube();
    let vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    let vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    let tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
    let vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);
    let iamge = new Image();
    iamge.onload = () => {
        configureTexture(iamge);
        render();
    };
    iamge.crossOrigin = "";
    iamge.src = "./SA2011_black.gif";

    thetaLoc = gl.getUniformLocation(program, "theta");
    projection = ortho(-1, 1, -1, 1, -100, 100);
    document.getElementById("btnX").onclick = () => {
        theta[xAxis] += 2;
        render();
    };
    document.getElementById("btnY").onclick = () => {
        theta[yAxis] += 2;
        render();
    };
    document.getElementById("btnZ").onclick = () => {
        theta[zAxis] += 2;
        render();
    };

    render();
};
