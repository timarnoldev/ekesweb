"use client";

import {Creature} from "@/backend/actors/Creature";
import {NeuronalNetwork} from "@/backend/ai/NeuralNetwork";
import {Sigmoid} from "@/backend/ai/sigmoid";


console.log("Benchmarking...");
const start = performance.now();
let brains = [];
for (let i = 0; i < 1000; i++) {
    let brain = new NeuronalNetwork();
    brain.createInputNeurons(3 + 3 * 2);
    brain.addHiddenLayer(20);
    brain.addHiddenLayer(20);
    brain.createOutputNeurons(5);
    brain.connectRandomFullMeshed();
    brain.addBiasForAllNeurons();
    brain.setAllActivationFunction(new Sigmoid());
    brains.push(brain);
}

for(let x=0;x<500;x++) { //TODO set to 500
    for (let i = 0; i < 1000; i++) {
        let brain = brains[i];

        brain.reset();
        brain.setInputValues(Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random());
        brain.getOutputNeurons().forEach(neuron => neuron.getOutputValue());

    }
}

const end = performance.now();
console.log("Benchmark took " + (end - start) + " ms");

postMessage((end - start)/500);
