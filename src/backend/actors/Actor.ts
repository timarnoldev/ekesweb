"use client";
import {EvolutionsSimulator} from "@/backend/EvolutionsSimulator";

export abstract class Actor {
    public XPosition: number = 0;
    public YPosition: number = 0;
    public es: EvolutionsSimulator | undefined;
    public age: number = 0;
    public killed: boolean = false;
    public isRandom: boolean = false;
    public generation: number = 1;
    public invincible: boolean = false;

    public abstract calculateBrain(): void;

    public doStep(): void {
        this.calculateBrain();
        this.age += this.es!.time.TicksPerYear;
    }

    public getXPosition(): number {
        return Math.floor(this.XPosition);
    }

    public getYPosition(): number {
        return Math.floor(this.YPosition);
    }

    public kill(): void {
        if(!this.invincible) {
            this.killed = true;
        }
    }

    public getGeneration(): number {
        return this.generation;
    }
}