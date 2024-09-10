"use client";


import { Connection } from './Connection';
import { ActivationFunction } from './ActivationFunction';
import {InputNeuron} from "@/backend/ai/Neuron/InputNeuron";
import {WorkingNeuron} from "@/backend/ai/Neuron/WorkingNeuron";

export class NeuronalNetwork {
    private inputNeurons: InputNeuron[] = [];
    private hiddenNeurons: WorkingNeuron[][] = [];
    private outputNeurons: WorkingNeuron[] = [];
    private isBiasUsed: boolean = false;

    constructor() {}

    public backpropagation(shoulds: number[], epsilon: number): void {
        if (shoulds.length !== this.outputNeurons.length) {
            throw new Error('IllegalArgumentException');
        }
        this.reset();

        for (let i = 0; i < this.outputNeurons.length; i++) {
            this.outputNeurons[i].calculateOutputDelta(shoulds[i]);
        }

        if (this.hiddenNeurons.length > 0) {
            for (let i = 0; i < this.outputNeurons.length; i++) {
                this.outputNeurons[i].backpropagateSmallDelta();
            }
            for (let a = 1; a < this.hiddenNeurons.length; a++) {
                for (let i = 0; i < this.hiddenNeurons[a].length; i++) {
                    this.hiddenNeurons[a][i].backpropagateSmallDelta();
                }
            }
        }

        for (let i = 0; i < shoulds.length; i++) {
            this.outputNeurons[i].deltaLearning(epsilon);
        }
        for (let i = this.hiddenNeurons.length - 1; i >= 0; i--) {
            for (let a = 0; a < this.hiddenNeurons[i].length; a++) {
                this.hiddenNeurons[i][a].deltaLearning(epsilon);
            }
        }
    }

    public reset(): void {
        for (const a of this.hiddenNeurons) {
            for (const wn of a) {
                wn.reset();
            }
        }
        for (const on of this.outputNeurons) {
            on.reset();
        }
    }

    public setAllActivationFunction(af: ActivationFunction): void {
        for (const a of this.hiddenNeurons) {
            for (const wn of a) {
                wn.setActivationFunction(af);
            }
        }
        for (const n of this.outputNeurons) {
            n.setActivationFunction(af);
        }
    }

    public clearConnections(): void {
        for (const a of this.hiddenNeurons) {
            for (const wn of a) {
                wn.getInputConnections().length = 0;
            }
        }
        for (const n of this.outputNeurons) {
            n.getInputConnections().length = 0;
        }
    }

    public clearNetwork(): void {
        this.inputNeurons.length = 0;
        this.hiddenNeurons.length = 0;
        this.outputNeurons.length = 0;
        this.isBiasUsed = false;
    }

    public createInputNeurons(n: number): void {
        for (let i = 0; i < n; i++) {
            this.inputNeurons.push(new InputNeuron());
        }
    }

    public addHiddenLayer(n: number): void {
        const hidden: WorkingNeuron[] = [];
        this.hiddenNeurons.push(hidden);
        for (let i = 0; i < n; i++) {
            hidden.push(new WorkingNeuron());
        }
    }

    public createOutputNeurons(n: number): void {
        for (let i = 0; i < n; i++) {
            this.outputNeurons.push(new WorkingNeuron());
        }
    }

    public setInputValues(...v: number[]): void {
        if (v.length !== this.inputNeurons.length) {
            throw new Error('IndexOutOfBoundsException');
        }
        for (let i = 0; i < this.inputNeurons.length; i++) {
            this.inputNeurons[i].setInputValue(v[i]);
        }
    }

