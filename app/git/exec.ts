import util from "util"
import { exec as execRaw } from "child_process"
const exec = util.promisify(execRaw)

export const execCommand = async (command: string): Promise<{ stdout: string; stderr: string }> => {
  console.log(`Running: ${command}\n`)
  const { stdout, stderr } = await exec(command)

  console.log(stdout)
  console.error(stderr)

  return { stdout, stderr }
}
