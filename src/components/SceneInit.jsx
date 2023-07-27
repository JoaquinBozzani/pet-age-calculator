import React, { useEffect } from 'react';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { SimplifyModifier } from 'three/addons/modifiers/SimplifyModifier.js';

import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

const SceneInit = () => {

    //THREE.JS
    useEffect(() => {
      //----- SCENE -----
      let model;
      //delete this variable if not using the mesh when done
      let modelMesh;

      let isModelLoaded = false;

      let mouse;
      let raycaster;
      let selectedModel;


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
      camera.position.set(0, 10, 40);
    
  
      //----- LIGHTS -----
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);
      

      //----- MODELS -----
      //dog
      const gltfLoader = new GLTFLoader();

      //DRACOLoader instance to decode compressed mesh data
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
      gltfLoader.setDRACOLoader(dracoLoader);


      
      gltfLoader.load('./src/assets/models/beagle/scene.gltf',
      // called when the resource is loaded
      (gltf) => {
        model = gltf.scene;
        //add model to scene
        scene.add(model);
        
        //get mesh 
        //ONLY HERE IF I NEED IT IN THE FUTURE DELETE IF NOT USING WHEN IM DONE WITH THIS 
        modelMesh = model.getObjectByName('Object_7');
        
        //flag as draggable
        modelMesh.userData.draggable = true;
        modelMesh.userData.name = 'dog';
        
        
        isModelLoaded = true;
      },
      (xhr) => {
        //shows model loading
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      });
      
      
      
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
      //set position
      groundBody.position.set(0, 0, 0);
      physicsWorld.addBody(groundBody);

      //create box to use as hitbox for models
      const size = 1;
      const halfExtents = new CANNON.Vec3();
      if(isModelLoaded){
        halfExtents.setFromObject(model);
      };
      const boxShape = new CANNON.Box(halfExtents);
      const boxBody = new CANNON.Body({ mass: 10, shape: boxShape });
      boxBody.position.set(0, 15, 0);
      
      physicsWorld.addBody(boxBody);
      physicsWorld.addBody(boxBody);
      





      
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
      controls.update();


      //----- CANNON DEBUGGER ----- DELETE WHEN FINISHED -----
      const cannonDebugger = new CannonDebugger(scene, physicsWorld, {
        // options...
      })
  




      // ----- RAYCASTING -----
      //for picking model up with mouse
      mouse = new THREE.Vector2();
      raycaster = new THREE.Raycaster();

      function translateMousePosition() {
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      }


      function onClick( event ) {
        translateMousePosition();

        raycaster.setFromCamera(mouse, camera);
        const found = raycaster.intersectObjects(scene.children);
        if(found.length > 0 && found[0].object.userData.draggable) {
          selectedModel = found[0].object;
          console.log(selectedModel.userData)
          
        }

      }
      

      function onMouseMove() {
        translateMousePosition();
      }


      //----- ANIMATE -----
      const animate = () => {
        physicsWorld.step(timeStep); //update physics
        
        if(isModelLoaded) {
          model.position.copy(boxBody.position);
          // model.position.y -= 1;
          model.quaternion.copy(boxBody.quaternion);
        }
        
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
   
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener( 'click', onClick );


   
   
   
    }, []);

    
  return (
      <div>
        <canvas id='webgl'></canvas>
      </div>
  )
}

export default SceneInit