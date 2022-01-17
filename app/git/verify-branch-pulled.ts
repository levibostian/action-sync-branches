import { execCommand } from "./exec"
import { checkout } from "./checkout"

// Help from: https://github.com/semantic-release/semantic-release/blob/971a5e0d16f1a32e117e9ce382a1618c8256d0d9/lib/git.js#L283-L297
export const isBranchPulled = async (branch: string, repoUrl: string): Promise<boolean> => {
  await checkout(branch)

  const localCommitResult = await execCommand(`git rev-parse HEAD`, "")
  const localCommitHash = localCommitResult.stdout

  const remoteCommitResult = await execCommand(`git ls-remote --heads ${repoUrl} ${branch}`, "")
  const remoteCommitHash = remoteCommitResult.stdout.match(/^(?<ref>\w+)?/)![1]

  return localCommitHash == remoteCommitHash
}
