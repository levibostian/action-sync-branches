import { checkout } from "./checkout"
import { execCommand } from "./exec"
import { push } from "./push"
import { isBranchPulled } from "./verify-branch-pulled"
import * as log from "../log"

export const areBranchesOutOfSync = async (behind: string, ahead: string): Promise<boolean> => {
  // Compare the git commit history between branches https://stackoverflow.com/a/13965448
  const { stdout } = await execCommand(`git log ${behind}..${ahead}`, "")
  const noDifferenceBetweenBranches = stdout == ""

  return !noDifferenceBetweenBranches
}

export const checkRebaseSuccessful = async (
  rebaseStdout: string,
  behind: string,
  ahead: string
): Promise<boolean> => {
  // If doing `git rebase develop` when on `main` branch and `develop` is ahead of `main`, you should get:
  // Successfully rebased and updated refs/heads/main.

  const successfulRebaseResult = rebaseStdout.startsWith("Successfully rebased and updated")

  const branchesOutOfSync = await areBranchesOutOfSync(behind, ahead)

  return successfulRebaseResult && !branchesOutOfSync
}

export const rebaseSyncBranches = async (
  behind: string,
  ahead: string,
  repoUrl: string
): Promise<void> => {
  const behindIsUpToDate = await isBranchPulled(behind, repoUrl)
  const aheadIsUpToDate = await isBranchPulled(ahead, repoUrl)
  if (!behindIsUpToDate || !aheadIsUpToDate) {
    throw new Error(
      "There are commits pushed to branches in remote not available locally. Therefore, I will not try to perform a sync."
    )
  }

  await checkout(behind)

  const needToRebase = await areBranchesOutOfSync(behind, ahead)
  if (!needToRebase) {
    log.message("Branches are identical. No need to sync. Exiting.")
    return
  }

  const { stdout } = await execCommand(`git rebase ${ahead}`, "")

  const isRebaseSuccessful = await checkRebaseSuccessful(stdout, behind, ahead)

  if (!isRebaseSuccessful) {
    throw new Error(
      `Rebase was not successful. The goal is that the branches: ${behind} and ${ahead} contain the same git commit history together. However, I was not able to do this automatically for you.\n\nSee the git command logs I made for you to debug the issue. You will now need to manually fix the issue yourself by running git commands on your computer and pushing those changes to the git repository.`
    )
  }

  await push(behind, repoUrl)

  return
}
