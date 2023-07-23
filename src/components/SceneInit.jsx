import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

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
          object.position.z -= 60;
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
        renderer.render(scene, camera);
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