
import * as THREE from 'https://cdn.skypack.dev/three';

import Stats from 'https://cdn.skypack.dev/three/examples/jsm/libs/stats.module.js';

import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'https://cdn.skypack.dev/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three/examples/jsm/postprocessing/RenderPass.js';
// import { UnrealBloomPass } from 'https://cdn.skypack.dev/three/examples/jsm/postprocessing/UnrealBloomPass.js';

let camera, stats;
let composer, renderer, mixer, clock;

// const params = {
//     exposure: 1,
//     bloomStrength: 1.5,
//     bloomThreshold: 0,
//     bloomRadius: 0
// };

init();
document.getElementById('nextModule').onclick = function() {
    camera.translateX(2);
}
document.getElementById('preModule').onclick = function() {
    camera.translateX(-2);
}



function init() {

    const container = document.getElementById( 'container' );

    stats = new Stats();
    container.appendChild( stats.dom );

    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer( { antialias:true} );
    // renderer.setClearColor( 0x000000, 0 ); 
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ReinhardToneMapping;
    container.appendChild( renderer.domElement );

    const scene = new THREE.Scene();
    scene.background = null;

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
    camera.position.set( 5, 4, - 3.5 );
    scene.add( camera );
    // const AmbientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    // scene.add( AmbientLight ); 

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 1;
    controls.maxDistance = 10;

    scene.add( new THREE.AmbientLight( 0xe1e3e6 ) );
    
    const pointLight = new THREE.PointLight( 0xe1e3e6, 1 );
    camera.add( pointLight );

    const renderScene = new RenderPass( scene, camera );

    // const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    //bloomPass.threshold = params.bloomThreshold;
    //bloomPass.strength = params.bloomStrength;
    //bloomPass.radius = params.bloomRadius;

    composer = new EffectComposer( renderer );
    composer.addPass( renderScene );
    //composer.addPass( bloomPass );

    // new GLTFLoader().load( 'PrimaryIonDrive.glb', function ( gltf ) {

    //     const model = gltf.scene;

    //     scene.add( model );

    //     mixer = new THREE.AnimationMixer( model );
    //     const clip = gltf.animations[ 0 ];
    //     mixer.clipAction( clip.optimize() ).play();

    //     animate();

    // } );

    new GLTFLoader().load( 'room.glb', function ( gltf ) {

        const model = gltf.scene;

        scene.add( model );

        mixer = new THREE.AnimationMixer( model );

        animate();

    } );

    // const gui = new GUI();

    // gui.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {

        //renderer.toneMappingExposure = Math.pow( value, 4.0 );

    //} );

    //gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {

    //	bloomPass.threshold = Number( value );

    //} );

    //gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {

    //	bloomPass.strength = Number( value );

    //} );

    //gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {

    //	bloomPass.radius = Number( value );

    //} );

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );
    composer.setSize( width, height );

}

function animate() {

    requestAnimationFrame( animate );

    const delta = clock.getDelta();

    mixer.update( delta );

    stats.update();

    composer.render();

}