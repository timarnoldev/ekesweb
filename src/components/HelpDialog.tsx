import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {ArrowRight, Info} from "lucide-react";
import {Card} from "@/components/ui/card";
import Image from "next/image";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


export function HelpDialog() {
    return <Dialog>
        <DialogTrigger asChild className=""><Button><Info /></Button></DialogTrigger>
        <DialogContent className={"w-2/3 min-w-fit"}>
            <DialogHeader>
                <DialogTitle>EKES - Evolution Simulation</DialogTitle>
                <DialogDescription>
                    This is a simulation of a simple ecosystem with creatures that can move around and reproduce. The
                    creatures have a limited amount of energy and can die if they run out of it. The creatures can also
                    reproduce themselves and pass on their genes to their offspring. The simulation is based on the
                    concept of genetic algorithms and is intended to demonstrate the principles of evolution and natural
                    selection.

                    <div className="mt-2"/>
                    The project originates from the <a aria-label="Jugend forscht"
                                                       href="https://www.jugend-forscht-bayern.de/aktuelles-allgemeines/detail/landeswettbewerb-preistraeger/#:~:text=EKES%20%2D%20Einfache%20KI%2Dbasierte%20Evolutions%2DSimulation"
                                                       target="_blank" className="underline text-lime-950">Jugend
                    forscht competition</a> which received
                    state-wide recognition in 2021.

                    <div className="mt-2"/>

                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Technical Details</AccordionTrigger>
                            <AccordionContent>
                                <div className="mt-2">The simulation is implemented in TypeScript and uses the React
                                    framework for the user interface. The application was ported from Java. You can find
                                    the original <a href="https://github.com/ft-ki/EKES"
                                                    className="underline text-lime-950">here</a>. Per default all neural
                                    networks consist of two hidden layers with 20 neurons each. All networks are
                                    full-meshed and use the sigmoid activation function.
                                </div>
                                <div className="mt-2"/>

                                <div className="mt-2">If there are less than 100 creatures in the simulation, new
                                    completely random creatures are generated at fixed entry points.
                                    Be careful when tuning reproduction parameters. If the creatures reproduce too fast, the page may become unresponsive.
                                    We may fix this in the future by moving the simulation to a web worker.
                                </div>

                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className="mt-2"/>

                    <div className="font-semibold leading-none tracking-tight mt-4 mb-4 text-base">About us</div>
                    <div className="mt-2"/>


                    <div className="flex flex-row gap-4 justify-center w-full">
                        <Card onClick={() => window.open("https://tim-arnold.de")}
                              className="p-2 flex flex-row gap-3 cursor-pointer pr-3">
                            <Image width={80} height={80} src={"/timarnold.webp"} alt={"Tim Arnold"}
                                   className={"rounded-full outline-2 outline outline-accent"}></Image>
                            <div className="flex flex-col gap-1 self-center">
                                <p className={"text-lg"}>Tim Arnold</p>
                                <div className={"flex flex-row gap-1 items-center"}>
                                    <p>Personal Portfolio</p>
                                    <ArrowRight/>
                                </div>
                            </div>
                        </Card>

                        <Card onClick={() => window.open("https://linktr.ee/felix.vonludowig")} className="p-2 flex flex-row gap-3 cursor-pointer pr-3">
                            <Image width={80} height={80} src={"/felixvonludowig.webp"} alt={"Felix von Ludowig"}
                                   className={"rounded-full outline-2 outline outline-accent"}></Image>
                            <div className="flex flex-col gap-1 self-center">
                                <p className={"text-lg"}>Felix von Ludowig</p>
                                <div className={"flex flex-row gap-1 items-center"}>
                                    <p>Personal Portfolio</p>
                                    <ArrowRight/>
                                </div>
                            </div>
                        </Card>

                    </div>


                </DialogDescription>
            </DialogHeader>
            <div>

            </div>

        </DialogContent>
    </Dialog>;
}