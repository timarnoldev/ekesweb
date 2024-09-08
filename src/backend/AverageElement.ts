"use client";

export class AverageElement {
    public entryCounter: number = 0;
    public average: number = 0;
    public tempCounter: number = 0;
    public average2: number = 0;

    constructor() {}

    public getEntryCounter(): number {
        return this.entryCounter;
    }

    public setEntryCounter(entryCounter: number): void {
        this.entryCounter = entryCounter;
    }

    public getAverage(): number {
        return this.average;
    }

    public setAverage(average: number): void {
        this.average = average;
    }

    public add(add: number): void {
        this.entryCounter += add;
    }
}