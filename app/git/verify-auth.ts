import { execCommand } from "./exec"

// Help from: https://github.com/semantic-release/semantic-release/blob/971a5e0d16f1a32e117e9ce382a1618c8256d0d9/lib/git.js#L196-L212
export const verifyAuth = async (repositoryUrl: string): Promise<void> => {
  await execCommand(`git push --dry-run --no-verify`, repositoryUrl)
}
