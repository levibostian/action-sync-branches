import { execCommand } from "./exec"

export const checkout = async (branch: string, repoUrl: string): Promise<void> => {
  const { stdout } = await execCommand(`git branch --list ${branch}`, "")
  const doesBranchExistLocally = stdout != ""

  if (!doesBranchExistLocally) {
    await execCommand(
      `git fetch ${branch} ${repoUrl} +refs/heads/${branch}:refs/heads/${branch}`,
      ""
    )
  }

  await execCommand(`git checkout ${branch}`, "")
}
