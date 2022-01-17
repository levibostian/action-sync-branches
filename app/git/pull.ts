import { execCommand } from "./exec"

export const checkoutAndPull = async (branch: string): Promise<void> => {
  await execCommand(`git checkout ${branch} && git pull ${branch}`)
}
