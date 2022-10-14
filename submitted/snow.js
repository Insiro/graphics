let angle = 1;

window.onload = function init() {
    const canvas = document.getElementById("gl-canvas");

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(canvas.width, canvas.height);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    camera = new THREE.PerspectiveCamera(750, canvas.width / canvas.height, 10, 1000);
    camera.rotation.y = (45 / 180) * Math.PI;
    camera.position.x = 150;
    camera.position.y = 150;
    camera.position.z = 150;

    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    hlight = new THREE.AmbientLight(0x404040, 8);
    scene.add(hlight);
    light = new THREE.PointLight(0xc4c4c4, 1);
    light.position.set(10000, 30000, -50000);
    scene.add(light);

    light2 = new THREE.PointLight(0xc4c4c4, 2);
    light2.position.set(0, -10000, 000);
    scene.add(light2);

    light3 = new THREE.PointLight(0xc4c4c4, 5);
    light3.position.set(-8000, -8000, -8000);
    scene.add(light3);

    light4 = new THREE.PointLight(0xffffff, 1);
    light4.position.set(-5000, 3000, 5000);
    scene.add(light4);
    light5 = new THREE.PointLight(0xffffff, 4);
    light5.position.set(-1000, -1000, -50000);
    scene.add(light5);
    const loader = new THREE.GLTFLoader();
    loader.load(
        "./model/scene.gltf",
        function (gltf) {
            grobe = gltf.scene.children[0];
            snow = gltf.scene.children[1];
            grobe.scale.set(5, 5, 5);

            scene.add(gltf.scene);
            requestAnimationFrame(animate);
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );

    function animate() {
        grobe.rotateX(Math.PI / 180);
        renderer.render(scene, camera);
        angle += 1;
        setTimeout(() => requestAnimationFrame(animate), 1);
    }
};
