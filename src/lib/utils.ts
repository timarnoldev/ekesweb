import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export let conditionalRendering = `(current) => true`

export function setConditionalRendering(rendering: string) {
  conditionalRendering = rendering
}

export let onTheFlyModification = `(current) => {}`

export function setOnTheFlyModification(modification: string) {
  onTheFlyModification = modification
}

