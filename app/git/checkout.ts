import { execCommand } from "./exec"

export const checkout = async (branch: string): Promise<void> => {
  await execCommand(`git checkout ${branch}`, "")
}
