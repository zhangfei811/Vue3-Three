<template>
  <div class="container" ref="container"></div>
</template>
<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as d3 from "d3";
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
// 定义颜色集合数组
// const COLOR_ARR = ["#0465BD", "#357bcb", "#3a7abd"];
const COLOR_ARR = ["#37A4CD", "#7CB0CF", "#95BED7"];
// 获取中国地图数据
let geoJsonData = require("../../public/geoJson/china1.json");
// 获取墨卡托投影转换函数
let getProjection = ({
  center = [104.0, 37.5],
  scale = 80,
  translate = [0, 0],
} = {}) => {
  return d3.geoMercator().center(center).scale(scale).translate(translate);
};
// 获取dom
let container = ref(null);
/** 相机相关 */
let camera = null;
// 设置相机函数
let setCamera = (container) => {
  // 设置相机
  camera = new THREE.PerspectiveCamera(
    75,
    container.value.clientWidth / container.value.clientHeight,
    0.1,
    5000
  );
  camera.position.set(0, -40, 70);
  camera.lookAt(0, 0, 0);
};
/** 渲染器相关 */
// 设置渲染器
let renderer = new THREE.WebGLRenderer();
let setRenderer = (container) => {
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xffffff, 0);
};
// 设置场景
let scene = new THREE.Scene();
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
/**此处为编写业务逻辑相关代码start */
let initMap = (geoJsonData) => {
  // 定义三维地图对象
  let map = new THREE.Object3D();
  console.log(geoJsonData);
  geoJsonData.features.forEach((elem, index) => {
    // 定一个省份3D对象
    let province = new THREE.Object3D();
    // 当前省份的坐标
    let coordinates = elem.geometry.coordinates;
    let currentColor = COLOR_ARR[index % COLOR_ARR.length];
    coordinates.forEach((multiPolygon) => {
      multiPolygon.forEach((polygon) => {
        let shape = new THREE.Shape();
        for (let i = 0; i < polygon.length; i++) {
          let [x, y] = getProjection()(polygon[i]);
          if (i === 0) {
            shape.moveTo(x, -y);
          }
          shape.lineTo(x, -y);
        }
        const extrudeSettings = {
          depth: 4,
          bevelEnabled: true,
          bevelSegments: 1,
          bevelThickness: 0.2,
        };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        // const material = new THREE.MeshStandardMaterial({
        //   // clearcoat: 3.0,
        //   metalness: 1,
        //   color: currentColor,
        // });
        // const material1 = new THREE.MeshStandardMaterial({
        //   // clearcoat: 3.0,
        //   metalness: 1,
        //   roughness: 1,
        //   color: currentColor,
        // });
        const material = new THREE.MeshBasicMaterial({ color: currentColor });
        const mesh = new THREE.Mesh(geometry, material);
        // const mesh = new THREE.Mesh(geometry, [material, material1]);
        // mesh.castShadow = true;
        // mesh.receiveShadow = true;
        mesh._color = currentColor;
        province.add(mesh);
      });
    });
    province.properties = elem.properties;
    if (elem.properties.centorid) {
      const [x, y] = getProjection()(elem.properties.centorid);
      province.properties._centroid = [x, y];
    }
    // console.log(elem, index);
    map.add(province);
  });
  return map;
};
let createPlayGround = () => {
  const geometry = new THREE.PlaneGeometry(2000, 2000, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0x031837,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = 0;
  return mesh;
};
/**此处为编写业务逻辑相关代码end */
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
  let planGround = createPlayGround();
  let map = initMap(geoJsonData);
  scene.add(planGround);
  scene.add(map);
  // let mesh = testInit();
  // scene.add(mesh);
  render();
});
// onBeforeUnmount(() => {
//   window.removeEventListener("resize");
//   window.removeEventListener("dblclick");
// });
</script>
<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
}
</style>
