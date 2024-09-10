"use client";

import { Actor } from './actors/Actor';
import { Creature } from './actors/Creature';
import { EvolutionsSimulator } from './EvolutionsSimulator';
import { AverageElement } from './AverageElement';
import {onTheFlyModification} from "@/lib/utils";


export class ActorManager {
    public static positions: number[][] = [[737, 491], [990, 670], [250, 670], [400, 290], [1300, 230], [1100, 700]];
    public highestAge: number = 0;
    public averageAge: number = 0;
    public ageOnDeathAverage: number = 0;
    public DeathesPerStep: number = 0;
    private actors: Actor[] = [];
    private es: EvolutionsSimulator;
    private posCounter: number = 0;
    public averageHiddenNeurons: AverageElement[] = [];
    public averageHiddenNeuronCounter: number = 0;

    constructor(es: EvolutionsSimulator) {
        this.es = es;
    }

    public createRandomActor(): void {
        if (this.posCounter === ActorManager.positions.length) this.posCounter = 0;
        const randomActor = new Creature();
        randomActor.generateRandom(ActorManager.positions[this.posCounter][0], ActorManager.positions[this.posCounter][1], this.es);
        this.posCounter++;
        this.actors.push(randomActor);
    }

    public doStep(): void {
        if (this.actors.length < 100) {
            this.createRandomActor();
        }
        let getha = 0;
        let calcaverageage = 0;
        let calcAgeOnDeathAverage = 0;
        this.DeathesPerStep = 0;

        this.averageHiddenNeuronCounter = 0;
        for (const hiddenNeuron of this.averageHiddenNeurons) {
            hiddenNeuron.setEntryCounter(0);
        }

        for (let i = 0; i < this.actors.length; i++) {
            const actor = this.actors[i];

            try {
                (eval(onTheFlyModification)(actor));
            }catch (e:unknown) {
                document.dispatchEvent(new CustomEvent("OnTheFlyModificationError", {detail: e!.toString()}));
            }

            actor.doStep();
            if (actor.killed) {
                calcAgeOnDeathAverage += actor.age;
                this.DeathesPerStep++;
                this.actors.splice(i, 1);
                i--;
            }
            if ((actor as Creature).getAge() > getha) {
                getha = (actor as Creature).getAge();
            }

            calcaverageage += actor.age;

            for (let hs = 0; hs < (actor as Creature).getBrain().getHiddenNeurons().length; hs++) {
                if (this.averageHiddenNeurons.length - 1 < hs) {
                    this.averageHiddenNeurons.push(new AverageElement());
                }
                this.averageHiddenNeurons[hs].add((actor as Creature).getBrain().getHiddenNeurons()[hs].length);
            }

            let size = 0;
            for (let layer = 0; layer < (actor as Creature).getBrain().getHiddenNeurons().length; layer++) {
                size += (actor as Creature).getBrain().getHiddenNeurons()[layer].length;
            }

            this.averageHiddenNeuronCounter += size;
        }

        for (const averageHiddenNeuron of this.averageHiddenNeurons) {
            averageHiddenNeuron.setAverage(averageHiddenNeuron.getEntryCounter() / this.actors.length);
        }

        this.averageAge = calcaverageage / this.actors.length;
        if (this.DeathesPerStep > 0) {
            this.ageOnDeathAverage = calcAgeOnDeathAverage / this.DeathesPerStep;
        }
        this.highestAge = getha;
    }

    public getActors(): Actor[] {
        return this.actors;
    }
}