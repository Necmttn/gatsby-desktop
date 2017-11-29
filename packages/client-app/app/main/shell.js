module.exports = {
  openExternal,
  openItem,
  showItemInFolder,
  moveItemToTrash
}

const electron = require('electron')
const {createLogger} = require('./log')
const log = createLogger().forWidget({name: 'shell'})

/**
 * Open the given external protocol URL in the desktop’s default manner.
 */
function openExternal (url) {
  log.info({url: url}, 'openExternal')
  electron.shell.openExternal(url)
}

/**
 * Open the given file in the desktop’s default manner.
 */
function openItem (path) {
  log.info({path: path}, 'openItem')
  electron.shell.openItem(path)
}

/**
 * Show the given file in a file manager. If possible, select the file.
 */
function showItemInFolder (path) {
  log.info({path: path}, 'showItemInFolder')
  electron.shell.showItemInFolder(path)
}

/**
 * Move the given file to trash and returns a boolean status for the operation.
 */
function moveItemToTrash (path) {
  log.info({path: path}, 'moveItemToTrash')
  electron.shell.moveItemToTrash(path)
}
