// The logs that this action creates are helpful for debugging and understanding 
// how the action works. Therefore, at this time we do not enable/disable certain 
// types of logs. We print all of them. 

export const message = (message: string): void => {
  console.log(message)
}

export const verbose = (message: string): void => {
  console.log(message)
}