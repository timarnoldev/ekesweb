"use client";
import * as THREE from 'three';
import {WebGLRenderer,  Scene, InstancedMesh, Camera} from "three";
import { MapControls } from 'three/addons/controls/MapControls.js';
import {EvolutionsSimulator} from "@/backend/EvolutionsSimulator";
import {LandType} from "@/backend/virtualtileworld/LandType";
import {gen_color_table} from "@/backend/utils/ColorUtils";

let scene:Scene;
let camera:Camera;
let renderer:WebGLRenderer;
let controls:MapControls;
export let worldmesh:InstancedMesh;
export let actormesh:InstancedMesh;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2( 1, 1 );

export let aspect = 1.5;

const color = new THREE.Color();
const matrix = new THREE.Matrix4();


export function register(canvas:HTMLCanvasElement) {

    scene = new THREE.Scene();

    raycaster.params.Line.threshold

    camera = new THREE.OrthographicCamera(-1.5, 1.5, 1, -1); //width / - 2, width / 2, height / 2, height / - 2, 0.1, 2000

    renderer = new THREE.WebGLRenderer( { canvas });
    renderer.setClearColor(new THREE.Color('#14002b'),1);

    camera.position.z = 5;
    controls = new MapControls( camera, renderer.domElement );
    //controls.enableRotate = false;
    controls.screenSpacePanning = true;

    //calculate height to fit aspect ratio of 1,5
    let newheight = canvas.clientWidth/1.5;
    renderer.setSize( canvas.clientWidth, newheight);



    var material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
    const geometry = new THREE.PlaneGeometry((aspect*2)/150,2/100,1); //0.045,50
    worldmesh = new THREE.InstancedMesh( geometry, material, 15000 );

    var actormaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF } );
    const actorgeometry = new THREE.CylinderGeometry( 0.006,0.006, 1 );
    actorgeometry.rotateX( Math.PI / 2 );
    actormesh = new THREE.InstancedMesh(actorgeometry,actormaterial,1200);
    actormesh.frustumCulled = false;

    actormesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage );

    var i=0;
    for(var x=0;x<150;x++) {

        for(var y=0;y<100;y++) {

            // worldtils[x][y] = new THREE.Mesh( geometry, material );
            matrix.setPosition((x*aspect*2/150)+(aspect*2)/150-aspect,(y*2/100)+2/100-1,1);
            //matrix.setPosition( x/150, y/100, 1 );

            worldmesh.setMatrixAt( i, matrix );
            worldmesh.setColorAt( i, color );



            i++;

            // worldtils[x][y].position.x = -width/2+(width/150)/2+x*width/150;
            // worldtils[x][y].position.y = -height/2+(height/100)/2+y*height/100;
            // scene.add(worldtils[x][y]);
        }
    }

    for(var z=0;z<1200;z++) {

        matrix.setPosition( 100,100, 1);

        actormesh.setMatrixAt(z, matrix );
        actormesh.setColorAt( z, color );

    }

    scene.add(actormesh);
    scene.add(worldmesh);




    window.addEventListener("resize", () => {
        let newheight = canvas.parentElement!.clientWidth/1.5;
        camera.updateMatrix();
        renderer.setSize( canvas.parentElement!.clientWidth, newheight);
        canvas.width = canvas.parentElement!.clientWidth;
        canvas.height = newheight;

    });

    canvas.addEventListener("mousemove", (event) => {
        event.preventDefault();
        let rect = canvas.getBoundingClientRect();
        mouse.x = ( (event.clientX - rect.left) / rect.width ) * 2 - 1;
        mouse.y = - ( (event.clientY - rect.top) / rect.height ) * 2 + 1;
    });





}
const actormatrix = new THREE.Matrix4();

export function updateData(evosim:EvolutionsSimulator) {
    let i =0;
    for(let x=0;x<evosim.getWorld().getWidth();x++) {
        for(let y=0;y<evosim.getWorld().getHeight();y++) {
            let tile = evosim.getWorld().getTile(x,y);
            if(tile.getLandType()===LandType.WATER) {
                worldmesh.setColorAt(i,color.setHex(0x14002b));
            }else{
                worldmesh.setColorAt(i,color.setRGB( Math.floor((1 - tile.getFoodValue()) * 255)/255,191/255,15/255));
            }

            i++;
        }
    }

    worldmesh.instanceColor!.needsUpdate = true;

    for(let i=0;i<1200;i++) {
        if(i < evosim.getActorManager().getActors().length) {
            let currentActor = evosim.getActorManager().getActors()[i];
            actormatrix.setPosition(currentActor.getXPosition()/1500*2*aspect-aspect+0.006 ,currentActor.getYPosition()/1000*2-1+0.006,1.1);
            actormesh.setMatrixAt(i,actormatrix);
            actormesh.setColorAt(i, color.setHex(gen_color_table[currentActor.getGeneration() % 16]));


        }else{
            actormatrix.setPosition(100,100, 1);
            actormesh.setMatrixAt(i,actormatrix);
        }
    }

    actormesh.updateMatrix();
    actormesh.instanceMatrix.needsUpdate = true;
    actormesh.instanceColor!.needsUpdate = true;
}

export function animate() {

    controls.update();
    raycaster.setFromCamera(mouse, camera);
    const intersection = raycaster.intersectObject( actormesh );
    if ( intersection.length > 0 ) {
        console.log("found one!");

        const instanceId = intersection[ 0 ].instanceId;

        actormesh.setColorAt( instanceId!, color.setHex( 0xffffff ) );

        actormesh.instanceColor!.needsUpdate = true;



    }
    renderer.render( scene, camera );

}