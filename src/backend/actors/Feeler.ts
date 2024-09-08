"use client";

import { Vector2 } from '@/backend/Vector2';
import { Tile } from '@/backend/virtualtileworld/Tile';
import { VirtualTileWorld } from '@/backend/virtualtileworld/VirtualTileWorld';

export class Feeler {
    private angle: number;
    private feelerLength: number;
    private readonly feelerPos: Vector2 = new Vector2();

    constructor(angle: number, feelerLength: number) {
        this.angle = angle;
        this.feelerLength = feelerLength;
    }

    public getAngle(): number {
        return this.angle;
    }

    public setAngle(angle: number): void {
        this.angle = angle;
    }

    public getFeelerLength(): number {
        return this.feelerLength;
    }

    public setFeelerLength(feelerLength: number): void {
        this.feelerLength = feelerLength;
    }

    public calculateFeelerPosition(rotationAngle: number, x: number, y: number): void {
        this.feelerPos.set(
            Math.floor(x + Math.cos(rotationAngle + this.angle) * this.feelerLength),
            Math.floor(y + Math.sin(rotationAngle + this.angle) * this.feelerLength)
        );
    }

    public getFeelerTile(vtw: VirtualTileWorld, rotationAngle: number, x: number, y: number): Tile {
        this.calculateFeelerPosition(rotationAngle, x, y);
        return vtw.getTileFromActorPosition(this.feelerPos.x, this.feelerPos.y);
    }

    public getFeelerPosition(): Vector2 {
        return this.feelerPos;
    }
}