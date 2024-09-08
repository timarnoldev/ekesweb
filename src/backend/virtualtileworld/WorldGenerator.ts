"use client";
import { VirtualTileWorld } from './VirtualTileWorld';
import { LandType } from '@/backend/virtualtileworld/LandType';

export class WorldGenerator {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private imageWidth: number;
    private imageHeight: number;

    constructor(pathtoimage: string, width: number, height: number) {
        this.imageWidth = width;
        this.imageHeight = height;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.imageWidth;
        this.canvas.height = this.imageHeight;
        this.ctx = this.canvas.getContext('2d')!;
    }

    public async readImage(path: string): Promise<void> {
        try {
            const img = new Image();
            img.src = path;
            await img.decode();
            this.ctx.drawImage(img, 0, 0, this.imageWidth, this.imageHeight);
        } catch (e:any) {
            // Use fallback image
           e.printStackTrace();
        }
    }

    public async generateWorld(vtw: VirtualTileWorld): Promise<void> {
        await this.luminance();
        const imageData = this.ctx.getImageData(0, 0, this.imageWidth, this.imageHeight);
        const data = imageData.data;

        for (let x = 0; x < this.imageWidth; x++) {
            for (let y = 0; y < this.imageHeight; y++) {
                const index = (x + y * this.imageWidth) * 4;
                const red = data[index];
                if (red > 200) {
                    vtw.getTiles()[x][this.imageHeight - y - 1].setLandType(LandType.LAND);
                } else {
                    vtw.getTiles()[x][this.imageHeight - y - 1].setLandType(LandType.WATER);
                }
            }
        }
    }

    private async luminance(): Promise<void> {
        const imageData = this.ctx.getImageData(0, 0, this.imageWidth, this.imageHeight);
        const data = imageData.data;

        for (let x = 0; x < this.imageWidth; x++) {
            for (let y = 0; y < this.imageHeight; y++) {
                const index = (x + y * this.imageWidth) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];

                const luminance = 0.229 * r + 0.587 * g + 0.114 * b;
                this.setPixelColor(data, index, luminance, luminance, luminance);
            }
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    private setPixelColor(data: Uint8ClampedArray, index: number, r: number, g: number, b: number): void {
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
    }

    private getRed(data: Uint8ClampedArray, index: number): number {
        return data[index];
    }

    private getGreen(data: Uint8ClampedArray, index: number): number {
        return data[index + 1];
    }

    private getBlue(data: Uint8ClampedArray, index: number): number {
        return data[index + 2];
    }
}