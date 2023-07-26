import React, { useEffect } from 'react';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

const SceneInit = () => {

    //THREE.JS
    useEffect(() => {
      //----- SCENE -----
      const scene = new THREE.Scene();
      const background = new THREE.TextureLoader().load('src/assets/background-1.jpg');
      scene.background = background;
      
  
      //----- CAMERA -----
      const camera = new THREE.PerspectiveCamera(
          50,
          window.innerWidth / window.innerHeight,
          1,
          1000
      );
      camera.position.z = 96;
    
  
      //----- LIGHTS -----
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      ambientLight.castShadow = true;
      scene.add(ambientLight);
      

      //----- MODELS -----
      //MATERIALS
      const mtlLoader = new MTLLoader();
      mtlLoader.setPath('src/assets/models/dogs/dog-1/');
      mtlLoader.load('dog.mtl', function(materials) {
        materials.preload();

        //OBJECT
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('src/assets/models/dogs/dog-1/');
        objLoader.load('dog.obj', 
        // called when resource is loaded
        function(object) {
          console.log(object)
          scene.add(object); 
        },
        // called when loading is in progresses
        function(xhr) {
          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        function (error) {
          console.log( 'An error happened' );
        });

      })

      
      // ----- PHYSICS -----
      //world for simulated physics
      const physicsWorld = new CANNON.World({
        gravity: new CANNON.Vec3(0, -9.81, 0),
      });
      //time for physics
      const timeStep = 1 / 60;

      //create floor
      const groundBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        //infinite ground
        shape: new CANNON.Plane(),
      });
      //rotate ground by 90deg
      groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
      physicsWorld.addBody(groundBody);

      //create box to use as hitbox for models
      const size = 1
      const halfExtents = new CANNON.Vec3(size, size, size)
      const boxShape = new CANNON.Box(halfExtents)
      const boxBody = new CANNON.Body({ mass: 10, shape: boxShape })
      boxBody.position.set(0, 10, 0)
      physicsWorld.addBody(boxBody)



      //----- RENDERER -----
      const canvas = document.getElementById('webgl');
      const renderer =  new THREE.WebGLRenderer({
        canvas,
        antialias: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);


      //----- CONTROLS ----- DELETE WHEN FINISHED -----
      const controls = new OrbitControls( camera, renderer.domElement );
      camera.position.set( 0, 20, 100 );
      controls.update();


      //----- CANNON DEBUGGER ----- DELETE WHEN FINISHED -----
      const cannonDebugger = new CannonDebugger(scene, physicsWorld, {
        // options...
      })
  

      //----- ANIMATE -----
      const animate = () => {
        physicsWorld.step(timeStep); //update physics
        cannonDebugger.update() // Update the CannonDebugger meshes
        renderer.render(scene, camera); //render the threejs scene
        window.requestAnimationFrame(animate); 
      };
      animate();
  

      // ----- RESIZE -----  
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
   
   
   
   
   
   
   
    }, []);

    
  return (
      <div>
        <canvas id='webgl'></canvas>
      </div>
  )
}

export default SceneInit