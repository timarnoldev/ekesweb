import {EvolutionsSimulator} from "@/backend/EvolutionsSimulator";
import {useEffect, useRef} from "react";
import {actormesh, animate, aspect, register, updateData, worldmesh} from "@/three/Rendering";
import * as THREE from 'three';
import {gen_color_table, rgbToHex} from "@/backend/utils/ColorUtils";
import {LandType} from "@/backend/virtualtileworld/LandType";
import { Button } from "@/components/ui/button"
import {PauseButton} from "@/components/pause-button";

export default function Simulator() {

    const canvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(() => {
        register(canvasRef.current!);




        let evosim: EvolutionsSimulator = new EvolutionsSimulator();
        setInterval(() => {
            console.time();
            evosim.doStep();
            updateData(evosim);
            console.timeEnd();
        }, 11);




      requestAnimationFrame(function render() {
            requestAnimationFrame(render);

          animate();

      });



  }, []);



    return (
        <div className="flex flex-row h-svh">
            <div className="basis-1/4 ">
                <Button>Click me</Button>

            </div>
            <div className="basis-2/4">
                <PauseButton/>
                <canvas ref={canvasRef} className="w-full h-full" ></canvas>
            </div>
            <div className="basis-1/4"></div>
        </div>
    );
}
