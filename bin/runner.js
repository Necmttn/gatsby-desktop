'use strict'

const exec = require('child_process').exec
const treeKill = require('tree-kill')
const fs = require('fs')
const os = require('os')
const chalk = require('chalk')

let isElectronOpen = false

function format(command, data, color) {
  return `${chalk[color](command)}  ${data.toString().trim().replace(/\n/g, '\n' + repeat(' ', command.length + 2))}
`
}

function repeat (str, times) {
  return (new Array(times + 1)).join(str)
}

let children = []

function run (command, color, name) {
  let child = exec(command)

  child.stdout.on('data', data=> {
    console.log(format(name, data, color))

  /**
   * Start Electron after valid build of renderer process.
   */

    if (/Compiled/g.test(data.toString().trim().replace(/\n/g, '\n' + repeat(' ', command.length + 2))) && !isElectronOpen) {
      console.log(`${chalk.blue('Starting electron...')}\n`)
      run('cross-env NODE_ENV=development yarn client', 'blue', 'electron')
      isElectronOpen = true
    }

  })
  child.on('exit', code => exit(code))

  children.push(child)
}

function exit (code) {
  children.forEach(child => {
    treeKill(child.pid)
  })
}

run('yarn renderer', 'yellow', 'react')
