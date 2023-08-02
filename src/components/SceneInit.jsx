import React, { useEffect } from 'react';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

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

      //for dragcontrols
      let objects = []; 


      let mouse;
      let raycaster;
 


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
        const material = new THREE.MeshBasicMaterial({color: 'antiquewhite'});
        
        //change model material to whatever you want (give it colors, textures, etc)
        model.traverse(function(node) {
          if (node.isMesh) {
            node.material = material;
          }
        });

        //add model to scene
        scene.add(model);

        
        //get mesh 
        modelMesh = model.getObjectByName('Object_7');
        
        //flag as draggable
        modelMesh.userData.draggable = true;
        modelMesh.userData.name = 'dog';
        
        objects.push(model);
        objects.push(modelMesh);
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
      const halfExtents = new CANNON.Vec3();
      if(isModelLoaded){
        halfExtents.setFromObject(modelMesh); 
      };
      const boxShape = new CANNON.Box(halfExtents);
      const boxBody = new CANNON.Body({ mass: 10, shape: boxShape });
      boxBody.position.set(0, 15, 0);
      
      // objects.push(boxBody);
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
      const orbitControls = new OrbitControls( camera, renderer.domElement );
      orbitControls.update();




      //----- CANNON DEBUGGER ----- DELETE WHEN FINISHED -----
      const cannonDebugger = new CannonDebugger(scene, physicsWorld, {
        // options...
      })
  




      // ----- RAYCASTING -----
      //for picking model up with mouse
      raycaster = new THREE.Raycaster();



      //----- ANIMATE -----
      const animate = () => {
        physicsWorld.step(timeStep); //update physics
        
        if(isModelLoaded) {
          model.position.copy(boxBody.position);

          model.quaternion.copy(boxBody.quaternion);
        }

        //delete debugger when done
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