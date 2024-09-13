import {EvolutionsSimulator} from "@/backend/EvolutionsSimulator";
import React, {useEffect, useState} from "react";
import {Creature} from "@/backend/actors/Creature";
import {Button} from "@/components/ui/button";
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";
import {GearIcon} from "@radix-ui/react-icons";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {Label} from "@/components/ui/label";

export function Diagram(props: { evoSim: EvolutionsSimulator | null, initSource: string, initAttribute: string, initAggregation: string, initSegregation: string }) {

    const generation_distribution_config_template = {
        amount: {
            label: "Creatures",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig

    const time_distribution_config_template = {
        amount: {
            label: "Creatures",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig

    const [data, setData] = useState<{ gen: number, amount: number, lastUpdated: number }[]>([]);
    const [dataSource, setDataSource] = useState<string | undefined>(props.initSource);
    const [dataAttribute, setDataAttribute] = useState<string | undefined>(props.initAttribute);
    const [dataSegregation, setDataSegregation] = useState<string | undefined>(props.initSegregation);
    const [dataAggregation, setDataAggregation] = useState<string | undefined>(props.initAggregation);

    const [generation_distribution_config, setGenerationDistributionConfig] = useState<ChartConfig>(generation_distribution_config_template);
    const [time_distribution_config, setTimeDistributionConfig] = useState<ChartConfig>(time_distribution_config_template);

    const [diagramName, setDiagramName] = useState<string | undefined>(undefined);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [showLineDiagram, setShowLineDiagram] = useState<boolean>(false);
    const [showBarDiagram, setShowBarDiagram] = useState<boolean>(false);

    function updateDataSource(dataSource: string | undefined) {
        setDataSource(dataSource);
        setData([]);

        setDataAttribute(undefined);
        setDataAggregation(undefined);
        setDataSegregation(undefined);
        updateVisibility();
    }

    function updateDataAttribute(attribute: string | undefined) {
        setDataAttribute(attribute);
        setData([]);
        updateVisibility();
    }

    function updateDataSegregation(segregation: string | undefined) {
        setDataSegregation(segregation);
        setData([]);
        updateVisibility();
    }

    function updateDataAggregation(aggregation: string | undefined) {
        setDataAggregation(aggregation);
        setData([]);
        updateVisibility();
    }



    function updateVisibility() {

        if(dataSource === "world") {
            setIsVisible(dataAttribute!=null);
        }else if(dataSource === "creature") {
            if(dataAttribute === "amount") {
                setIsVisible(dataSegregation != null);
            }else{
                setIsVisible(dataAttribute != null && dataSegregation != null && dataAggregation != null);
            }
        }

        if(dataSource === "world") {
            if(dataAttribute!=null) {
                setShowLineDiagram(true);
            }
            setShowBarDiagram(false);
        }else if (dataSource === "creature") {
            if(dataSegregation === "time") {
                if(dataAttribute === "amount" || dataAttribute === "age_at_death") {
                    setShowLineDiagram(true);
                }else if(dataAttribute != null && dataAggregation != null) {
                    setShowLineDiagram(true);
                }else{
                    setShowLineDiagram(false);
                }
                setShowBarDiagram(false);
            }else if(dataSegregation === "generation") {
                if(dataAttribute === "amount" || dataAttribute === "age_at_death") {
                    setShowBarDiagram(true);
                }else if(dataAttribute != null && dataAggregation != null) {
                    setShowBarDiagram(true);
                }else{
                    setShowBarDiagram(false);
                }
                setShowLineDiagram(false);
            }
        }
    }



    function updateData(attribute: string, human_readable_string: string) {
        if(dataSegregation === "time") {
            time_distribution_config.amount.label = human_readable_string;
            setTimeDistributionConfig(generation_distribution_config);
            let newData: number = 0;
            switch (dataAggregation) {
                case "max":
                    setDiagramName("Max " + human_readable_string +" over Time");
                    newData = Math.max(...props.evoSim!.actorManager.getActors().map((actor) => (actor as any)[attribute]));
                    break;
                case "min":
                    setDiagramName("Min " + human_readable_string +" over Time");
                    newData = Math.min(...props.evoSim!.actorManager.getActors().map((actor) => (actor as any)[attribute]));
                    break;
                case "avg":
                    setDiagramName("Avg " + human_readable_string+" over Time");
                    newData = props.evoSim!.actorManager.getActors().reduce((acc, actor) => acc + (actor as any)[attribute], 0) / props.evoSim!.actorManager.getActors().length;
                    break;
            }
            setData(data => [...data, {gen: -1, amount: newData, lastUpdated: -1}]);
        }else if(dataSegregation === "generation") {

            if(dataAggregation === "max") {
                setDiagramName("Max " + human_readable_string + " per Generation");
            }else if(dataAggregation === "min") {
                setDiagramName("Min " + human_readable_string + " per Generation");
            } else if(dataAggregation === "avg") {
                setDiagramName("Average " + human_readable_string + " per Generation");
            }

            generation_distribution_config.amount.label = human_readable_string;
            setGenerationDistributionConfig(generation_distribution_config);
            const actors_per_generation = props.evoSim!.actorManager.getActors().filter((actor) => actor instanceof Creature).map((actor) => actor as Creature).reduce((acc, creature) => {
                if (!acc[creature.generation]) {
                    acc[creature.generation] = {
                        acc: (creature as any)[attribute],
                        counter: 1
                    }
                }

                if(dataAggregation === "max") {
                    acc[creature.generation].acc = Math.max(acc[creature.generation].acc, (creature as any)[attribute]);
                    acc[creature.generation].counter++;
                }else if(dataAggregation === "min") {
                    acc[creature.generation].acc = Math.min(acc[creature.generation].acc, (creature as any)[attribute]);
                    acc[creature.generation].counter++;
                }else if(dataAggregation === "avg") {
                    acc[creature.generation].acc += (creature as any)[attribute];
                    acc[creature.generation].counter++;
                }
                return acc;
            }, {} as { [key: number]: {acc: number, counter: number} });

            if(dataAggregation === "avg") {
                Object.entries(actors_per_generation).forEach(([key, value]) => {
                    actors_per_generation[parseInt(key)].acc = value.acc / value.counter;
                });
            }

            const generation_array = Object.entries(actors_per_generation).map(([key, value]) => {
                return {"gen": parseInt(key), "amount": value.acc, "lastUpdated": -1};
            });

            setData(generation_array);

        }
    }

   function updateWorldData(){
       if(dataAttribute === "vegetation") {
           time_distribution_config.amount.label = "Vegetation";
           setTimeDistributionConfig(time_distribution_config);
           setDiagramName("Average Vegetation over Time");

           setData(data => [...data, {gen: -1, amount: props.evoSim!.world.getFoodAvailable(), lastUpdated: -1}]);
       }
       if(dataAttribute === "performance") {
           setDiagramName("Performance over Time")
           time_distribution_config.amount.label = "Steps per Second";
           setTimeDistributionConfig(time_distribution_config);

           setData(data => [...data, {gen: -1, amount: props.evoSim!.averageStepsPerSecond, lastUpdated: -1}]);
       }
       if(data.length>500) {
           setData(data.slice(1));
       }
    }

    function updateCreatureAmount() {
        if(dataSegregation === "time") {
            time_distribution_config.amount.label = "Creatures";
            setTimeDistributionConfig(time_distribution_config);
            setDiagramName("Amount of Creatures over Time");

            setData(data => [...data, {gen: -1, amount: props.evoSim!.actorManager.getActors().length, lastUpdated: -1}]);
        }else if(dataSegregation === "generation") {
            generation_distribution_config.amount.label = "Creatures";
            setGenerationDistributionConfig(generation_distribution_config);
            setDiagramName("Amount of Creatures per Generation");

            const actors_per_generation = props.evoSim!.actorManager.getActors().filter((actor) => actor instanceof Creature).map((actor) => actor as Creature).reduce((acc, creature) => {
                if (!acc[creature.generation]) {
                    acc[creature.generation] = 0;
                }
                acc[creature.generation]++;
                return acc;
            }, {} as { [key: number]: number });

            const generation_array = Object.entries(actors_per_generation).map(([key, value]) => {
                return {"gen": parseInt(key), "amount": value, lastUpdated: -1};
            });

            setData(generation_array);
        }
    }

    function updateDeathData() {
        if(dataSegregation === "time") {
            time_distribution_config.amount.label = "Age";
            setTimeDistributionConfig(time_distribution_config);
            setDiagramName("Average Age at Death over Time");
            setData(data => [...data, {gen: -1, amount: props.evoSim!.getActorManager().ageOnDeathAverage, lastUpdated:-1}]);
        }else if(dataSegregation === "generation") {
            generation_distribution_config.amount.label = "Age";
            setGenerationDistributionConfig(generation_distribution_config);
            setDiagramName("Average Age at Death per Generation");

            const actors_per_generation = props.evoSim!.actorManager.getDeathActors().filter((actor) => actor instanceof Creature).map((actor) => actor as Creature).reduce((acc, creature) => {

                if (!acc[creature.generation]) {
                    acc[creature.generation] = 0;
                }
                acc[creature.generation]=creature.age*0.3+acc[creature.generation]*0.7;
                return acc;
            }, {} as { [key: number]: number });

            const generation_array = Object.entries(actors_per_generation).map(([key, value]) => {
                return {"gen": parseInt(key), "amount": value, lastUpdated: props.evoSim!.time.year};
            });

            let newData = data.slice();


            generation_array.forEach((element) => {
                if(!newData.map((dataEl) => dataEl.gen).includes(element.gen)) {
                    newData.push({gen: element.gen, amount: 0, lastUpdated: props.evoSim!.time.year});
                }
            });


            newData.forEach((element) => {
                if(element.gen in actors_per_generation) {
                    element.lastUpdated = props.evoSim!.time.year;
                    if(element.amount === 0) {
                        element.amount = actors_per_generation[element.gen];
                    }else{
                        element.amount = element.amount*0.6+actors_per_generation[element.gen]*0.4;
                    }
                }
            });

            newData = newData.filter((element) => (props.evoSim!.time.year-element.lastUpdated) < 10);

            setData(newData);
        }
    }

    useEffect(() => {

        updateVisibility();
        const listener = () => {
            if (!props.evoSim) return


            if(dataSource === "world") {
                updateWorldData();
            }else if(dataSource === "creature") {
                if(dataAttribute === "amount") {
                    updateCreatureAmount();
                }else if(dataAttribute === "energy") {
                    updateData("energy", "Energy");
                }else if(dataAttribute === "age") {
                    updateData("age", "Age");
                }else if(dataAttribute === "age_at_death") {
                    updateDeathData();
                }else if(dataAttribute === "generation") {
                    updateData("generation", "Generation");
                }else if(dataAttribute === "neural_move") {
                    updateData("outMoveForward", "Neural Out Move");
                }else if(dataAttribute === "neural_rotate_right") {
                    updateData("outRotateRight", "Neural Out Rotate Right");
                }else if(dataAttribute === "neural_rotate_left") {
                    updateData("outRotateLeft", "Neural Out Rotate Left");
                }else if(dataAttribute === "neural_eat") {
                    updateData("outEat", "Neural Out Eat");
                }else if(dataAttribute === "children_count") {
                    updateData("childrenCount", "Children Count");
                }else if(dataAttribute === "distance_moved") {
                    updateData("distanceMoved", "Distance Moved");
                }

                if(data.length>500&&dataSegregation === "time") {
                    setData(data.slice(1));
                }

            }

        };
        document.addEventListener("simulationUpdate", listener);

        return () => {
            document.removeEventListener("simulationUpdate", listener);
        }
    });

    return <div>

        <div className={"flex flex-row gap-3 items-center"}>
        {
            (isVisible) &&
            <p className="font-semibold leading-none tracking-tight mt-4 mb-4">{diagramName}</p>
        }

        {
            (!isVisible) && <p className="font-semibold leading-none tracking-tight mt-4 mb-4">No Data Selected</p>
        }


            <Dialog>
                <DialogTrigger asChild className=""><Button variant={"secondary"}  className={""}><GearIcon/></Button></DialogTrigger>
                <DialogContent className={"min-w-fit w-2/3"}>
                    <DialogHeader>
                        <DialogTitle>Diagram Editor</DialogTitle>
                        <DialogDescription className={"flex flex-col gap-3"}>
                            Choose a data source for your diagram

                            <div className={"flex flex-col gap-3 "}>
                            <DataSourceSelect onValueChange={updateDataSource} value={dataSource}/>
                            {dataSource === "world" && <WorldDataSelect value={dataAttribute} onValueChange={updateDataAttribute}/>}
                            {dataSource === "creature" && <CreatureDataSelect value={dataAttribute} onValueChange={updateDataAttribute}/>}
                            {dataSource === "creature" && <CreatureDataSegregationSelect value={dataSegregation} onValueChange={updateDataSegregation}/>}
                            {(dataSource === "creature"&& dataAttribute != "amount" && dataAttribute != "age_at_death") && <CreatureDataAggregationSelect value={dataAggregation} onValueChange={updateDataAggregation}/>}
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogBody>

                    </DialogBody>


                    <DialogClose><Button>Close</Button></DialogClose>
                </DialogContent>
            </Dialog>

        </div>

        {
            showLineDiagram &&  <ChartContainer config={time_distribution_config}>
                <AreaChart
                    accessibilityLayer
                    data={data}
                    margin={{
                        left: 12,
                        right: 12,
                    }}
                >
                    <CartesianGrid vertical={false}/>
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        //tickFormatter={(value) => value.slice(0, 3)}
                    />

                    <YAxis dataKey="amount"/>

                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="line" className="bg-white dark:bg-black"/>}
                    />
                    <Area
                        dataKey="amount"
                        type="natural"
                        fill="green"
                        fillOpacity={0.4}
                        stroke="green"
                    />
                </AreaChart>
            </ChartContainer>
        }

        {
            showBarDiagram && <ChartContainer config={generation_distribution_config}>
                <BarChart className="w-full" accessibilityLayer data={data}>
                    <CartesianGrid vertical={false}/>
                    <XAxis
                        dataKey="gen"
                        tickLine={true}
                        tickMargin={10}
                        axisLine={false}
                        //tickFormatter={(value) => value.slice(0, 3)}
                    />

                    <YAxis dataKey="amount"/>

                    <Bar animationDuration={50} dataKey="amount" fill="blue" radius={8} maxBarSize={80}/>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel className="bg-white dark:bg-black"/>}
                    />
                </BarChart>


            </ChartContainer>
        }



    </div>

}

function DataSourceSelect(props: {
    onValueChange: (value: string) => void,
    value: string | undefined
}) {
    return <div className={"flex flex-col space-y-1.5"}>

        <Label htmlFor="data-source">Data Source</Label>

        <Select value={props.value} onValueChange={props.onValueChange}>
            <SelectTrigger id={"data-source"} className="w-[180px]">
                <SelectValue placeholder="Data Source"/>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="world">World</SelectItem>
                <SelectItem value="creature">Creature</SelectItem>
            </SelectContent>
        </Select>
    </div>;
}

function WorldDataSelect(props: {
    onValueChange: (value: string) => void,
    value: string | undefined
}) {
    return <div className={"flex flex-col space-y-1.5"}>

        <Label htmlFor="data-source">Select data from world</Label>

        <Select value={props.value} onValueChange={props.onValueChange}>
            <SelectTrigger id={"data-source"} className="w-[180px]">
                <SelectValue placeholder="World Data"/>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="vegetation">Average Vegetation</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
        </Select>
    </div>;
}


function CreatureDataSelect(props: {
    onValueChange: (value: string) => void,
    value: string | undefined
}) {
    return <div className={"flex flex-col space-y-1.5"}>

        <Label htmlFor="data-source">Select Data from Creature</Label>

        <Select value={props.value} onValueChange={props.onValueChange}>
            <SelectTrigger id={"data-source"} className="w-[180px]">
                <SelectValue placeholder="Creature Data"/>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
                <SelectItem value="age">Age</SelectItem>
                <SelectItem value="age_at_death">Age at Death</SelectItem>
                <SelectItem value="generation">Generation</SelectItem>
                <SelectItem value="neural_move">Neural Out Move</SelectItem>
                <SelectItem value="neural_rotate_right">Neural Out Rotate Right</SelectItem>
                <SelectItem value="neural_rotate_left">Neural Out Rotate Left</SelectItem>
                <SelectItem value="neural_eat">Neural Out Eat</SelectItem>
                <SelectItem value="children_count">Children Count</SelectItem>
                <SelectItem value="distance_moved">Distance Moved</SelectItem>
            </SelectContent>
        </Select>
    </div>;
}


function CreatureDataSegregationSelect(props: {
    onValueChange: (value: string) => void,
    value: string | undefined
}) {
    return <div className={"flex flex-col space-y-1.5"}>

        <Label htmlFor="data-source">Select Data Segregation</Label>

        <Select value={props.value} onValueChange={props.onValueChange}>
            <SelectTrigger id={"data-source"} className="w-[180px]">
                <SelectValue placeholder="Data Segregation"/>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="time">Time</SelectItem>
                <SelectItem value="generation">Generation</SelectItem>
            </SelectContent>
        </Select>
    </div>;
}

function CreatureDataAggregationSelect(props: {
    onValueChange: (value: string) => void,
    value: string | undefined
}) {
    return <div className={"flex flex-col space-y-1.5"}>

        <Label htmlFor="data-source">Select Data Aggregation</Label>

        <Select value={props.value} onValueChange={props.onValueChange}>
            <SelectTrigger id={"data-source"} className="w-[180px]">
                <SelectValue placeholder="Data Aggregation"/>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="max">Max</SelectItem>
                <SelectItem value="min">Min</SelectItem>
                <SelectItem value="avg">Average</SelectItem>
            </SelectContent>
        </Select>
    </div>;
}

