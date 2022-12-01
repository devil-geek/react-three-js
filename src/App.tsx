import { useLayoutEffect, useRef } from "react";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Object3D,
  Event,
  PCFSoftShadowMap
} from "three";
import { addLights, createScene, loadFbxAsync, round2 } from "./utils";
import {
  AiOutlineRotateRight,
  AiOutlineRotateLeft,
  AiOutlineZoomIn,
  AiOutlineZoomOut
} from "react-icons/ai";
import "./styles.css";

const animateRotation = (element: Object3D<Event>, rotation: number) => {
  const radRotation = (rotation * Math.PI) / 180;
  if (round2(element.rotation.y) === round2(radRotation)) {
    return;
  }
  if (element.rotation.y < radRotation) {
    element.rotation.y += 0.01;
  } else {
    element.rotation.y -= 0.01;
  }
};

export default function App() {
  let rotation = 0;
  let zoom = 1;

  const canvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<WebGLRenderer>();
  const containerRef = useRef<Object3D<Event>>();
  const cameraRef = useRef<PerspectiveCamera>();
  const sceneRef = useRef<Scene>();

  useLayoutEffect(() => {
    const { renderer, scene, camera } = createScene();
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    addLights(scene);

    const container = new Object3D();

    loadFbxAsync("/three_js_scene_fbx.fbx").then((group) => {
      if (group) {
        // use container a a wrapper and center point of view
        container.position.set(0, 0, 0);
        container.add(group);

        group.position.set(0, -0.4, 0);
        scene.add(container);
        camera.lookAt(container.position);
        containerRef.current = container;
      }
    });

    const renderEl = canvasRef.current;
    renderEl?.appendChild(renderer.domElement);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onResize, false);

    const animate = () => {
      animateRotation(container, rotation);
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    return () => {
      renderEl?.removeChild(renderer.domElement);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const rotateRight = () => {
    if (containerRef?.current) {
      rotation -= 45;
    }
  };

  const rotateLeft = () => {
    if (containerRef?.current) {
      rotation += 45;
    }
  };

  const setZoom = () => {
    if (cameraRef?.current) {
      cameraRef.current.zoom = zoom;
      cameraRef.current.updateProjectionMatrix();
    }
  };
  const zoomIn = () => {
    if (zoom < 2) {
      zoom += 0.5;
      setZoom();
    }
  };

  const zoomOut = () => {
    if (zoom > 0.5) {
      zoom -= 0.5;
      setZoom();
    }
  };

  return (
    <div className="App" ref={canvasRef}>
      <div className="controls">
        <button className="btn" onClick={rotateLeft}>
          <AiOutlineRotateLeft />
        </button>
        <button className="btn" onClick={zoomOut}>
          <AiOutlineZoomOut />
        </button>
        <button className="btn" onClick={zoomIn}>
          <AiOutlineZoomIn />
        </button>
        <button className="btn" onClick={rotateRight}>
          <AiOutlineRotateRight />
        </button>
      </div>
    </div>
  );
}
