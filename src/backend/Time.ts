"use client";

export class Time {
    public TicksPerYear:number = 0.01;
    public year:number = 0;

    public Time() {

    }

    public  Tick() {
        this.year += this.TicksPerYear;
    }
}