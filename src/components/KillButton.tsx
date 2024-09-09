'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Skull } from 'lucide-react'
import {Creature} from "@/backend/actors/Creature";
import {doSimulationStep} from "@/lib/SimulationControler";

const Particle = ({ index }: { index: number }) => (
    <motion.div
        className="absolute w-2 h-2 bg-red-800 rounded-full"
        initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        animate={{
            opacity: 0,
            scale: 0,
            x: (Math.random() - 0.5) * 400, // Increased spread
            y: (Math.random() - 0.5) * 400, // Increased spread
            rotate: Math.random() * 360
        }}
        transition={{ duration: 1.2, delay: index * 0.02 }}
    />
)

export default function KillButton(props: { creature: Creature | null}) {
    const [isAnimating, setIsAnimating] = useState(false)

    const handleClick = () => {
        setIsAnimating(true)
        props.creature?.kill()
        doSimulationStep(props.creature!.es!);

        setTimeout(() => setIsAnimating(false), 100)
    }

    return (
            <div className="relative flex items-center justify-center">
                <motion.div
                    animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                >
                    <Button
                        variant="destructive"
                        disabled={props.creature?.killed || props.creature?.invincible}
                        className="relative overflow-visible group"
                        onClick={handleClick}
                    >
            <span className="relative z-10 flex items-center gap-2">
              <Skull className="w-5 h-5" />
              Kill Creature
            </span>
                        <AnimatePresence>
                            {isAnimating && (
                                <>
                                    <motion.div
                                        className="absolute inset-0 bg-red-800"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.7 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                    <motion.div
                                        className="absolute inset-0 flex items-center justify-center"
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                    </motion.div>
                                    {[...Array(100)].map((_, i) => ( // Increased number of particles
                                        <Particle key={i} index={i} />
                                    ))}
                                </>
                            )}
                        </AnimatePresence>
                    </Button>
                </motion.div>
            </div>
    )
}