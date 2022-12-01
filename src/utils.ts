import {
  // scene
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  sRGBEncoding,
  ACESFilmicToneMapping,
  PCFSoftShadowMap,
  // lights
  DirectionalLight,
  HemisphereLight,
  // loader
  Object3D,
  Event
} from "three";

import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export const createScene = () => {
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  camera.position.set(2, 1, 2);

  scene.add(camera);

  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });

  renderer.outputEncoding = sRGBEncoding;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });

  return { renderer, scene, camera };
};

export const addLights = (scene) => {
  const directionalLight = new DirectionalLight(0xffffff, 0.2);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const skyColor = 0xb1e1ff; // light blue
  const groundColor = 0xb97a20; // brownish orange
  const hemisphereLight = new HemisphereLight(skyColor, groundColor, 0.5);
  scene.add(hemisphereLight);
};

export const loadFbx = (path: string, container: Object3D<Event>) => {
  const fbxLoader = new FBXLoader();
  fbxLoader.load(
    path,
    (object) => {
      object.traverse(function (child) {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      object.scale.set(0.01, 0.01, 0.01);

      container.add(object);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.log(error);
    }
  );
};

export const loadFbxAsync = async (path: string) => {
  try {
    const fbxLoader = new FBXLoader();
    const object = await fbxLoader.loadAsync(path);

    object.traverse(function (child) {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    object.scale.set(0.01, 0.01, 0.01);
    return object;
  } catch (error) {
    console.log(error);
  }
};

export const round2 = (num: number) => {
  return parseFloat(num.toFixed(2));
};
