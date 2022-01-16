import { execCommand } from "./exec"

export const push = async (branch: string): Promise<{ stdout: string; stderr: string }> => {
  return execCommand(`git push ${branch}`)
}
