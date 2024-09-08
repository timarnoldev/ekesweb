"use client";

import {Neuron} from "@/backend/ai/Neuron/Neuron";

export class Connection {
    private startNeuron: Neuron;
    private weight: number;
    private momentum: number = 0;

    constructor(startNeuron: Neuron, weight: number) {
        this.startNeuron = startNeuron;
        this.weight = weight;
    }

    public getOutputValue(): number {
        return this.startNeuron.getOutputValue() * this.weight;
    }

    public getWeight(): number {
        return this.weight;
    }

    public setWeight(weight: number): void {
        this.weight = weight;
    }

    public getStartNeuron(): Neuron {
        return this.startNeuron;
    }

    public setStartNeuron(startNeuron: Neuron): void {
        this.startNeuron = startNeuron;
    }

    public addWeight(deltaWeight: number): void {
        this.momentum += deltaWeight;
        this.momentum *= 0.9;
        this.weight += deltaWeight + this.momentum;
    }

}