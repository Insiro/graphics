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
let lightPosition = vec4(1, 1, 1, 0);
let lightAmbient = vec4(0.2, 0.2, 0.2, 1);
let lightDiffuse = vec4(1, 1, 1, 1);
let lightSpecular = vec4(1, 1, 1, 1);

let materialAmbinet = vec4(1, 0, 1, 1);
let materialDiffuse = vec4(1, 0.8, 0, 1);
let materialSpecular = vec4(1, 0.8, 0, 1);
let materialShininess = 100.0;

let ctm, ambientColor, doffiseColor, specularColor, modelView, projection, viewerPos, program, gl;
let xAxis = 0;
let yAxis = 1;
let zAxis = 2;
let axis = 0;
let theta = [0.0, 0.0, 0.0];
let thetaLoc;
let flag = true;
function quard(a, b, c, d) {
    let t1 = subtract(vertices[b], vertices[a]);
    let t2 = subtract(vertices[c], vertices[a]);
    let normal = vec3(cross(t1, t2));
    pointsArray.push(vertices[a]);
    normalArray.push(normal);
    pointsArray.push(vertices[b]);
    normalArray.push(normal);
    pointsArray.push(vertices[c]);
    normalArray.push(normal);
    pointsArray.push(vertices[a]);
    normalArray.push(normal);
    pointsArray.push(vertices[c]);
    normalArray.push(normal);
    pointsArray.push(vertices[d]);
    normalArray.push(normal);
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
    if (flag) {
        theta[axis] += 2;
    }
    modelView = mat4();
    modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0]));
    modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0]));
    modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1]));
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
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    colorCube();
    let nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalArray), gl.STATIC_DRAW);
    let vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
    let vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    let vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    thetaLoc = gl.getUniformLocation(program, "theta");
    projection = ortho(-1, 1, -1, 1, -100, 100);

    let ambientProduct = mult(lightAmbient, materialAmbinet);
    let diffuseProduct = mult(lightDiffuse, materialDiffuse);
    let specularProduct = mult(lightSpecular, materialSpecular);
    document.getElementById("btnX").onclick = () => {
        axis = xAxis;
        render();
    };
    document.getElementById("btnY").onclick = () => {
        axis = yAxis;
        render();
    };
    document.getElementById("btnZ").onclick = () => {
        axis = zAxis;
        render();
    };
    document.getElementById("btnT").onclick = () => {
        flag = !flag;
        render();
    };
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"), false, flatten(projection));
    render();
};
