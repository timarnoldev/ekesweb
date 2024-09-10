import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export let conditionalRendering = `(currentActor) => true`

export function setConditionalRendering(rendering: string) {
  conditionalRendering = rendering
}
