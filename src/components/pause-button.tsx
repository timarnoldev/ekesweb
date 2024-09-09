
"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"

export function PauseButton(props: {toggle: () => void}) {
  const [isPlaying, setIsPlaying] = useState(true)

  const togglePlayPause = () => {
    setIsPlaying((prevState) => !prevState);
    props.toggle();
  }
  return (
    <Button
      onClick={togglePlayPause}
      className="flex items-center justify-center gap-2 rounded-md px-4 py-2 transition-colors hover:bg-primary/80 w-fit "
    >
      {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
      {isPlaying ? "Pause Simulation" : "Resume Simulation"}
    </Button>
  )
}

function PauseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="14" y="4" width="4" height="16" rx="1" />
      <rect x="6" y="4" width="4" height="16" rx="1" />
    </svg>
  )
}


function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  )
}
