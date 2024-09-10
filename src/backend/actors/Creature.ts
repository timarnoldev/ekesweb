"use client";

import { Variables } from '@/backend/Variables';
import { Actor } from '@/backend/actors/Actor';

import { LandType } from '@/backend/virtualtileworld/LandType';
import { Tile } from '@/backend/virtualtileworld/Tile';
import { Feeler } from '@/backend/actors/Feeler';
import {NeuronalNetwork} from "@/backend/ai/NeuralNetwork";
import {Sigmoid} from "@/backend/ai/sigmoid";
import {EvolutionsSimulator} from "@/backend/EvolutionsSimulator";

export class Creature extends Actor {
    public brain: NeuronalNetwork;
    public feelers: Feeler[] = [];
    private moveFactor: number = Variables.moveFactor;
    private rotateFactor: number = Variables.rotateFactor;
    private moveCostMult: number = Variables.moveCostMult;
    private rotateCostMult: number = Variables.rotateCostMult;
    private eatMult: number = Variables.eatMult;
    private permanentCostLand: number = Variables.permanentCostLand;
    private permanentCostWater: number = Variables.permanentCostWater;
    private eatCostMult: number = Variables.eatCostMult;
    private createChildAge: number = Variables.createChildAge;
    private createChildEnergy: number = Variables.createChildEnergy;
    private eatAdmission: number = Variables.eatAdmission;
    private mutation_percentage: number = Variables.mutation_percentage;
    private mutation_neurons: number = Variables.mutation_neurons;
    private costMult: number = 1;
    private feelerLength: number = 15;
    public energy: number = 200;
    public rotationAngle: number = 0;
    public outMoveForward: number = 0;
    public outRotateRight: number = 0;
    public outRotateLeft: number = 0;
    public outEat: number = 0;
    public childrenCount: number = 0;
    public distanceMoved: number = 0;


    constructor() {
        super();
        this.brain = new NeuronalNetwork();
    }

    public generateRandom(x: number, y: number, es: EvolutionsSimulator): void {
        this.es! = es;
        this.XPosition = x;
        this.YPosition = y;
        this.generateFeelers();
        this.rotationAngle = Math.random() * Math.PI * 2;
        this.brain = new NeuronalNetwork();
        this.brain.createInputNeurons(3 + this.feelers.length * 2);
        this.brain.addHiddenLayer(40);
        this.brain.addHiddenLayer(40);
        this.brain.addHiddenLayer(40);
        this.brain.createOutputNeurons(5);
        this.brain.connectRandomFullMeshed();
        this.brain.addBiasForAllNeurons();
        this.brain.setAllActivationFunction(new Sigmoid());
        this.isRandom = true;
    }

    public generateFromParent(parent: Creature): void {

        this.es = parent.es;
        this.XPosition = parent.getXPosition() + 10;
        this.YPosition = parent.getYPosition() + 10;
        this.generateFeelers();
        this.rotationAngle = Math.random() * Math.PI * 2;
        let manipulateHiddenNeurons = 0;
        if (Math.random() > 0.80) {
            manipulateHiddenNeurons = Math.random() >= 0.5 ? 1 : -1;
        }
        this.brain = parent.brain.cloneFullMeshed(manipulateHiddenNeurons);
        for (let i = 0; i < this.mutation_neurons; i++) {
            this.brain.randomMutate(this.mutation_percentage);
        }
        this.isRandom = false;
        this.generation = parent.generation + 1;
        for (const f of this.feelers) {
            f.calculateFeelerPosition(this.rotationAngle, this.getXPosition(), this.getYPosition());
        }

    }

    private generateFeelers(): void {
        this.feelers.push(new Feeler(0, this.feelerLength));
        this.feelers.push(new Feeler(0, this.feelerLength * 2));
        this.feelers.push(new Feeler(0, this.feelerLength * 3));
    }

    public calculateBrain(): void {
        this.brain.reset();
        const InPositionFoodValue = this.es!.world.getTileFromActorPosition(this.getXPosition(), this.getYPosition()).getFoodValue();
        const InPositionLandTyp = this.es!.world.getTileFromActorPosition(this.getXPosition(), this.getYPosition()).getLandType() * 100;
        const InEnergy = this.energy;

        this.brain.getInputNeurons()[0].setInputValue(InPositionLandTyp);
        this.brain.getInputNeurons()[1].setInputValue(InPositionFoodValue);
        this.brain.getInputNeurons()[2].setInputValue(InEnergy);
        for (let i = 0; i < this.feelers.length; i++) {
            this.brain.getInputNeurons()[3+i].setInputValue(this.feelers[i].getFeelerTile(this.es!.getWorld(), this.rotationAngle, this.getXPosition(), this.getYPosition()).getLandType() * 100);
        }
        for (let i = 0; i < this.feelers.length; i++) {
            this.brain.getInputNeurons()[3 + i + this.feelers.length].setInputValue(this.feelers[i].getFeelerTile(this.es!.getWorld(), this.rotationAngle, this.getXPosition(), this.getYPosition()).getFoodValue() * 100);
        }
        this.outMoveForward = this.brain.getOutputNeurons()[0].getOutputValue();
        this.outRotateRight = this.brain.getOutputNeurons()[1].getOutputValue();
        this.outRotateLeft = this.brain.getOutputNeurons()[2].getOutputValue();
        this.outEat = this.brain.getOutputNeurons()[3].getOutputValue();
        const outGenerateChildren = this.brain.getOutputNeurons()[4].getOutputValue();
        this.Rotate();
        this.moveForward();
        this.eat();
        if (outGenerateChildren > 0.5) {
            this.createChild();
        }
        if (this.es!.world.getTileFromActorPosition(this.getXPosition(), this.getYPosition()).getLandType() === LandType.LAND) {
            this.costMult = this.permanentCostLand;
        } else {
            this.costMult = this.permanentCostWater;
        }
        this.energy -= this.permanentCostLand * this.costMult;
        this.costMult += this.age * 0.1//* 1/(this.childrenCount+1); //TODO experimental change
        if (this.energy < 100) {
            this.kill();
        }
    }

