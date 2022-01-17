import { execCommand } from "./exec"

export const checkoutAndPull = async (branch: string, repoUrl: string): Promise<void> => {
  await execCommand(`git checkout ${branch}`, repoUrl)
  await execCommand(`git pull ${branch}`, repoUrl)
}
