import {EvolutionsSimulator} from "@/backend/EvolutionsSimulator";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import React, {useState} from "react";
import {Variables} from "@/backend/Variables";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {Input} from "@/components/ui/input";
import {OnTheFlyModificationDialog} from "@/components/OnTheFlyModificationDialog";

export function ParameterEditor(props: { evosim: EvolutionsSimulator | null }) {

    const [moveFactor, setMoveFactor] = useState(Variables.moveFactor);
    const [rotateFactor, setRotateFactor] = useState(Variables.rotateFactor);
    const [moveCostMult, setMoveCostMult] = useState(Variables.moveCostMult);
    const [rotateCostMult, setRotateCostMult] = useState(Variables.rotateCostMult);
    const [eatMult, setEatMult] = useState(Variables.eatMult);
    const [permanentCostLand, setPermanentCostLand] = useState(Variables.permanentCostLand);
    const [permanentCostWater, setPermanentCostWater] = useState(Variables.permanentCostWater);
    const [eatCostMult, setEatCostMult] = useState(Variables.eatCostMult);
    const [createChildAge, setCreateChildAge] = useState(Variables.createChildAge);
    const [createChildEnergy, setCreateChildEnergy] = useState(Variables.createChildEnergy);
    const [eatAdmission, setEatAdmission] = useState(Variables.eatAdmission);
    const [mutation_percentage, setMutation_percentage] = useState(Variables.mutation_percentage);
    const [mutation_neurons, setMutation_neurons] = useState(Variables.mutation_neurons);

    function apply() {
        Variables.moveFactor = moveFactor;
        Variables.rotateFactor = rotateFactor;
        Variables.moveCostMult = moveCostMult;
        Variables.rotateCostMult = rotateCostMult;
        Variables.eatMult = eatMult;
        Variables.permanentCostLand = permanentCostLand;
        Variables.permanentCostWater = permanentCostWater;
        Variables.eatCostMult = eatCostMult;
        Variables.createChildAge = createChildAge;
        Variables.createChildEnergy = createChildEnergy;
        Variables.eatAdmission = eatAdmission;
        Variables.mutation_percentage = mutation_percentage;
        Variables.mutation_neurons = mutation_neurons;
    }

    function reset() {
        Variables.resetToDefault();

        setMoveFactor(Variables.moveFactor);
        setRotateFactor(Variables.rotateFactor);
        setMoveCostMult(Variables.moveCostMult);
        setRotateCostMult(Variables.rotateCostMult);
        setEatMult(Variables.eatMult);
        setPermanentCostLand(Variables.permanentCostLand);
        setPermanentCostWater(Variables.permanentCostWater);
        setEatCostMult(Variables.eatCostMult);
        setCreateChildAge(Variables.createChildAge);
        setCreateChildEnergy(Variables.createChildEnergy);
        setEatAdmission(Variables.eatAdmission);
        setMutation_percentage(Variables.mutation_percentage);
        setMutation_neurons(Variables.mutation_neurons);
    }

    const variables: string[] = [];
    if (props.evosim) {
        //iterate over all variables and create a input field for each
        //  Variables.
        Object.keys(Variables).forEach((key) => {
            variables.push(key);
            console.log(key);
        });


    }

    return <Card className={"max-h-[95%] h-fit overflow-y-auto"}>
        <CardHeader>
            <CardTitle>Simulation Parameters</CardTitle>

        </CardHeader>
        <CardContent>


            <div className={"mt-2 flex flex-col gap-2 items-end"}>

                <div className={"flex flex-row gap-2 items-center justify-end"}>
                    <label>Distance per Action</label>
                    <Input type="number" className={"w-36"} value={moveFactor}
                           onChange={e => setMoveFactor(parseFloat(e.target.value))}></Input>
                </div>
                <div className={"flex flex-row gap-2 items-center"}>
                    <label>Rotation per Action</label>
                    <Input type="number" className={"w-36"} value={rotateFactor}
                           onChange={e => setRotateFactor(parseFloat(e.target.value))}></Input>
                </div>
                <div className={"flex flex-row gap-2 items-center"}>
                    <label>Move Energy Cost</label>
                    <Input type="number" className={"w-36"} value={moveCostMult}
                           onChange={e => setMoveCostMult(parseFloat(e.target.value))}></Input>
                </div>
                <div className={"flex flex-row gap-2 items-center"}>
                    <label>Rotation Energy Cost</label>
                    <Input type="number" className={"w-36"} value={rotateCostMult}
                           onChange={e => setRotateCostMult(parseFloat(e.target.value))}></Input>
                </div>
                <div className={"flex flex-row gap-2 items-center"}>
                    <label>Eat Energy Gain</label>
                    <Input type="number" className={"w-36"} value={eatMult}
                           onChange={e => setEatMult(parseFloat(e.target.value))}></Input>
                </div>
                <div className={"flex flex-row gap-2 items-center"}>
                    <label>Eat Admission</label>
                    <Input type="number" className={"w-36"} value={eatAdmission}
                           onChange={e => setEatAdmission(parseFloat(e.target.value))}></Input>
                </div>
                <div className={"flex flex-row gap-2 items-center"}>
                    <label>Eat Energy Cost</label>
                    <Input type="number" className={"w-36"} value={eatCostMult}
                           onChange={e => setEatCostMult(parseFloat(e.target.value))}></Input>
                </div>
                <div className={"flex flex-row gap-2 items-center"}>
                    <label>Permanent Cost Land</label>
                    <Input type="number" className={"w-36"} value={permanentCostLand}
                           onChange={e => setPermanentCostLand(parseFloat(e.target.value))}></Input>
                </div>
                <div className={"flex flex-row gap-2 items-center"}>
                    <label>Permanent Cost Water</label>
                    <Input type="number" className={"w-36"} value={permanentCostWater}
                           onChange={e => setPermanentCostWater(parseFloat(e.target.value))}></Input>
                </div>

                <div className={"flex flex-row gap-2 items-center"}>
                    <label>Create Child Age</label>
                    <Input type="number" className={"w-36"} value={createChildAge}
                           onChange={e => setCreateChildAge(parseFloat(e.target.value))}></Input>
                </div>
                <div className={"flex flex-row gap-2 items-center"}>
                    <label>Create Child Energy</label>
                    <Input type="number" className={"w-36"} value={createChildEnergy}
                           onChange={e => setCreateChildEnergy(parseFloat(e.target.value))}></Input>
                </div>

                <div className={"flex flex-row gap-2 items-center"}>
                    <label>Mutation Percentage</label>
                    <Input type="number" className={"w-36"} value={mutation_percentage}
                           onChange={e => setMutation_percentage(parseFloat(e.target.value))}></Input>
                </div>
                <div className={"flex flex-row gap-2 items-center"}>
                    <label>Mutated Neurons</label>
                    <Input type="number" className={"w-36"} value={mutation_neurons}
                           onChange={e => setMutation_neurons(parseFloat(e.target.value))}></Input>
                </div>


                <div className={"mt-2"}/>
                <div className={"flex flex-row gap-2 items-center"}>
                    <Button onClick={reset}>Reset to default</Button>
                    <Button onClick={apply}>Apply</Button>
                </div>
                <div className={"mt-2"}/>

                <div className={"flex flex-row justify-between w-full items-center"}>
                    <KillAllDialog evoSim={props.evosim}/>
                    <OnTheFlyModificationDialog/>
                </div>
            </div>


        </CardContent>

    </Card>
}


function KillAllDialog(props: {evoSim:EvolutionsSimulator | null}) {
    function killAll() {
        props.evoSim!.actorManager.getActors().forEach((a)=>a.killed=true);
        props.evoSim!.world.getTiles().forEach((r)=>{
            r.forEach(tile=>{
                tile.setFoodValue(1);
            })
        })
    }

    return <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="destructive">Kill All</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. All genetic progress will be lost and a new "Generation
                    1" will be initiated. Your parameter settings won't be changed.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={killAll}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}