    public createChild(): void {
        if (this.energy >= this.createChildEnergy && this.age >= this.createChildAge) {
            const child = new Creature();
            child.generateFromParent(this);
            this.es!.actorManager.getActors().push(child);
            this.energy -= this.createChildEnergy / 2 * this.costMult;
            this.childrenCount++;
        }/*else{
            this.energy -= this.createChildEnergy / 4 * this.costMult;

        }
        */
    }

    public createFreeChild(amount: number): void {
        for (let i = 0; i < amount; i++) {
            const child = new Creature();
            child.generateFromParent(this);
            this.es!.actorManager.getActors().push(child);
            this.childrenCount++;
        }
    }

    public eat(): void {
        const t = this.es!.getWorld().getTileFromActorPosition(this.getXPosition(), this.getYPosition());
        if (this.es!.getWorld().getTileFromActorPosition(this.getXPosition(), this.getYPosition()).getLandType() === LandType.LAND) {
            let eaten = this.outEat * this.eatAdmission;
            if (this.es!.getWorld().getTileFromActorPosition(this.getXPosition(), this.getYPosition()).getFoodValue() < eaten) {
                eaten += this.es!.getWorld().getTileFromActorPosition(this.getXPosition(), this.getYPosition()).getFoodValue() - eaten;
            }
            this.energy += eaten * this.eatMult;
            t.setFoodValue(t.getFoodValue() - eaten);
        }
        this.energy -= this.outEat * this.eatCostMult * this.costMult;
    }

    public Rotate(): void {
        const rotate = this.outRotateLeft - this.outRotateRight;
        if (Math.abs(rotate) > 0.3) {
            this.rotationAngle += rotate * this.rotateFactor;
            this.energy -= Math.abs(rotate) * this.rotateCostMult * this.costMult;
        }
    }

    public moveForward(): void {
        this.XPosition += Math.cos(this.rotationAngle) * this.moveFactor * this.outMoveForward;
        this.YPosition += Math.sin(this.rotationAngle) * this.moveFactor * this.outMoveForward;
        this.distanceMoved += Math.sqrt(Math.pow(Math.cos(this.rotationAngle) * this.moveFactor * this.outMoveForward, 2) + Math.pow(Math.sin(this.rotationAngle) * this.moveFactor * this.outMoveForward, 2));
        this.energy -= this.outMoveForward * this.moveCostMult * this.costMult;
    }

    public getAge(): number {
        return this.age;
    }

    public getFeelerLength(): number {
        return this.feelerLength;
    }

    public setFeelerLength(feelerLength: number): void {
        this.feelerLength = feelerLength;
    }

    public getMoveFactor(): number {
        return this.moveFactor;
    }

    public setMoveFactor(moveFactor: number): void {
        this.moveFactor = moveFactor;
    }

    public getRotateFactor(): number {
        return this.rotateFactor;
    }

    public setRotateFactor(rotateFactor: number): void {
        this.rotateFactor = rotateFactor;
    }

    public getMoveCostMult(): number {
        return this.moveCostMult;
    }

    public setMoveCostMult(moveCostMult: number): void {
        this.moveCostMult = moveCostMult;
    }

    public getRotateCostMult(): number {
        return this.rotateCostMult;
    }

    public setRotateCostMult(rotateCostMult: number): void {
        this.rotateCostMult = rotateCostMult;
    }

    public getEatMult(): number {
        return this.eatMult;
    }

    public setEatMult(eatMult: number): void {
        this.eatMult = eatMult;
    }

    public getPermanentCostLand(): number {
        return this.permanentCostLand;
    }

    public setPermanentCostLand(permanentCostLand: number): void {
        this.permanentCostLand = permanentCostLand;
    }

    public getPermanentCostWater(): number {
        return this.permanentCostWater;
    }

    public setPermanentCostWater(permanentCostWater: number): void {
        this.permanentCostWater = permanentCostWater;
    }

    public getEatCostMult(): number {
        return this.eatCostMult;
    }

    public setEatCostMult(eatCostMult: number): void {
        this.eatCostMult = eatCostMult;
    }

    public getCreateChildAge(): number {
        return this.createChildAge;
    }

    public setCreateChildAge(createChildAge: number): void {
        this.createChildAge = createChildAge;
    }

    public getCreateChildEnergy(): number {
        return this.createChildEnergy;
    }

    public setCreateChildEnergy(createChildEnergy: number): void {
        this.createChildEnergy = createChildEnergy;
    }

    public getEatAdmission(): number {
        return this.eatAdmission;
    }

    public setEatAdmission(eatAdmission: number): void {
        this.eatAdmission = eatAdmission;
    }

    public setMutation_percentage(mutation_percentage: number): void {
        this.mutation_percentage = mutation_percentage;
    }

    public setMutation_neurons(mutation_neurons: number): void {
        this.mutation_neurons = mutation_neurons;
    }

    public getBrain(): NeuronalNetwork {
        return this.brain;
    }

    public getEnergy(): number {
        return this.energy;
    }
}