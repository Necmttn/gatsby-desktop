

const winConfig = {
  backgroundColor: '#FFFFFF',
  darkTheme: true, // Forces dark theme (GTK+3)
  icon: getIconPath(), // Window icon (Windows, Linux)
  minWidth: needLogin ? config.WINDOW_LOGIN_INITIAL_BOUNDS.width : config.WINDOW_MIN_WIDTH,
  minHeight: needLogin ? config.WINDOW_LOGIN_INITIAL_BOUNDS.height : config.WINDOW_MIN_HEIGHT,
  title: config.APP_WINDOW_TITLE,
  titleBarStyle: 'hiddenInset', // Hide title bar (Mac)
  useContentSize: true, // Specify web page size without OS chrome
  show: true
}

function init (options = {}) {
  if (main.win) {
    return main.win.show()
  }
  log.info('main win init')
  const win = main.win = new electron.BrowserWindow(winConfig)

  win.loadURL(config.WINDOW_MAIN)
  log.info('main win loadURL', config.WINDOW_MAIN)
  if (process.env.NODE_ENV === 'development') {
    electron.BrowserWindow.addDevToolsExtension(path.join(__dirname, '../../../node_modules/devtron'))
    const { default: installExtension, REACT_DEVTOOLS } = require('electron-devtools-installer')
    installExtension(VUEJS_DEVTOOLS)
      .then((name) => {
        console.log(`Added Extension:  ${name}`)
        win.webContents.openDevTools()
      })
      .catch((err) => {
        console.log('An error occurred: ', err)
      })
  }
  win.once('ready-to-show', () => {
    log.info('main win ready to show')
    if (!options.hidden) win.show()
  })

  if (win.setSheetOffset) {
    win.setSheetOffset(config.UI_HEADER_HEIGHT)
  }

  win.webContents.on('dom-ready', function () {
    menu.onToggleFullScreen(main.win.isFullScreen())
  })

  win.webContents.on('will-navigate', (e, url) => {
    // Prevent drag-and-drop from navigating the Electron window, which can happen
    // before our drag-and-drop handlers have been initialized.
    e.preventDefault()
  })

  win.on('blur', onWindowBlur)
  win.on('focus', onWindowFocus)

  win.on('hide', onWindowBlur)
  win.on('show', onWindowFocus)

  win.on('enter-full-screen', function () {
    menu.onToggleFullScreen(true)
    send('fullscreenChanged', true)
    win.setMenuBarVisibility(false)
  })

  win.on('leave-full-screen', function () {
    menu.onToggleFullScreen(false)
    send('fullscreenChanged', false)
    win.setMenuBarVisibility(true)
  })

  win.on('move', debounce(function (e) {
    send('windowBoundsChanged', e.sender.getBounds())
  }, 1000))

  win.on('resize', debounce(function (e) {
    send('windowBoundsChanged', e.sender.getBounds())
  }, 1000))

    if (!app.isQuitting) {
      e.preventDefault()
      main.win.hide()
    }
  })
}
