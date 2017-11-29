
'use strict'

console.time('init')

const electron = require('electron')
const app = electron.app
const windows = require('./windows')
const { log } = require('./log')
const menu = require('./menu')
const crashReporter = require('../crash-reporter')
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

let mainWindow

function init ()  {
  let isReady = false // when is true; app ready windows can be created
  app.ipcReady = false // main window has finished loading and IPC is ready
  app.isQuitting = false
  app.on('ready', () => onReady())
  console.log('start')
  function onReady (err, results) {
    log.info('app onReady')
    if (err) throw err
    isReady = true
    log.info('initialize windows')
    windows.main.init()
    menu.init()

    // To keep app startup fast, some code is delayed.
    // setTimeout(delayedInit, config.DELAYED_INIT)

    // Report uncaught expections.
    process.on('uncaughtException', (err) => {
      console.error(err)
      const error = {message: err.message, stack: err.stack}
      windows.main.dispatch('uncaughtError', 'main', error)
    })
  }

  app.on('open-file', onOpen)
  app.on('open-url', onOpen)

  app.once('will-finish-launching', function () {
    crashReporter.init()
  })

  app.once('window-all-closed', function () {
    log.warn('quit app because all window closed')
    app.isQuitting = true
    app.quit()
  })

  app.once('ipcReady', function () {
    log.info('Command line args:', argv)
    processArgv(argv)
    console.timeEnd('init')
  })

  app.once('before-quit', function (e) {
    log.warn('App before quit')
    if (app.isQuitting) return
    app.isQuitting = true
    e.preventDefault()
    // TODO: save the state of app before closing
    log.info('hide the app')
    windows.main.hide()
    //then close
    setTimeout(() => {
      log.info('saving state took longer quiting')
      app.quit()
    }, 5000) // quit after 5 secs, at most
  })

  app.on('activate', function () {
    if (isReady) windows.main.show()
  })

}


function onOpen (e, thing) {
  console.log('onOpen ', thing)
}


init()
