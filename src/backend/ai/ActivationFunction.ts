"use client";

export interface ActivationFunction {
    activation(x: number): number;
    derivative(x: number): number;
}