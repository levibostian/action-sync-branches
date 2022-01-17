import { Input } from "./type/input"
import * as core from "@actions/core"

export const getInput = (): Input => {
  return {
    aheadBranchName: core.getInput("ahead"),
    behindBranchName: core.getInput("behind"),
    debug: core.getInput("log") == "debug",
    verbose: core.getInput("log") == "verbose"
  }
}
