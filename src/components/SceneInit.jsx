import React, { useEffect } from 'react';

import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

import * as CANNON from 'cannon-es';

const SceneInit = () => {

    //THREE.JS / CANNON.ES
    useEffect(() => {
      let dogModel;
      let dogModelMesh;
      let isDogModelLoaded = false;

      let catModel;
      let catModelMesh;
      let isCatModelLoaded = false;
      
    
      let raycaster;
      let isDragging = false;
      
      
      
      //----- SCENE -----
      const scene = new THREE.Scene();
      const background = new THREE.Color('white');
      scene.background = background;
      
  
      //----- CAMERA -----
      const camera = new THREE.PerspectiveCamera(
          50,
          window.innerWidth / window.innerHeight,
          1,
          1000
      );
      camera.position.set(0, 30, 70);
      
  
      
      //----- LIGHTS -----
      // const light = new THREE.DirectionalLight(0xffffff, 1);
      // light.position.set(20, 30, 10);
      // light.target.position.set(0, 0, 0);
      // scene.add(light);

      const light = new THREE.AmbientLight(0xffffff, 1);
      scene.add(light);
      


      // ----- WALLS -----
      const planeGeo = new THREE.PlaneGeometry( 100.1, 100.1 );
      const planeMat = new THREE.MeshPhongMaterial( { color: 0xffffff, opacity: 0, transparent: true, depthWrite: false } );
      
      const planeTop = new THREE.Mesh( planeGeo, planeMat);
      planeTop.position.y = 60;
      planeTop.rotateX( Math.PI / 2 );
      scene.add( planeTop );

      const planeFront = new THREE.Mesh( planeGeo, planeMat);
      planeFront.position.z = 10;
      planeFront.position.y = 50;
      planeFront.rotateY( Math.PI );
      scene.add( planeFront );

      const planeBack = new THREE.Mesh( planeGeo, planeMat);
      planeBack.position.z = - 30;
      planeBack.position.y = 50;
      scene.add( planeBack );

      const planeRight = new THREE.Mesh( planeGeo, planeMat);
      planeRight.position.x = 55;
      planeRight.position.y = 50;
      planeRight.rotateY( - Math.PI / 2 );
      scene.add( planeRight );

      const planeLeft = new THREE.Mesh( planeGeo, planeMat);
      planeLeft.position.x = - 55;
      planeLeft.position.y = 50;
      planeLeft.rotateY( Math.PI / 2 );
      scene.add( planeLeft );

      const planeBottom = new THREE.Mesh( planeGeo, planeMat);
      planeBottom.position.y = 0;
      planeBottom.rotateX( Math.PI / 2 );
      scene.add( planeBottom );


      //----- MODELS -----

      //  TEXTURES
      const modelTextures = ['burnt.jpg', 'flowers.jpg', 'fungus.jpg', 'gold.jpg', 'gradient.jpg', 'jester.jpg', 'leopard.jpg', 'lines.jpg', 'paint.jpg', 'pink.jpg', 'rectangle.jpg', 'roof.jpg', 'sand.jpg', 'wall.jpg', 'water.jpg'];



      const dogTexture = new THREE.TextureLoader().load(`./src/assets/models/textures/${modelTextures[0]}`);
      
      

      // ----- DOG -----
      const gltfLoader = new GLTFLoader();
      //DRACOLoader instance to decode compressed mesh data
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
      gltfLoader.setDRACOLoader(dracoLoader);
      
      const dogModelMaterial = new THREE.MeshBasicMaterial();
      dogModelMaterial.map = dogTexture;

      
      gltfLoader.load('./src/assets/models/beagle/scene.gltf',
      // called when the resource is loaded
      (gltf) => {
        dogModel = gltf.scene;
        dogModel.scale.set(3.5, 3.5, 3.5);
        
        //change model material to whatever you want (give it colors, textures, etc)
        dogModel.traverse(function(node) {
          if (node.isMesh) {
            node.material = dogModelMaterial;
          }
        });

        //add model to scene
        scene.add(dogModel);
        
        //get mesh 
        dogModelMesh = dogModel.getObjectByName('Object_7');
        isDogModelLoaded = true;
      });



      // ----- CAT -----
      const objLoader = new OBJLoader();

  
      const catTexture = new THREE.TextureLoader().load(`./src/assets/models/textures/${modelTextures[14]}`);;

      // load a resource
      objLoader.load(
        // resource URL
        './src/assets/models/cat/Cat_01.obj',
        // called when resource is loaded
        function ( object ) {
          catModel = object;
          // set scale
          catModel.scale.set(0.013, 0.013, 0.013);
          // console.log(catModel)
        

          catModelMesh = catModel.children[0];
          // console.log(catModelMesh)
          
          
          catModel.position.set(53, 0, 0);

          catModelMesh.material.map = catTexture;
         
          scene.add(catModel);
          isCatModelLoaded = true;
      });


      // ----- RAYCASTING -----
      //for picking model up with mouse
      raycaster = new THREE.Raycaster();

      // Movement plane when dragging
      let movementPlane;
      const planeGeometry = new THREE.PlaneGeometry(100, 100);
      const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x777777 })
      movementPlane = new THREE.Mesh(planeGeometry, floorMaterial);
      movementPlane.visible = false, // Hide it..
      scene.add(movementPlane);


      
      // ----- PHYSICS -----
      //world for simulated physics
      const physicsWorld = new CANNON.World({
        gravity: new CANNON.Vec3(0, 0, 0),
      });
      //time for physics
      const timeStep = 1 / 60;


      
      // -- FLOOR --
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


      
      // -- WALLS --
      //TOP
      const topPlaneBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
      });
      topPlaneBody.position.copy(planeTop.position);
      topPlaneBody.quaternion.copy(planeTop.quaternion);
      physicsWorld.addBody(topPlaneBody);

      //FRONT
      const frontPlaneBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
      });
      frontPlaneBody.position.copy(planeFront.position);
      frontPlaneBody.quaternion.copy(planeFront.quaternion);
      physicsWorld.addBody(frontPlaneBody);

      //BACK
      const backPlaneBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
      });
      backPlaneBody.position.copy(planeBack.position);
      backPlaneBody.quaternion.copy(planeBack.quaternion);
      physicsWorld.addBody(backPlaneBody);

      //RIGHT
      const rightPlaneBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
      });
      rightPlaneBody.position.copy(planeRight.position);
      rightPlaneBody.quaternion.copy(planeRight.quaternion);
      physicsWorld.addBody(rightPlaneBody);

      //LEFT
      const leftPlaneBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Plane(),
      });
      leftPlaneBody.position.copy(planeLeft.position);
      leftPlaneBody.quaternion.copy(planeLeft.quaternion);
      physicsWorld.addBody(leftPlaneBody);



      // -- BOX --
      //create box to use as hitbox for models
      const halfExtents = new CANNON.Vec3(1, 1, 1);
      const boxShape = new CANNON.Box(halfExtents);
      const boxBody = new CANNON.Body({ mass: 5, shape: boxShape });
      boxBody.position.set(60, -70, 20);
      //add
      physicsWorld.addBody(boxBody);



      // -- JOINT --
      // Joint body, to later constraint the cube
      let jointBody;
      let jointConstraint;
      const jointShape = new CANNON.Sphere(0.1);
      jointBody = new CANNON.Body({ mass: 0 });
      jointBody.addShape(jointShape);
      jointBody.collisionFilterGroup = 0;
      jointBody.collisionFilterMask = 0;
      physicsWorld.addBody(jointBody);


      
      //----- RENDERER -----
      const canvas = document.getElementById('webgl');
      const renderer =  new THREE.WebGLRenderer({
        canvas,
        antialias: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      

      //----- ANIMATE -----
      const animate = () => {
        physicsWorld.step(timeStep); //update physics
        if(isDogModelLoaded) {
          dogModel.position.copy(boxBody.position);
          dogModel.quaternion.copy(boxBody.quaternion);
        }

        if(isCatModelLoaded) {
          catModel.lookAt(dogModel.position);
        }


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



      // ---------------------------------------------------------------------------
      // ----- EVENT LISTENERS FOR MOUSE INTERACTION ----- 

      window.addEventListener('click', () => {
        // catTexture.load(`./src/assets/models/textures/${modelTextures[0]}`);
        // catModelMesh.material.map = catTexture;
      })



      // ----- (picking models up) -----
      window.addEventListener('pointerdown', (event) => {
        // Cast a ray from where the mouse is pointing and
        // see if we hit something

        const hitPoint = getHitPoint(event.clientX, event.clientY, dogModelMesh, camera)
      
        // Return if the cube wasn't hit
        if (!hitPoint) {
          return
        }
      
        // Move the movement plane on the z-plane of the hit
        moveMovementPlane(hitPoint, camera)
      
        // Create the constraint between the cube body and the joint body
        addJointConstraint(hitPoint, boxBody)
      
        // Set the flag to trigger pointermove on next frame so the
        // movementPlane has had time to move
        requestAnimationFrame(() => {
          isDragging = true
        })
      })

      window.addEventListener('pointermove', (event) => {
        if (!isDragging) {
          return
        }
      
        // Project the mouse onto the movement plane
        const hitPoint = getHitPoint(event.clientX, event.clientY, movementPlane, camera)
      
        if (hitPoint) {
          // Move the cannon constraint on the contact point
          moveJoint(hitPoint)
        }
      })
      
      window.addEventListener('pointerup', () => {
        isDragging = false
      
        // Remove the mouse constraint from the world
        removeJointConstraint()
      })
      
      
      // This function moves the virtual movement plane for the mouseJoint to move in
      function moveMovementPlane(point, camera) {
        // Center at mouse position
        movementPlane.position.copy(point)
      
        // Make it face toward the camera
        movementPlane.quaternion.copy(camera.quaternion)
      }
      
      
      // Returns an hit point if there's a hit with the mesh,
      // otherwise returns undefined
      function getHitPoint(clientX, clientY, mesh, camera) {
        // Get 3D point form the client x y
        const mouse = new THREE.Vector2()
        mouse.x = (clientX / window.innerWidth) * 2 - 1
        mouse.y = -((clientY / window.innerHeight) * 2 - 1)
      
        // Get the picking ray from the point
        raycaster.setFromCamera(mouse, camera)
      
        // Find out if there's a hit
        const hits = raycaster.intersectObject(mesh)
      
        // Return the closest hit or undefined
        return hits.length > 0 ? hits[0].point : undefined
      }
      
      // Add a constraint between the cube and the jointBody
      // in the initeraction position
      function addJointConstraint(position, constrainedBody) {
        // Vector that goes from the body to the clicked point
        const vector = new CANNON.Vec3().copy(position).vsub(constrainedBody.position)
      
        // Apply anti-quaternion to vector to tranform it into the local body coordinate system
        const antiRotation = constrainedBody.quaternion.inverse()
        const pivot = antiRotation.vmult(vector) // pivot is not in local body coordinates
      
        // Move the cannon click marker body to the click position
        jointBody.position.copy(position)
      
        // Create a new constraint
        // The pivot for the jointBody is zero
        jointConstraint = new CANNON.PointToPointConstraint(constrainedBody, pivot, jointBody, new CANNON.Vec3(0, 0, 0))
      
        // Add the constraint to world
        physicsWorld.addConstraint(jointConstraint)
      }
      
      // This functions moves the joint body to a new postion in space
      // and updates the constraint
      function moveJoint(position) {
        jointBody.position.copy(position)
        jointConstraint.update()
      }
      
      // Remove constraint from world
      function removeJointConstraint() {
        physicsWorld.removeConstraint(jointConstraint)
        jointConstraint = undefined
      }
   
    }, []);

    

  return (
      <div>
        <canvas id='webgl'></canvas>
      </div>
  )
}

export default SceneInit