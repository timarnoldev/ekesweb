"use client";

export class Vector2 {
    public x: number = 0;
    public y: number = 0;

    constructor(x?: number, y?: number) {
        if (x !== undefined) this.x = x;
        if (y !== undefined) this.y = y;
    }

    public set(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }
}