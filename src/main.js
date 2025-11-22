import * as core from '@actions/core'
import { wait } from './wait.js'

import { spawn } from 'child_process'

/**
 * The main function for the action.
 *
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run() {
  try {
    const ms = core.getInput('milliseconds')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())

    // Spawn a child process that runs 'sleep 60' but detaches and allows future steps to continue
    const child = spawn('sleep', ['60'], { detached: true, stdio: 'ignore' })
    child.unref()

    core.debug(`Spawned detached child process with PID: ${child.pid}`)
    core.setOutput('child_pid', child.pid.toString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