    public createFullMesh(...weights: number[]): void {
        if (this.hiddenNeurons.length === 0) {
            if (weights.length !== this.inputNeurons.length * this.outputNeurons.length) {
                throw new Error('RuntimeException');
            }

            let index = 0;

            for (const wn of this.outputNeurons) {
                for (const inNeuron of this.inputNeurons) {
                    wn.addInputConnection(new Connection(inNeuron, weights[index++]));
                }
            }
        } else {
            if (weights.length !== this.inputNeurons.length * this.hiddenNeurons.length + this.hiddenNeurons.length * this.outputNeurons.length) {
                throw new Error('RuntimeException');
            }

            let index = 0;

            for (const hidden of this.hiddenNeurons[0]) {
                for (const inNeuron of this.inputNeurons) {
                    hidden.addInputConnection(new Connection(inNeuron, weights[index++]));
                }
            }

            for (let i = 0; i < this.hiddenNeurons.length - 1; i++) {
                for (let j = 0; j < this.hiddenNeurons[i].length; j++) {
                    for (let k = 0; k < this.hiddenNeurons[i + 1].length; k++) {
                        this.hiddenNeurons[i + 1][k].addInputConnection(new Connection(this.hiddenNeurons[i][j], weights[index++]));
                    }
                }
            }

            for (const out of this.outputNeurons) {
                for (const hidden of this.hiddenNeurons[this.hiddenNeurons.length - 1]) {
                    out.addInputConnection(new Connection(hidden, weights[index++]));
                }
            }
        }
    }

    private connectFullMeshedRI(random: boolean, initWeights: number): void {
        if (this.hiddenNeurons.length === 0) {
            for (const wn of this.outputNeurons) {
                for (const inNeuron of this.inputNeurons) {
                    if (random) {
                        wn.addInputConnection(new Connection(inNeuron, Math.random() * 2 - 1));
                    } else {
                        wn.addInputConnection(new Connection(inNeuron, initWeights));
                    }
                }
            }
        } else {
            for (const hidden of this.hiddenNeurons[0]) {
                for (const inNeuron of this.inputNeurons) {
                    if (random) {
                        hidden.addInputConnection(new Connection(inNeuron, Math.random() * 2 - 1));
                    } else {
                        hidden.addInputConnection(new Connection(inNeuron, initWeights));
                    }
                }
            }

            for (let layer = 1; layer < this.hiddenNeurons.length; layer++) {
                for (let right = 0; right < this.hiddenNeurons[layer].length; right++) {
                    for (let left = 0; left < this.hiddenNeurons[layer - 1].length; left++) {
                        if (random) {
                            this.hiddenNeurons[layer][right].addInputConnection(new Connection(this.hiddenNeurons[layer - 1][left], Math.random() * 2 - 1));
                        } else {
                            this.hiddenNeurons[layer][right].addInputConnection(new Connection(this.hiddenNeurons[layer - 1][left], initWeights));
                        }
                    }
                }
            }

            for (const out of this.outputNeurons) {
                for (const hidden of this.hiddenNeurons[this.hiddenNeurons.length - 1]) {
                    if (random) {
                        out.addInputConnection(new Connection(hidden, Math.random() * 2 - 1));
                    } else {
                        out.addInputConnection(new Connection(hidden, initWeights));
                    }
                }
            }
        }
    }

    public addBiasForAllNeurons(): void {
        const bias = new InputNeuron();
        bias.setInputValue(1);
        for (const wn of this.outputNeurons) {
            wn.addInputConnection(new Connection(bias, Math.random() * 2 - 1));
        }
        for (const awn of this.hiddenNeurons) {
            for (const wn of awn) {
                wn.addInputConnection(new Connection(bias, Math.random() * 2 - 1));
            }
        }
        this.isBiasUsed = true;
    }

    public connectFullMeshed(): void {
        this.connectFullMeshedRI(false, 0.5);
    }

    public connectFullMeshedWithWeight(initWeights: number): void {
        this.connectFullMeshedRI(false, initWeights);
    }

    public connectRandomFullMeshed(): void {
        this.connectFullMeshedRI(true, -1);
    }

    public getInputNeurons(): InputNeuron[] {
        return this.inputNeurons;
    }

