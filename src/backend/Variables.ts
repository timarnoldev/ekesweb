"use client";

export class Variables {
    public static moveFactor: number = 5;
    public static rotateFactor: number = 2;
    public static moveCostMult: number = 5;
    public static rotateCostMult: number = 3;
    public static eatMult: number = 50;
    public static permanentCostLand: number = 0.04;
    public static permanentCostWater: number = 3;
    public static eatCostMult: number = 1;
    public static createChildAge: number = 6;
    public static createChildEnergy: number = 400;
    public static eatAdmission: number = 0.8;
    public static mutation_percentage: number = 0.23;
    public static mutation_neurons: number = 4;

    public static resetToDefault(): void {
        Variables.moveFactor = 5;
        Variables.rotateFactor = 2;
        Variables.moveCostMult = 5;
        Variables.rotateCostMult = 3;
        Variables.eatMult = 50;
        Variables.permanentCostLand = 0.04;
        Variables.permanentCostWater = 3;
        Variables.eatCostMult = 1;
        Variables.createChildAge = 6;
        Variables.createChildEnergy = 400;
        Variables.eatAdmission = 0.8;
        Variables.mutation_percentage = 0.23;
        Variables.mutation_neurons = 4;
    }

}