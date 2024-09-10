import {EvolutionsSimulator} from "@/backend/EvolutionsSimulator";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import React, {useState} from "react";
import {Variables} from "@/backend/Variables";
import {Button} from "@/components/ui/button";
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

    return <Card className={"max-h-[90%] h-fit overflow-y-scroll"}>
        <CardHeader >
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

                <OnTheFlyModificationDialog/>

            </div>


        </CardContent>

    </Card>
}