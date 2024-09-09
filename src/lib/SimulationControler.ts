import {EvolutionsSimulator} from "@/backend/EvolutionsSimulator";
import {updateData} from "@/three/Rendering";

export function doSimulationStep(es:EvolutionsSimulator) {
    es.doStep();
    document.dispatchEvent(new Event("simulationUpdate"));
    updateData(es);
}