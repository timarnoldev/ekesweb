import {EvolutionsSimulator} from "@/backend/EvolutionsSimulator";
import React, {useEffect, useState} from "react";
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {Creature} from "@/backend/actors/Creature";
import {Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";

export default function Diagrams(props: {evoSim: EvolutionsSimulator | null}) {
    const [generationArray, setGenerationArray] = useState<{ gen: string, count: number }[] | null>(null);
    const [actorSizeArray, setActorSizeArray] = useState<{ size: number }[]>([]);
    const [foodAvailable, setFoodAvailable] = useState<{ amount: number }[]>([]);

    const generation_distribution_config = {
        count: {
            label: "Creatures",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig

    const actor_size_config = {
        size: {
            label: "Creatures",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig

    const food_amount_config = {
        amount: {
            label: "Food",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig

    useEffect(() => {
        const listener = () => {
            if (!props.evoSim) return
            const actors_per_generation = props.evoSim.actorManager.getActors().filter((actor) => actor instanceof Creature).map((actor) => actor as Creature).reduce((acc, creature) => {
                if (!acc[creature.generation]) {
                    acc[creature.generation] = 0;
                }
                acc[creature.generation]++;
                return acc;
            }, {} as { [key: number]: number });

            const generation_array = Object.entries(actors_per_generation).map(([key, value]) => {
                return {"gen": key, "count": value};
            });

            setGenerationArray(generation_array);

            setActorSizeArray(actorsize => [...actorsize, {size: props.evoSim!.actorManager.getActors().length}]);

            //remote old entries if longer than 300
            if(actorSizeArray.length>500) {
                setActorSizeArray(actorSizeArray.slice(1));
            }

           const fooddata = (props.evoSim!.world.getFoodAvailable());

            setFoodAvailable(food => [...food, {amount: fooddata}]);
            if(foodAvailable.length>500) {
                setFoodAvailable(foodAvailable.slice(1));
            }

        };
        document.addEventListener("simulationUpdate", listener);

        return () => {
            document.removeEventListener("simulationUpdate", listener);
        }
    });


    return <>
        <p className="font-semibold leading-none tracking-tight mt-4 mb-4">Generation distribution</p>

        {generationArray && <ChartContainer config={generation_distribution_config}>
            <BarChart className="w-full" accessibilityLayer data={generationArray!}>
                <CartesianGrid vertical={false}/>
                <XAxis
                    dataKey="gen"
                    tickLine={true}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />

                <YAxis dataKey="count"/>

                <Bar animationDuration={50} dataKey="count" fill="blue" radius={8} maxBarSize={80}/>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel className="bg-white dark:bg-black"/>}
                />
            </BarChart>


        </ChartContainer>}

        <p className="font-semibold leading-none tracking-tight mt-4 mb-4">Historical amount of creatures</p>

        <ChartContainer config={actor_size_config}>
            <AreaChart
                accessibilityLayer
                data={actorSizeArray}
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
                    tickFormatter={(value) => value.slice(0, 3)}
                />

                <YAxis dataKey="size"/>

                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" className="bg-white dark:bg-black"/>}
                />
                <Area
                    dataKey="size"
                    type="natural"
                    fill="green"
                    fillOpacity={0.4}
                    stroke="green"
                />
            </AreaChart>
        </ChartContainer>

            <p className="font-semibold leading-none tracking-tight mt-4 mb-4">Average food amount</p>

            <ChartContainer config={food_amount_config}>
                <AreaChart
                    accessibilityLayer
                    data={foodAvailable}
                    margin={{
                        left: 12,
                        right: 12,
                    }}
                >
                    <CartesianGrid vertical={false}/>


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

        </>
        }