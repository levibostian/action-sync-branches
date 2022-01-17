import { getInput } from "./input"
import * as git from "./git"

;(async () => {
  const input = getInput()
  await git.rebaseSyncBranches(input.behindBranchName, input.aheadBranchName)
})()
