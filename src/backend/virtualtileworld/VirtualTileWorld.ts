"use client";

import {Tile} from "@/backend/virtualtileworld/Tile";
import { LandType } from './LandType';

export class VirtualTileWorld {
    private tiles: Tile[][] = [];
    private height: number = 0;
    private width: number = 0;
    private tileSize: number = 30;
    private readonly globalGrowSpeed: number = 0.005;
    private readonly maxFoodValue: number = 1;
    private landTilesCount: number = 0;
    private waterTilesCount: number = 0;
    private foodAvailable: number = 0;

    constructor(width: number, height: number, tileSize: number) {
        this.height = height;
        this.width = width;
        this.tileSize = tileSize;
        this.createMap();
    }

    public calculateTileCounts(): void {
        this.landTilesCount = 0;
        this.waterTilesCount = 0;
        for (let i = 0; i < this.tiles.length; i++) {
            for (let b = 0; b < this.tiles[i].length; b++) {
                if (this.tiles[i][b].getLandType() === LandType.LAND) {
                    this.landTilesCount++;
                } else if (this.tiles[i][b].getLandType() === LandType.WATER) {
                    this.waterTilesCount++;
                }
            }
        }


    }

    public getTileFromActorPosition(x: number, y: number): Tile {
        if (x >= 0 && y >= 0 && x < this.width * this.tileSize && y < this.height * this.tileSize) {
            return this.tiles[Math.floor(x / this.tileSize)][Math.floor(y / this.tileSize)];
        } else {
            return new Tile(LandType.NONE);
        }
    }

    public doStep(): void {
        let calcFoodAvailable = 0;
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const tile = this.tiles[x][y];
                this.grow(tile);
                if (tile.getLandType() === LandType.LAND) {
                    calcFoodAvailable += tile.getFoodValue();
                }
            }
        }
        this.foodAvailable = calcFoodAvailable / this.landTilesCount;
    }

    private grow(tile: Tile): void {
        tile.setFoodValue(tile.getFoodValue() + tile.getFertility() * this.globalGrowSpeed);
        if (tile.getFoodValue() >= this.maxFoodValue) {
            tile.setFoodValue(this.maxFoodValue);
        }
    }

    public calculateFertilities(): void {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.tiles[x][y].getLandType() === LandType.WATER) {
                    this.tiles[x][y].setFertility(1);
                }
            }
        }
        for (let i = 0; i < 20; i++) {
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    let fertilitySum = 0;
                    for (let mx = -1; mx <= 1; mx++) {
                        for (let my = -1; my <= 1; my++) {
                            if (x + mx >= 0 && y + my >= 0 && x + mx < this.width && y + my < this.height) {
                                fertilitySum += this.tiles[x + mx][y + my].getFertility();
                            }
                        }
                    }
                    fertilitySum /= 8;
                    if (this.tiles[x][y].getLandType() === LandType.LAND) {
                        this.tiles[x][y].setFertility(fertilitySum * 0.90);
                    }
                }
            }
        }
    }

    private createMap(): void {
        for (let x = 0; x < this.width; x++) {
            this.tiles[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.tiles[x][y] = new Tile(LandType.NONE);
            }
        }
    }

    public generateWorld(width: number, height: number, world: Tile[][]): void {
        this.width = width;
        this.height = height;
        this.tiles = [];
        this.createMap();
        this.tiles = world;
    }

    public setTile(x: number, y: number, tile: Tile): void {
        this.tiles[x][y] = tile;
    }

    public getTile(x: number, y: number): Tile {
        return this.tiles[x][y];
    }

    public getHeight(): number {
        return this.height;
    }

    public getWidth(): number {
        return this.width;
    }

    public getTileSize(): number {
        return this.tileSize;
    }

    public setTileSize(tileSize: number): void {
        this.tileSize = tileSize;
    }

    public getTiles(): Tile[][] {
        return this.tiles;
    }

    public getLandTilesCount(): number {
        return this.landTilesCount;
    }

    public getWaterTilesCount(): number {
        return this.waterTilesCount;
    }

    public getFoodAvailable(): number {
        return this.foodAvailable;
    }
}