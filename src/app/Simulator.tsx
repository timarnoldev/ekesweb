import {EvolutionsSimulator} from "@/backend/EvolutionsSimulator";
import React, {useEffect, useRef, useState} from "react";
import {animate, register} from "@/three/Rendering";

import {PauseButton} from "@/components/pause-button";
import {
    AlertDialog,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {LoadingSpinner} from "@/components/ui/LoadingSpinner";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {Creature} from "@/backend/actors/Creature";
import {CreatureDetails} from "@/components/CreatureDetails";
import {doSimulationStep} from "@/lib/SimulationControler";
import {SingleStepButton} from "@/components/SingleStepButton";
import Diagrams from "@/components/Diagrams";
import {ConditionalRenderingDialog} from "@/components/ConditionalRenderingDialog";
import {ThemeSelector} from "@/components/ThemeSelector";
import {HelpDialog} from "@/components/HelpDialog";
import {ParameterEditor} from "@/components/ParameterEditor";
import {CurrentSimulationStats} from "@/components/CurrentSimulationStats";

function BenchmarkUI(props: { open: boolean }) {
    return <AlertDialog open={props.open}>

        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    <div className="flex flex-row"><span>Benchmark</span>
                        <div className="w-2"></div>
                        <LoadingSpinner></LoadingSpinner></div>
                </AlertDialogTitle>
                <AlertDialogDescription>
                    Please wait while the benchmark is running to check the performance
                    of the system. This is important to ensure that the simulation runs smoothly.


                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>

            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>;
}



export default function Simulator() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [isBenchmarkRunning, setIsBenchmarkRunning] = useState(true);
    const [intervalID, setIntervalID] = useState<NodeJS.Timeout | null>(null);
    const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
    const [evoSim, setEvoSim] = useState<EvolutionsSimulator | null>(null);

    function toggleSimulation() {
        if (intervalID) {
            clearInterval(intervalID);
            setIntervalID(null);
        } else {
            startSimulation(evoSim!);
        }
    }



    function startSimulation(simulator: EvolutionsSimulator) {
        const intervalID = setInterval(() => {
            console.time();
            doSimulationStep(simulator);
            console.timeEnd();
        }, 7);

        setIntervalID(intervalID);
    }

    function registerSimulation():EvolutionsSimulator {
        const evosim: EvolutionsSimulator = new EvolutionsSimulator();

        setEvoSim(evosim);
        register(canvasRef.current!, setSelectedCreature, evosim);


        requestAnimationFrame(function render() {
            requestAnimationFrame(render);

            animate();

        });

        return evosim;
    }

    useEffect(() => {


        const worker = new Worker(new URL("@/backend/Benchmark", import.meta.url), {type: 'module'});
        worker.onmessage = (event) => {
            const data = event.data;
            console.log(data);
            setIsBenchmarkRunning(false);
            const simulator = registerSimulation();

            startSimulation(simulator);
        };


    }, []);


    return (
        <>
            <BenchmarkUI open={isBenchmarkRunning}></BenchmarkUI>
            <div className="flex flex-row h-svh gap-2 m-2">
                <div className="basis-1/4 ">
                    <Card className={"max-h-[95%] h-fit overflow-y-auto"}>
                        <CardHeader>
                            <CardTitle>EKES Evolution Simulation</CardTitle>
                            <div className={"mt-4"}/>
                            <CardDescription>Controls</CardDescription>
                            <div className="flex flex-row gap-2">
                                <PauseButton toggle={toggleSimulation}/>
                                <SingleStepButton onClick={() => doSimulationStep(evoSim!)}
                                                  disabled={intervalID != null}></SingleStepButton>
                                <HelpDialog/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CurrentSimulationStats evosim={evoSim}></CurrentSimulationStats>
                            <Diagrams evoSim={evoSim}></Diagrams>
                            <div className={"flex flex-row gap-2 items-center mt-4"}>
                                <ThemeSelector/>
                                <ConditionalRenderingDialog/></div>

                        </CardContent>

                    </Card>

                </div>
                <div className="basis-2/4 overflow-hidden flex flex-col justify-start gap-2">
                    <Card className=" h-fit">
                        <div className="h-full w-full p-2">
                            <div className="h-full w-full rounded-md overflow-hidden">
                                <canvas ref={canvasRef} className="w-full h-full "></canvas>
                            </div>
                        </div>
                    </Card>
                    <Card className="flex flex-row w-full">
                        <CreatureDetails creature={selectedCreature} selectionCallback={(creature) => {
                            setSelectedCreature(creature);
                            evoSim!.selectedCreature = creature;
                            if (creature == null) {
                                evoSim!.followSelected = false;
                            }
                            doSimulationStep(evoSim!);
                        }} evosim={evoSim} followCallback={() => evoSim!.followSelected = true}></CreatureDetails>
                    </Card>
                </div>
                <div className="basis-1/4">
                    <ParameterEditor evosim={evoSim}></ParameterEditor>
                </div>
            </div>
        </>
    );
}
