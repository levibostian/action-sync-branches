import {input} from "./index"

export const debug = (message: string): void => {
  if (input.debug) {
    console.log(`[DEBUG] ${message}`)
  }
}

export const message = (message: string): void => {
  console.log(message)
}

export const verbose = (message: string): void => {
  if (input.verbose || input.debug) {
    console.log(message)
  }
}