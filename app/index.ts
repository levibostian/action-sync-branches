import { getInput } from "./input"
import * as git from "./git"

const input = getInput()

;async () => {
  await git.rebaseSyncBranches(input.behindBranchName, input.aheadBranchName)
}
