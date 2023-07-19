import React, { useEffect } from 'react';
import * as THREE from 'three';


const SceneInit = () => {

    //THREE.JS
    useEffect(() => {
      //----- SCENE -----
      const scene = new THREE.Scene();
  
  
      //----- CAMERA -----
      const camera = new THREE.PerspectiveCamera(
          50,
          window.innerWidth / window.innerHeight,
          1,
          1000
      );
      camera.position.z = 96;
      
  
      //----- RENDERER -----
      const canvas = document.getElementById('webgl');
      const renderer =  new THREE.WebGLRenderer({
        canvas,
        antialias: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

  
      //----- LIGHTS -----
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      ambientLight.castShadow = true;
      scene.add(ambientLight);
  
  
      //----- ANIMATE -----
      const animate = () => {
        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
      };
      animate();
  
    }, []);

  return (
      <div>
        <canvas id='webgl'></canvas>
      </div>
  )
}

export default SceneInit