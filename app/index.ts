import { getInput } from "./input"
import * as git from "./git"
;(async () => {
  const input = getInput()

  const repoUrl = await git.getRepoUrl(input.githubToken)
  await git.verifyAuth(repoUrl)
  await git.rebaseSyncBranches(input.behindBranchName, input.aheadBranchName, repoUrl)
})()
