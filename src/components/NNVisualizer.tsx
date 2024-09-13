import {Creature} from "@/backend/actors/Creature";
import {Canvas, Color, InstancedMeshProps, ThreeElements, useFrame, useThree} from "@react-three/fiber";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import * as THREE from 'three'
import {MapControls, Line} from "@react-three/drei";
import {Sigmoid} from "@/backend/ai/sigmoid";
import {WorkingNeuron} from "@/backend/ai/Neuron/WorkingNeuron";
import {InputNeuron} from "@/backend/ai/Neuron/InputNeuron";
import {InstancedMesh, Vector3} from "three";
import {Connection} from "@/backend/ai/Connection";
import { Text } from "@react-three/drei";

export function NNVisualizer(props: {creature: Creature}) {


    const neurons_meaning_input = [
        "Terrain Type",
        "Underlying Vegetation",
        "Energy",
        "Feeler 1 Land Type",
        "Feeler 1 Underlying Vegetation",
        "Feeler 2 Land Type",
        "Feeler 2 Underlying Vegetation",
        "Feeler 3 Land Type",
        "Feeler 3 Underlying Vegetation",
    ]

    const neurons_meaning_output = [
        "Move Forward",
        "Rotate Right",
        "Rotate Left",
        "Eat",
        "Create Child"
    ]


    function Neurons(props: {position: ThreeElements['mesh'], color: Color}) {
        const ref = useRef<THREE.Mesh>(null!)
        const [hovered, hover] = useState(false)
        const [clicked, click] = useState(false)

       // useFrame((state, delta) => ())
        return (
            <mesh
                {...props.position}
                ref={ref}
                scale={ 1}
                frustumCulled={false}
                onClick={(event) => click(!clicked)}
                onPointerOver={(event) => hover(true)}
                onPointerOut={(event) => hover(false)}>
                <circleGeometry args={[3, 32]} />
                <meshStandardMaterial color={props.color} />
            </mesh>
        )
    }

    function ConnectionObject(props: { start:Vector3, end:Vector3, connection: Connection }) {

        let thickness = -1/(Math.abs(props.connection.getWeight()))+2;
        if(thickness < 0.01) {
            thickness = 0.01;
        }

        return (
            <Line points={[props.start, props.end]} color={0x0F00FF} linewidth={thickness}/>
        )
    }



    const sigmoid = new Sigmoid();
    function DrawNN() {
        const state = useThree()


        const width = state.size.width;
        const height = state.size.height;
        const creature = props.creature;
        const brain = creature.brain;
        const layers = brain.getHiddenNeurons().length+2;
        const neurons = brain.getHiddenNeurons();

        const spacing = (width-width*0.1)/(layers-1);

        //get layer with most neurons
        let maxNeurons = 0;
        for (let i = 0; i < brain.getHiddenNeurons().length; i++) {
            if(neurons[i].length>maxNeurons) {
                maxNeurons = neurons[i].length;
            }
        }

        if(brain.getInputNeurons().length > maxNeurons) {
            maxNeurons = brain.getInputNeurons().length;
        }

        if(brain.getOutputNeurons().length > maxNeurons) {
            maxNeurons = brain.getOutputNeurons().length;
        }

        const heightSpacing = (height-height*0.1)/(maxNeurons+1);

        const rendering_neurons = [];

        for(let i = 0; i < brain.getInputNeurons().length; i++) {
            const value = 255-Math.floor(sigmoid.activation(brain.getInputNeurons()[i].getOutputValue())*255); //color from white to green depending on value
            const color = 0x00FF00 | value | value << 16;

            const text = <Text
                scale={[4, 4, 4]}
                color="black" // default
                anchorX="right" // default
                anchorY="middle" // default
                position={[-width/2+3+width*0.1-5, -(i-(brain.getInputNeurons().length-1)/2)*heightSpacing-3, 1]}
            >
                {neurons_meaning_input[i]}
            </Text>
            rendering_neurons.push(text);
            rendering_neurons.push(<Neurons color={color} position={{position: [-width/2+3+width*0.1, -(i-(brain.getInputNeurons().length-1)/2)*heightSpacing-3, 1]}}/>)
        }

        for (let i = 0; i < brain.getHiddenNeurons().length; i++) {
            console.log("Layer: "+neurons[i].length);
            for (let j = 0; j < neurons[i].length; j++) {
                const value = 255-Math.floor(brain.getHiddenNeurons()[i][j].getOutputValue()*255); //color from white to green depending on value
                const color = 0x00FF00 | value | value << 16;
                //console log as hex
                console.log("Color: "+color.toString(16));
                rendering_neurons.push(<Neurons color={color} position={{position:[(i+1)*spacing-width/2-3, -(j-(neurons[i].length-1)/2)*heightSpacing-3, 1]}}/>)
            }
        }
        for(let i = 0; i < brain.getOutputNeurons().length; i++) {

            const value = 255-Math.floor(brain.getOutputNeurons()[i].getOutputValue()*255); //color from white to green depending on value
            const color = 0x00FF00 | value | value << 16;

            const text = <Text
                scale={[4, 4, 4]}
                color="black" // default
                anchorX="left" // default
                anchorY="middle" // default
                position={[width/2-3-width*0.1+5, -(i-(brain.getOutputNeurons().length-1)/2)*heightSpacing-3, 1]}
            >
                {neurons_meaning_output[i]}
            </Text>

            rendering_neurons.push(text);

            rendering_neurons.push(<Neurons color={color} position={{position:[width/2-3-width*0.1, -(i-(brain.getOutputNeurons().length-1)/2)*heightSpacing-3, 1]}}/>)
        }


        //add connections
        for(let i=0;i<brain.getOutputNeurons().length;i++) {
            const layer = brain.getHiddenNeurons().length > 0 ? brain.getHiddenNeurons()[brain.getHiddenNeurons().length-1]: brain.getInputNeurons();
            const layerIndex = brain.getHiddenNeurons().length > 0 ? brain.getHiddenNeurons().length: 0;
            for(let j=0;j<brain.getOutputNeurons()[i].getInputConnections().length;j++) {
                const start = new Vector3(width/2-3-width*0.1,-(i-(brain.getOutputNeurons().length-1)/2)*heightSpacing-3,0);
                const neuronIndex = layer.indexOf((brain.getOutputNeurons()[i].getInputConnections()[j].getStartNeuron() as (InputNeuron & WorkingNeuron)));
                if(neuronIndex === -1) {
                    //bias neuron found
                    continue;
                }
                const end = new Vector3((layerIndex)*spacing-width/2-3, -(neuronIndex-(layer.length-1)/2)*heightSpacing-3, 0);
                rendering_neurons.push(<ConnectionObject start={start} end={end} connection={brain.getOutputNeurons()[i].getInputConnections()[j]}/>)
            }
        }

        //add connections between hidden layers
        for(let i=brain.getHiddenNeurons().length-1;i>=0;i--) {
            const layer = brain.getHiddenNeurons()[i];
            for(let j=0;j<layer.length;j++) {
                const neuron = layer[j];
                const prevLayer = i === 0 ? brain.getInputNeurons() : brain.getHiddenNeurons()[i-1];
                for(let k=0;k<neuron.getInputConnections().length;k++) {
                    const start = new Vector3((i+1)*spacing-width/2-3,-(j-(layer.length-1)/2)*heightSpacing-3,0);
                    const neuronIndex = prevLayer.indexOf((neuron.getInputConnections()[k].getStartNeuron() as (InputNeuron & WorkingNeuron)));
                    if(neuronIndex === -1) {
                        //bias neuron found
                        continue;
                    }
                    const end = new Vector3(i===0?-width/2+3+width*0.1:(i)*spacing-width/2-3, -(neuronIndex-(prevLayer.length-1)/2)*heightSpacing-3, 0);
                    rendering_neurons.push(<ConnectionObject start={start} end={end} connection={neuron.getInputConnections()[k]}/>)
                }
            }
        }





        return rendering_neurons;



    }

  return (
      <div className={"flex flex-col gap-2 w-full justify-center"}>
          <p className={"ml-5"}>Neural Network Snapshot</p>
    <div className={"w-[97%] h-56 outline outline-black outline-2 rounded mb-4 self-center"}>
      <Canvas orthographic frameloop={"demand"} className={"w-10/12"} >
          <MapControls enableRotate={false} screenSpacePanning={true} dampingFactor={1} />
          <ambientLight intensity={Math.PI / 2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
          <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
          <DrawNN/>
          <axesHelper/>
      </Canvas>
    </div>
      </div>
  )
}