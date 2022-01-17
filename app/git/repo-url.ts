import { execCommand } from "./exec"
import * as hostedGitInfo from "hosted-git-info"

export const getRepoUrl = async (githubAuthToken: string): Promise<string> => {
  // https://x-access-token:<token>@github.com/owner/repo.git
  const { stdout } = await execCommand(`git config --get remote.origin.url`, "")
  const gitRepoInfo = hostedGitInfo.fromUrl(stdout, { noGitPlus: true })
  if (!gitRepoInfo) {
    throw new Error(`Was not able to get github repo URL from: ${stdout}`)
  }

  // Help from reading the source code of semantic-release since it performs git commands
  // https://github.com/semantic-release/semantic-release/blob/971a5e0d16f1a32e117e9ce382a1618c8256d0d9/lib/get-git-auth-url.js
  // URL docs:
  // https://docs.github.com/en/developers/apps/building-github-apps/authenticating-with-github-apps#http-based-git-access-by-an-installation
  return `https://x-access-token:${githubAuthToken}@github.com/${gitRepoInfo.user}/${gitRepoInfo.project}.git`
}
