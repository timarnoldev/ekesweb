"use client";
import { LandType } from './LandType';

export class Tile {
    private landType: LandType;
    private foodValue: number = 0;
    private fertility: number = 0;

    constructor(landType: LandType) {
        this.landType = landType;
    }

    public getLandType(): LandType {
        return this.landType;
    }

    public setLandType(landType: LandType): void {
        this.landType = landType;
    }

    public getFoodValue(): number {
        return this.foodValue;
    }

    public setFoodValue(foodValue: number): void {
        this.foodValue = foodValue;
    }

    public getFertility(): number {
        return this.fertility;
    }

    public setFertility(fertility: number): void {
        this.fertility = fertility;
    }
}