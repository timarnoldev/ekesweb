import {EvolutionsSimulator} from "@/backend/EvolutionsSimulator";
import {useEffect, useRef} from "react";
import {actormesh, animate, height, register, width, worldmesh} from "@/three/Rendering";
import * as THREE from 'three';
import {gen_color_table, rgbToHex} from "@/backend/utils/ColorUtils";
import {LandType} from "@/backend/virtualtileworld/LandType";

export default function Simulator() {

    const canvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(() => {
        const actormatrix = new THREE.Matrix4();
        const matrix = new THREE.Matrix4();
        const color = new THREE.Color();

        register(canvasRef.current!);


      let evosim: EvolutionsSimulator = new EvolutionsSimulator();
      setInterval(() => {
          console.time();
          evosim.doStep();
          console.log(evosim.time.year);


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
                  actormatrix.setPosition((-width/2)+currentActor.getXPosition(),(-height/2+1)+currentActor.getYPosition(),1);
                  actormesh.setMatrixAt(i,actormatrix);

                  actormesh.setColorAt(i, color.setHex(gen_color_table[currentActor.getGeneration() % 16]));

                  /*if((currentActor.generation%10) <=10 ){
                      actormesh.setColorAt(i,color.setRGB(Math.floor((1 - (currentActor.generation%10) / 10) * 255)/255,Math.floor((currentActor.generation%10) / 10 * 255)/255,0));
                  }else{
                        actormesh.setColorAt(i,color.setRGB(1,1,1));
                  }

                   */

              }else{
                  actormatrix.setPosition(100,100, 0);
                  actormesh.setMatrixAt(i,actormatrix);
              }
          }

          actormesh.updateMatrix();
          actormesh.instanceMatrix.needsUpdate = true;
          actormesh.instanceColor!.needsUpdate = true;

          console.timeEnd();
      }, 11);


      requestAnimationFrame(function render() {
            requestAnimationFrame(render);

          animate();

      });



  }, []);



    return (
        <div className="flex flex-row h-svh">
            <div className="basis-1/4 "></div>
            <div className="basis-2/4">
                <canvas ref={canvasRef} className="w-full" width="1200" height="800"></canvas>
            </div>
            <div className="basis-1/4"></div>
        </div>
    );
}
