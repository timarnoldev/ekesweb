import {Creature} from "@/backend/actors/Creature";
import {CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {useEffect, useState} from "react";
import KillButton from "@/components/KillButton";
import {Button} from "@/components/ui/button";
import {Cake, Focus, ShieldCheck, X, Zap} from "lucide-react";
import {EvolutionsSimulator} from "@/backend/EvolutionsSimulator";
import {doSimulationStep} from "@/lib/SimulationControler";
import {Toggle} from "@/components/ui/toggle";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";




export function CreatureDetails(props: {
    creature: Creature | null,
    selectionCallback: (creature: Creature | null) => void,
    followCallback: () => void,
    evosim: EvolutionsSimulator | null
}) {
    const [render, rerender] = useState(false);


    useEffect(() => {
        let listener = () => {
            rerender(!render);
        };
        document.addEventListener("simulationUpdate", listener);

        return () => {
            document.removeEventListener("simulationUpdate", listener);
        }
    })


    if (!props.creature) {
        return <CardHeader className=" overflow-x-auto w-full" >
            <CardTitle>Creature Details</CardTitle>
            <div className="gap-2 flex flex-col">Select a creature to get details by using one of the
                buttons or by clicking on a creature.<SelectionButtons selectionCallback={props.selectionCallback}
                                                                 evoSim={props.evosim!}/></div>
        </CardHeader>
    } else {
        return <CardHeader className="w-full ">
            <CardTitle className="flex flex-row justify-between">
                <div className="flex flex-row gap-2">
                    Creature Details
                    <AliveText creature={props.creature}/>
                </div>
                <X className="cursor-pointer" onClick={() => props.selectionCallback(null)}/>
            </CardTitle>
            <CardDescription>
                <ul className="list-disc pl-4 pt-2">
                    <li>Age: {props.creature.age.toFixed(2)}</li>
                    <li>Energy: {(props.creature.getEnergy() - 100).toFixed(2)} </li>
                    <li>Generation: {props.creature.generation}</li>
                    <li>Children: {props.creature.childrenCount}</li>
                    <li>Walk Distance: {props.creature.distanceMoved.toFixed(2)}</li>
                </ul>

                <div className="flex w-full justify-end gap-2">
                    {/*<ToggleFollowSelected creature={props.creature} onPressedChange={()=>{props.followCallback()}}/>*/}
                    <ToggleInvincibility creature={props.creature}/>


                    <AddChilds creature={props.creature}/>
                    <AddEnergy creature={props.creature}/>

                    <KillButton creature={props.creature}/>
                </div>
            </CardDescription>
        </CardHeader>
    }


}

function ToggleInvincibility(props: { creature: Creature }) {
    const [pressed, setPressed] = useState(props.creature.invincible);
    return <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
                <Toggle pressed={pressed} variant="default" disabled={props.creature.killed} className="data-[state=on]:bg-green-400"
                        aria-label="Toggle"
                        onPressedChange={(pressed)=>{setPressed(pressed); props.creature.invincible = pressed; doSimulationStep(props.creature!.es!);}}>
                    <ShieldCheck className="h-4 w-4"/>
                </Toggle></TooltipTrigger>
            <TooltipContent>
                <p>Invincible</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>;
}

function ToggleFollowSelected(props: { creature: Creature, onPressedChange: () => void }) {
    return <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
                <Toggle variant="default" disabled={props.creature.killed} className="data-[state=on]:bg-green-400"
                        aria-label="Toggle"
                        onPressedChange={props.onPressedChange}>
                    <Focus className="h-4 w-4"/>
                </Toggle></TooltipTrigger>
            <TooltipContent>
                <p>Follow Creature</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>;
}

function AddEnergy(props: { creature: Creature }) {
    return <Button className="flex flex-row gap-2" onClick={() => {

        if(props.creature.energy<100) {
            props.creature.energy = 100;
            props.creature.age = 1;
        }
        props.creature.energy += 100;

        doSimulationStep(props.creature.es!);
    }}
                   disabled={props.creature!.killed}><Zap/>+</Button>;
}


function AddChilds(props: { creature: Creature }) {
    return <Button className="flex flex-row gap-2"
                   onClick={() => {
                       props.creature!.createFreeChild(10);
                       doSimulationStep(props.creature!.es!);
                   }}>10<Cake/></Button>;
}

function AliveText(props: { creature: Creature }) {
    if (props.creature.killed) {
        return <div className={"text-xs text-red-800"}>Dead</div>
    } else {
        return <div className={"text-xs text-green-800"}>Alive</div>
    }
}

function SelectionButtons(props: {
    selectionCallback: (creature: Creature | null) => void,
    evoSim: EvolutionsSimulator
},) {

    function selectOldest() {
        let oldest = props.evoSim.actorManager.getActors().filter((actor) => actor instanceof Creature).reduce((prev, current) => {
            return (prev.age > current.age) ? prev : current
        }) as Creature;
        props.selectionCallback(oldest);
    }

    function selectYoungest() {
        let youngest = props.evoSim.actorManager.getActors().filter((actor) => actor instanceof Creature).reduce((prev, current) => {
            return (prev.age < current.age) ? prev : current
        }) as Creature;
        props.selectionCallback(youngest);
    }

    function selectWithMostChildren() {
        let mostChildren = props.evoSim.actorManager.getActors().filter((actor) => actor instanceof Creature).reduce((prev, current) => {
            return (prev.childrenCount > current.childrenCount) ? prev : current
        }) as Creature;
        props.selectionCallback(mostChildren);
    }

    function selectHighestGeneration() {
        let highestGeneration = props.evoSim.actorManager.getActors().filter((actor) => actor instanceof Creature).reduce((prev, current) => {
            return (prev.generation > current.generation) ? prev : current
        }) as Creature;
        props.selectionCallback(highestGeneration);
    }

    return <div className="flex flex-row gap-2">
        <Button onClick={selectOldest}>Select oldest</Button>
        <Button onClick={selectYoungest}>Select youngest</Button>
        <Button onClick={selectWithMostChildren}>Select with most children</Button>
        <Button onClick={selectHighestGeneration}>Select highest generation</Button>

    </div>
}

