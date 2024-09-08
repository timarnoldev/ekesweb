"use client";
import {Neuron} from "@/backend/ai/Neuron/Neuron";
import { Connection } from "../Connection";
import {ActivationFunction} from "@/backend/ai/ActivationFunction";
import {Sigmoid} from "@/backend/ai/sigmoid";

export class WorkingNeuron implements Neuron{
    private inputConnections: Array<Connection> = [];
    private activationFunction: ActivationFunction = new Sigmoid();
    private smallDelta: number = 0;
    private value: number = 0;
    private isvalueset:boolean = false;

    public getOutputValue(): number {
        if (!this.isvalueset) {
            let sum = 0;
            for (const c of this.inputConnections) {
                sum += c.getOutputValue();
            }
            this.value = this.activationFunction.activation(sum);
            this.isvalueset = true;
        }
        return this.value;
    }

    public addInputConnection(ic: Connection): void {
        this.inputConnections.push(ic);
    }

    public calculateOutputDelta(should: number): void {
        this.smallDelta = should - this.getOutputValue();
    }

    public backpropagateSmallDelta(): void {
        for (const c of this.inputConnections) {
            const n = c.getStartNeuron();
            if (n instanceof WorkingNeuron) {
                const wn = n as WorkingNeuron;
                wn.smallDelta += this.smallDelta * c.getWeight();
            }
        }
    }

    public reset(): void {
        this.smallDelta = 0;
        this.isvalueset = false;
    }

    public randomMutate(mutationRate: number): void {
        const index = Math.floor(Math.random() * this.inputConnections.length);
        const connection = this.inputConnections[index];
        connection.setWeight(connection.getWeight() + ((Math.random() - 0.5) * mutationRate));
    }

    public deltaLearning(epsilon: number): void {
        const bigDeltaFactor = this.activationFunction.derivative(this.getOutputValue()) * epsilon * this.smallDelta;
        for (const connection of this.inputConnections) {
            const bigDelta = bigDeltaFactor * connection.getStartNeuron().getOutputValue();
            connection.addWeight(bigDelta);
        }
    }

    public getInputConnections(): Array<Connection> {
        return this.inputConnections;
    }

    public setActivationFunction(activationFunction: ActivationFunction): void {
        this.activationFunction = activationFunction;
    }
}