<template>
  <div class="container" ref="container"></div>
</template>
<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
// 获取dom
let container = ref(null);
let camera = null;
// 设置相机函数
let setCamera = (container) => {
  // 设置相机
  camera = new THREE.PerspectiveCamera(
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 0.1;
};
// 设置渲染器
let renderer = new THREE.WebGLRenderer();
let setRenderer = (container) => {
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};
// 设置场景
let scene = new THREE.Scene();
// 创建球体，并设置全景图
let myGeometry = new THREE.SphereBufferGeometry(40, 30, 30);
// 对球体进行翻转，为了把贴图贴在里面
myGeometry.scale(-1, 1, 1);
let myLoader = new THREE.TextureLoader();
let myTexture = myLoader.load("../images/image/img129.jpg");
let myMaterial = new THREE.MeshBasicMaterial({ map: myTexture });
let sphereMesh = new THREE.Mesh(myGeometry, myMaterial);
scene.add(sphereMesh);
// 设置控制器
let orbitControl = null;
let setOrbControl = (camera, container) => {
  orbitControl = new OrbitControls(camera, container.value);
  orbitControl.enableDamping = true;
};
// 设置render函数
let render = () => {
  orbitControl.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};
// 监听窗口变化函数
let listenerResize = (container, camera) => {
  window.addEventListener("resize", () => {
    setRenderer(container);
    camera.aspect = container.value.clientWidth / container.value.clientHeight;
    camera.updateProjectionMatrix();
  });
};
// 监听双击，渲染器窗口全屏
let listenerFullScreen = (renderer) => {
  window.addEventListener("dblclick", () => {
    renderer.domElement.requestFullscreen();
  });
};
// 挂载后执行
onMounted(() => {
  // 设置相机
  setCamera(container);
  // 设置渲染器
  setRenderer(container);
  setOrbControl(camera, container);
  // 为容器中添加渲染器
  container.value.appendChild(renderer.domElement);
  // 监听窗口大小变化，重置属性
  listenerResize(container, camera);
  listenerFullScreen(renderer);
  render();
});
onBeforeUnmount(() => {
  // window.removeEventListener("resize");
  // window.removeEventListener("dblclick");
});
</script>
<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
}
</style>
