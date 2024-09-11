import {EvolutionsSimulator} from "@/backend/EvolutionsSimulator";
import {useEffect, useState} from "react";

export function CurrentSimulationStats(props: {evosim: EvolutionsSimulator | null}) {

    const [currentYear, setCurrentYear] = useState(props.evosim?.time.year??0);
    const [stepsPerSecond, setStepsPerSecond] = useState(props.evosim?.averageStepsPerSecond??0);
    const [warning, setWarning] = useState(false);
    const [noNewChilds, setNoNewChilds] = useState(false);

    useEffect(() => {
        const listener = () => {
            setCurrentYear(props.evosim?.time.year??0);
            setStepsPerSecond(props.evosim?.averageStepsPerSecond??0);
            if(props.evosim!.actorManager.getActors().length > 1500 || props.evosim?.speed_warning) {
                setWarning(true);
            }

            if(props.evosim!.actorManager.getActors().length < 1200 && !props.evosim?.speed_warning) {
                setWarning(false);
            }

            if(props.evosim!.actorManager.getActors().length > 20000) {

                setNoNewChilds(true);

            }

            if(props.evosim!.actorManager.getActors().length < 10000) {
                setNoNewChilds(false);
            }

        };
        document.addEventListener("simulationUpdate", listener);

        return () => {
            document.removeEventListener("simulationUpdate", listener);
        }
    }, [props.evosim]);

    return <div className="flex flex-col gap-2"><div className="flex flex-row justify-between gap-2">
        <div>Current Year: {currentYear.toFixed(1)}</div>
        <div>Steps per second: {stepsPerSecond.toFixed(0)}</div>
    </div>
        {warning && <div className="text-red-500">Warning: Only random creatures will get updated to ensure smooth performance. Adjust simulation parameters!</div>}
        {noNewChilds && <div className="text-red-500">Warning: No new children will be created. Adjust simulation parameters now!</div>}
    </div>

}