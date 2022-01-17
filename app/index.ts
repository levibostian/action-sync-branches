import { getInput } from "./input"
import * as git from "./git"
import { env } from "process"
;(async () => {
  const input = getInput()

  const githubAuthToken = env["GITHUB_TOKEN"]
  if (!githubAuthToken || githubAuthToken == "") {
    throw new Error(
      "Action needs to be able to authenticate with GitHub in order to run git commands. Read the documentation about authentication and try again."
    )
  }

  const repoUrl = await git.getRepoUrl(githubAuthToken)
  await git.verifyAuth(repoUrl)
  await git.rebaseSyncBranches(input.behindBranchName, input.aheadBranchName, repoUrl)
})()
