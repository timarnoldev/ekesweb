"use client";
export enum LandType {
    NONE = -1,
    LAND = 0,
    WATER = 1
}

export class LandTypeHelper {
    public static getValue(type: LandType): number {
        return type;
    }
}