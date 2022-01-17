import util from "util"
import { exec as execRaw } from "child_process"
const exec = util.promisify(execRaw)
import * as log from "../log"

export const execCommand = async (command: string): Promise<{ stdout: string; stderr: string }> => {
  log.verbose(`Running: ${command}\n`)
  const { stdout, stderr } = await exec(command)

  log.debug(`STDOUT: ${stdout}`)
  log.debug(`STDERR: ${stderr}`)

  return { stdout, stderr }
}