    public setInputNeurons(inputNeurons: InputNeuron[]): void {
        this.inputNeurons = inputNeurons;
    }

    public getOutputNeurons(): WorkingNeuron[] {
        return this.outputNeurons;
    }

    public setOutputNeurons(outputNeurons: WorkingNeuron[]): void {
        this.outputNeurons = outputNeurons;
    }

    public addNeuron(hiddenIndex: number, neuronIndex: number): void {
        this.hiddenNeurons[hiddenIndex].splice(neuronIndex, 0, new WorkingNeuron());
    }

    public removeNeuron(hiddenIndex: number, neuronIndex: number): void {
        if (this.hiddenNeurons[hiddenIndex].length > 1) {
            this.hiddenNeurons[hiddenIndex].splice(neuronIndex, 1);
        }
    }

    public cloneFullMeshed(manipulateHiddenNeurons: number): NeuronalNetwork {
        const network = new NeuronalNetwork();
        network.createInputNeurons(this.inputNeurons.length);
        for (let i = 0; i < this.hiddenNeurons.length; i++) {
            network.addHiddenLayer(this.hiddenNeurons[i].length);
        }

        const r = Math.floor(Math.random() * network.hiddenNeurons.length);
        if (manipulateHiddenNeurons > 0) {
            for (let i = 0; i < manipulateHiddenNeurons; i++) {
                network.addNeuron(r, Math.floor(Math.random() * (network.hiddenNeurons[r].length - 1)));
            }
        } else if (manipulateHiddenNeurons < 0) {
            for (let i = 0; i < Math.abs(manipulateHiddenNeurons); i++) {
                network.removeNeuron(r, Math.floor(Math.random() * (network.hiddenNeurons[r].length - 1)));
            }
        }

        network.createOutputNeurons(this.outputNeurons.length);
        network.connectFullMeshedRI(false, 1);

        if (this.isBiasUsed) {
            network.addBiasForAllNeurons();
        }
        for (let i = 0; i < this.outputNeurons.length; i++) {
            for (let i1 = 0; i1 < this.outputNeurons[i].getInputConnections().length; i1++) {
                try {
                    network.getOutputNeurons()[i].getInputConnections()[i1].setWeight(this.outputNeurons[i].getInputConnections()[i1].getWeight());
                } catch (e) {
                    // e.printStackTrace();
                }
            }
        }
        for (let i = 0; i < this.hiddenNeurons.length; i++) {
            for (let i1 = 0; i1 < this.hiddenNeurons[i].length; i1++) {
                for (let i2 = 0; i2 < this.hiddenNeurons[i][i1].getInputConnections().length; i2++) {
                    if (i1 <= network.hiddenNeurons[i].length - 1 && network.hiddenNeurons[i][i1].getInputConnections().length - 1 >= i2) {
                        try {
                            network.hiddenNeurons[i][i1].getInputConnections()[i2].setWeight(this.hiddenNeurons[i][i1].getInputConnections()[i2].getWeight());
                        } catch (e:unknown) {
                            //e.printStackTrace();
                        }
                    }
                }
            }
        }

        return network;
    }

    public neuronHiddenAndOutputCount(): number {
        let count = this.outputNeurons.length;
        for (const hidden of this.hiddenNeurons) {
            count += hidden.length;
        }
        return count;
    }

    public randomMutate(mutationRate: number): void {
        const index = Math.floor(Math.random() * this.neuronHiddenAndOutputCount());
        if (index < this.outputNeurons.length) {
            this.outputNeurons[index].randomMutate(mutationRate);
        }
        for (const hidden of this.hiddenNeurons) {
            if (index < hidden.length) {
                hidden[index].randomMutate(mutationRate);
            }
        }
    }

    public getHiddenNeurons(): WorkingNeuron[][] {
        return this.hiddenNeurons;
    }

    public setHiddenNeurons(hiddenNeurons: WorkingNeuron[][]): void {
        this.hiddenNeurons = hiddenNeurons;
    }
}