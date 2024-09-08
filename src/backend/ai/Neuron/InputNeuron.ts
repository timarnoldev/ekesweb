"use client";
import { Neuron } from "./Neuron";

export class InputNeuron implements Neuron {
    private outputValue: number = 0;

    setInputValue(value: number): void {
        this.outputValue = value;
    }

    getOutputValue(): number {
        return this.outputValue;
    }
}