"use client";
import { ActorManager } from './ActorManager';
import { VirtualTileWorld } from './virtualtileworld/VirtualTileWorld';
import { WorldGenerator } from './virtualtileworld/WorldGenerator';
import { Time } from './Time';
import {Creature} from "@/backend/actors/Creature";

export class EvolutionsSimulator {
    public actorManager: ActorManager;
    public time: Time;
    public calcAverageBySteps: number = 500;
    public averageActorSizeForSteps: number = 0;
    public calcAverageActorSizeForSteps: number = 0;
    public averageActorAgeForSteps: number = 0;
    public calcAverageActorAgeForSteps: number = 0;
    public averageFoodAvailable: number = 0;
    public calcAverageFoodAvailable: number = 0;
    public yearsCounter: number = 0;
    public done: boolean = false;
    public worldWidth: number = 150;
    public worldHeight: number = 100;
    public world: VirtualTileWorld;
    public ready: boolean = false;
    public selectedCreature: Creature | null = null;
    public followSelected: boolean = false;
    public averageStepsPerSecond: number = 0;
    public lastStepTime: number = Date.now();

    constructor() {
        this.world = new VirtualTileWorld(this.worldWidth, this.worldHeight, 10);
        this.actorManager = new ActorManager(this);
        this.time = new Time();
        const worldGenerator = new WorldGenerator(`/land.jpg`, this.worldWidth, this.worldHeight);
        worldGenerator.readImage(`/land.jpg`).then(() => {

            worldGenerator.generateWorld(this.world).then(() => {
                this.world.calculateFertilities();
                this.world.calculateTileCounts();
                this.ready = true;

            });
        });


    }

    /**
     * One Simulation Step
     */
    public doStep(): void {
        if(this.averageStepsPerSecond === 0) {
            this.averageStepsPerSecond = (1000/(performance.now() - this.lastStepTime));
        }
        this.averageStepsPerSecond = this.averageStepsPerSecond*0.99 + 0.01 * (1000/(performance.now() - this.lastStepTime));
        this.lastStepTime = performance.now();
        if(!this.ready) return;
        // Calc average values for data logging
        this.updateAverageData();

        // Update Simulation
        this.world.doStep();
        this.actorManager.doStep();
        this.time.Tick();

    }

    private updateAverageData(): void {
        if (Math.floor(this.time.year) % Math.floor(this.calcAverageBySteps * this.time.TicksPerYear) === 0) {
            if (!this.done) {
                this.averageActorSizeForSteps = Math.floor(this.calcAverageActorSizeForSteps / this.calcAverageBySteps);
                this.averageActorAgeForSteps = this.calcAverageActorAgeForSteps / this.calcAverageBySteps;
                this.averageFoodAvailable = this.calcAverageFoodAvailable / this.calcAverageBySteps;
                this.calcAverageFoodAvailable = 0;
                this.calcAverageActorAgeForSteps = 0;
                this.calcAverageActorSizeForSteps = 0;

                this.done = true;
                console.log(`${this.averageActorSizeForSteps} ${this.averageActorAgeForSteps.toString().replace('.', ',')} ${this.averageFoodAvailable.toString().replace('.', ',')}`);
                for (let i = 0; i < this.actorManager.averageHiddenNeurons.length; i++) {
                    console.log(' ');
                    this.actorManager.averageHiddenNeurons[i].average2 = this.actorManager.averageHiddenNeurons[i].tempCounter / this.calcAverageBySteps;
                    this.actorManager.averageHiddenNeurons[i].tempCounter = 0;
                    console.log(this.actorManager.averageHiddenNeurons[i].average2.toString().replace('.', ','));
                }
                console.log();

                this.yearsCounter++;
            }
        } else {
            this.done = false;
            this.calcAverageActorSizeForSteps += this.actorManager.getActors().length;
            this.calcAverageActorAgeForSteps += this.actorManager.averageAge;
            this.calcAverageFoodAvailable += this.world.getFoodAvailable();

            for (let i = 0; i < this.actorManager.averageHiddenNeurons.length; i++) {
                this.actorManager.averageHiddenNeurons[i].tempCounter += this.actorManager.averageHiddenNeurons[i].average;
            }
        }
    }

    public getWorld(): VirtualTileWorld {
        return this.world;
    }

    public getActorManager(): ActorManager {
        return this.actorManager;
    }
}