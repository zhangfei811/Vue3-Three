<template>
  <div class="container" ref="container"></div>
</template>
<script setup>
import * as THREE from "three";
import { CSM } from "three/addons/csm/CSM.js";
import { CSMHelper } from "three/addons/csm/CSMHelper.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
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
let labelRenderer = new CSS2DRenderer();
let setLabelRenderer = (container) => {
  labelRenderer.setSize(
    container.value.clientWidth,
    container.value.clientHeight
  );
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
};
// 设置场景
let scene = new THREE.Scene();
// 设置控制器
let orbitControl = null;
let setOrbControl = (camera, container) => {
  orbitControl = new OrbitControls(camera, container.value);
  orbitControl.enableDamping = true;
};
// 设置灯光
let setLight = (scene) => {
  // 设置环境光
  let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
  // 设置平行光
  let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(20, -50, 20);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  scene.add(directionalLight);
  // 设置半球光
  let hemisphereLight = new THREE.HemisphereLight("#80edff", "#75baff", 0.3);
  hemisphereLight.position.set(20, -50, 0);
  scene.add(hemisphereLight);
  // 设置点光源
  let pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.set(20, -50, 50);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 1024;
  pointLight.shadow.mapSize.height = 1024;
  scene.add(pointLight);
  let pointLight2 = new THREE.PointLight(0xffffff, 0.5);
  pointLight2.position.set(50, -50, 20);
  pointLight2.castShadow = true;
  pointLight2.shadow.mapSize.width = 1024;
  pointLight2.shadow.mapSize.height = 1024;
  scene.add(pointLight2);
  let pointLight3 = new THREE.PointLight(0xffffff, 0.5);
  pointLight3.position.set(-50, -50, 20);
  pointLight3.castShadow = true;
  pointLight3.shadow.mapSize.width = 1024;
  pointLight3.shadow.mapSize.height = 1024;
  scene.add(pointLight3);
};
// 级联阴影映射
let csmObj = null;
let createCSM = (scene, camera) => {
  const shadowConfig = {
    maxFar: 1000,
    cascades: 4,
    mode: "practical",
    parent: scene,
    shadowMapSize: 1024,
    lightDirection: new THREE.Vector3(-1, -1, -1).normalize(),
    camera: camera,
  };
  csmObj = new CSM(shadowConfig);
  let csmHelper = new CSMHelper(csmObj);
  csmHelper.visible = false;
  scene.add(csmHelper);
};
// 设置render函数
let render = () => {
  orbitControl.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  csmObj.update();
  requestAnimationFrame(render);
};
// 监听窗口变化函数
let listenerResize = (container, camera) => {
  window.addEventListener("resize", () => {
    setRenderer(container);
    setLabelRenderer(container);
    camera.aspect = container.value.clientWidth / container.value.clientHeight;
    camera.updateProjectionMatrix();
  });
};
// 监听双击，渲染器窗口全屏
let listenerFullScreen = (renderer, labelRenderer) => {
  window.addEventListener("dblclick", () => {
    renderer.domElement.requestFullscreen();
    labelRenderer.domElement.requestFullscreen();
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
    if (elem.properties.centroid) {
      const [x, y] = getProjection()(elem.properties.centroid);
      province.properties._centroid = [x, -y];
      let provinceLabel = createProvinceLabel(
        elem.properties.name,
        province.properties._centroid,
        5
      );
      province.add(provinceLabel);
    }
    // console.log(elem, index);
    map.add(province);
  });
  return map;
};
let createProvinceLabel = (name, point, depth) => {
  const provinceDiv = document.createElement("div");
  provinceDiv.className = "label";
  provinceDiv.textContent = name;
  provinceDiv.style.backgroundColor = "transparent";
  const provinceLabel = new CSS2DObject(provinceDiv);
  provinceLabel.position.set(point[0], point[1], depth);
  return provinceLabel;
};
let createPlayGround = () => {
  const geometry = new THREE.PlaneGeometry(2000, 2000, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x2b5269,
    side: THREE.DoubleSide,
  });
  // const material = new THREE.MeshBasicMaterial({
  //   color: 0x2b5269,
  //   side: THREE.DoubleSide,
  // });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = 0;
  mesh.receiveShadow = true;
  return mesh;
};
/**此处为编写业务逻辑相关代码end */
// 挂载后执行
onMounted(() => {
  // 设置相机
  setCamera(container);
  // 设置渲染器
  setRenderer(container);
  setLabelRenderer(container);
  setOrbControl(camera, container);
  // 为容器中添加渲染器
  container.value.appendChild(renderer.domElement);
  container.value.appendChild(labelRenderer.domElement);
  // 监听窗口大小变化，重置属性
  listenerResize(container, camera);
  listenerFullScreen(renderer, labelRenderer);
  let planGround = createPlayGround();
  let map = initMap(geoJsonData);
  scene.add(planGround);
  scene.add(map);
  setLight(scene);
  createCSM(scene, camera);
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
.label {
  color: #fff;
  font-family: sans-serif;
  padding: 2px;
  background: rgba(0, 0, 0, 0.6);
}
</style>
