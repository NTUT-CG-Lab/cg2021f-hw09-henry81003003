import * as THREE from "../threejs/build/three.module.js";
import { MarchingCubes } from '../threejs/examples/jsm/objects/MarchingCubes.js'
import { OrbitControls } from '../threejs/examples/jsm/controls/OrbitControls.js'

class threejsViewer {
    constructor(domElement) {
        this.size = 0
        this.databuffer = null
        this.textureOption = 0
        this.threshold = 75
        this.enableLine = false

        let width = domElement.clientWidth;
        let height = domElement.clientHeight;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0xE6E6FA, 1.0)
        domElement.appendChild(this.renderer.domElement);

        // Scene
        this.scene = new THREE.Scene();

        // Camera
        let aspect = window.innerWidth / window.innerHeight;

        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 50);
        this.camera.position.set(2, 1, 2)
        this.scene.add(this.camera)

        // Light
        let directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(2, 1, 2)   
        this.scene.add(directionalLight)

        // Controller
        let controller = new OrbitControls(this.camera, this.renderer.domElement)
        controller.target.set(0, 0.5, 0)
        controller.update()
        
        //Axis Landmark
        const axesHelper = new THREE.AxesHelper(100)
        this.scene.add(axesHelper)

        // Ground
        const plane = new THREE.Mesh(
            new THREE.CircleGeometry(2, 30),
            new THREE.MeshPhongMaterial({ color: 0xbbddff, opacity:0.4, transparent: true })
        );
        plane.rotation.x = - Math.PI / 2;
        this.scene.add(plane);

        let scope = this
        this.renderScene = function () {
            requestAnimationFrame(scope.renderScene)
            scope.renderer.render(scope.scene, scope.camera);
        }

        //視窗變動時 ，更新畫布大小以及相機(投影矩陣)繪製的比例
        window.addEventListener('resize', () => {
            //update render canvas size
            let width = domElement.clientWidth
            let height = domElement.clientHeight
            this.renderer.setSize(width, height);

            //update camera project aspect
            this.camera.aspect = width / height
            this.camera.updateProjectionMatrix();
        })

        let mesh = null;
        this.loadData = () => {
            if (mesh != undefined) {
                this.scene.remove(mesh);
            }

            mesh = new MarchingCubes(this.size);
            if (this.textureOption == 0) {
                mesh.material = new THREE.MeshPhongMaterial({color : 0x00ff00});
            }
            else if (this.textureOption == 1){
                mesh.material = new THREE.MeshToonMaterial({color : 0x00ff00});
            }
            else if (this.textureOption == 2){
                mesh.material = new THREE.MeshNormalMaterial();
            }

            mesh.isolation = this.threshold;
            mesh.field = this.databuffer;
            mesh.position.set(0, 1, 0);

            this.scene.add(mesh);
        }

        // this.updateModel = () => {
        //     let mesh = this.scene.getObjectByName('mesh');

        //     if (mesh === null || mesh === undefined) {
        //         this.mesh = new MarchingCubes(this.size);
        //         this.mesh.name = 'mesh';
                
        //         if (this.textureOption == 0) {
        //             this.mesh.material = new THREE.MeshPhongMaterial({color : 0x00ff00});
        //         }
        //         else if (this.textureOption == 1){
        //             this.mesh.material = new THREE.MeshToonMaterial({color : 0x00ff00});
        //         }
        //         else if (this.textureOption == 2){
        //             this.mesh.material = new THREE.MeshNormalMaterial();
        //         }

        //         this.mesh.isolation = this.threshold;
        //         this.mesh.field = this.databuffer;
        //         this.mesh.position.set(0, 1, 0);
                
        //         this.scene.add(this.mesh);
        //         return this.mesh;
        //     }

        //     else {
        //         mesh.isolation = this.threshold;
        //         mesh.field = this.databuffer;
        //         mesh.position.set(0, 1, 0);
        //     }
        // }

        this.changeTexture = (choice) => {
            this.textureOption = choice;
        }

        this.download = () => {
            let geometry = mesh.generateGeometry();
            let mesh2 = new THREE.Mesh(geometry);
            return mesh2;
        }

        this.renderScene()
    }
}

export {
    threejsViewer
}
