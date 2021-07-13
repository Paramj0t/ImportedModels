import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { CubeTextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

//Texture
const cubeTextureLoader = new THREE.CubeTextureLoader();

//Debugger
const gui = new dat.GUI();

//Canvas
const canvas = document.querySelector(".webgl");

//Scene
const scene = new THREE.Scene();

//Models
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null;

gltfLoader.load("/models/chassis.glb", (gltf) => {
	// scene.add(gltf.scene.children[0]);

	// while (gltf.scene.children.length) {
	// 	// scene.add(gltf.scene.children[0]);
	// }

	// const children = [...gltf.scene.children];
	// for (const child of children) {
	// 	scene.add(child);
	// }
	// mixer = new THREE.AnimationMixer(gltf.scene);
	// const action = mixer.clipAction(gltf.animations[2]);
	// action.play();

	gltf.scene.scale.set(0.025, 0.025, 0.025);
	scene.add(gltf.scene);
});

//Cursor
const cursor = {
	x: 0,
	y: 0,
};

window.addEventListener("mousemove", (event) => {
	cursor.x = event.clientX / sizes.width - 0.5;
	cursor.y = -(event.clientY / sizes.height - 0.5);
});

//Objects
const plane = new THREE.Mesh(
	new THREE.PlaneBufferGeometry(10, 10),
	new THREE.MeshStandardMaterial({
		color: "#777777",
		metalness: 0.3,
		roughness: 0.4,
	})
);

plane.rotation.x = -Math.PI * 0.5;
plane.receiveShadow = true;

scene.add(plane);

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.shadow.camera.far = 15;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

//sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	//Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	//Update Camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	//Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});

//Camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.x = 4;
camera.position.y = 4;
camera.position.z = 4;
// camera.lookAt(mesh.position);
scene.add(camera);

//Renderer
const renderer = new THREE.WebGLRenderer({
	// canvas: canvas
	canvas,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// //Clock
const clock = new THREE.Clock();
let oldElapsed = 0;

//Animation
const tick = () => {
	//clock sec
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - oldElapsed;
	oldElapsed = elapsedTime;

	//Mixer update
	if (mixer !== null) mixer.update(deltaTime);

	//Update controls
	controls.update();

	//Renderer
	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();
