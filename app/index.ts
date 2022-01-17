import { getInput } from "./input"
import * as git from "./git"

export const input = getInput()

;async () => {
  await git.rebaseSyncBranches(input.behindBranchName, input.aheadBranchName)
}
