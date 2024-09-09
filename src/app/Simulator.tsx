import {EvolutionsSimulator} from "@/backend/EvolutionsSimulator";
import {useEffect, useRef, useState} from "react";
import {animate, register, updateData} from "@/three/Rendering";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"
import {PauseButton} from "@/components/pause-button";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {LoadingSpinner} from "@/components/ui/LoadingSpinner";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {MoonIcon, SunIcon} from "lucide-react";
import {useTheme} from "next-themes";

function BenchmarkUI(props: {open: boolean}) {
    return <AlertDialog open={props.open}>

        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    <div className="flex flex-row"><span>Benchmark</span><div className="w-2"></div><LoadingSpinner></LoadingSpinner></div>
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
    const [intervalID, setIntervalID] = useState< NodeJS.Timeout | null>(null);



    function startSimulation() {
        let evosim: EvolutionsSimulator = new EvolutionsSimulator();
        let intervalID = setInterval(() => {
            //console.time();
            evosim.doStep();
            updateData(evosim);
            //console.timeEnd();
        }, 11);

        setIntervalID(intervalID);


        requestAnimationFrame(function render() {
            requestAnimationFrame(render);

            animate();

        });
    }

    useEffect(() => {

        register(canvasRef.current!);

        const worker = new Worker(new URL("@/backend/Benchmark", import.meta.url), {type: 'module'});
        worker.onmessage = (event) => {
            let data = event.data;
            console.log(data);
            setIsBenchmarkRunning(false);
            startSimulation();
        };





    }, []);

    const { setTheme } = useTheme()

    return (
        <>
            <BenchmarkUI open={isBenchmarkRunning}></BenchmarkUI>
            <div className="flex flex-row h-svh">
                <div className="basis-1/4 ">
                    <Card>
                        <CardHeader>
                            <CardTitle>Simulation</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                            <PauseButton/>

                        </CardHeader>
                        <CardContent>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                        <span className="sr-only">Toggle theme</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setTheme("light")}>
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                                        Dark
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("system")}>
                                        System
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardContent>
                        <CardFooter>
                            <p>Card Footer</p>
                        </CardFooter>
                    </Card>

                </div>
                <div className="basis-2/4 overflow-hidden flex flex-col justify-start">
                    <canvas ref={canvasRef} className="w-full h-full"></canvas>
                </div>
                <div className="basis-1/4"></div>
            </div>
        </>
    );
}
