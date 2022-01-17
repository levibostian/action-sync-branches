import { execCommand } from "./exec"

export const verifyAuth = async (repositoryUrl: string): Promise<void> => {
  await execCommand(`git push --dry-run --no-verify`, repositoryUrl)
}
