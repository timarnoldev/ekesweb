"use client";
import { ActivationFunction } from "./ActivationFunction";

export class Sigmoid implements ActivationFunction {
    activation(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    derivative(x: number): number {
        return this.activation(x) * (1 - this.activation(x));
    }
}