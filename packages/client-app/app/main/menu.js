module.exports = {
  init,
  setWindowFocus,
  setAllowNav,
  onToggleAlwaysOnTop,
  onToggleFullScreen
}

const {app, Menu} = require('electron')
const config = require('../config')
const windows = require('./windows')

let menu = null

function init() {
  menu = Menu.buildFromTemplate(getMenuTemplate())
  Menu.setApplicationMenu(menu)
}

function setWindowFocus(flag) {
  getMenuItem('Full Screen').enebled = flag
  getMenuItem('Float on Top').enebled = flag
}

function setAllowNav(flag) {
  getMenuItem('Preferences').enebled = flag
}

function onToggleAlwaysOnTop (flag) {
  getMenuItem('Float on Top').checked = flag
}

function onToggleFullScreen (flag) {
  getMenuItem('Full Screen').checked = flag
}


function getMenuItem (label) {
  for (let i = 0; i < menu.items.length; i++) {
    const menuItem = menu.items[i].submenu.items.find(function (item) {
      return item.label === label
    })
    if (menuItem) return menuItem
  }
}

function getMenuTemplate () {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          role: 'close'
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Full Screen',
          type: 'checkbox',
          accelerator: process.platform === 'darwin'
            ? 'Ctrl+Command+F'
            : 'F11',
          click: () => windows.main.toggleFullScreen()
        },
        {
          label: 'Float on Top',
          type: 'checkbox',
          click: () => windows.main.toggleAlwaysOnTop()
        },
        {
          type: 'separator'
        },
        {
          label: 'Developer',
          submenu: [
            {
              label: 'Developer Tools',
              accelerator: process.platform === 'darwin'
                ? 'Alt+Command+I'
                : 'Ctrl+Shift+I',
              click: () => windows.main.toggleDevTools()
            }
          ]
        }
      ]
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Learn more about ' + config.APP_NAME,
          click: () => {
            const shell = require('./shell')
            shell.openExternal(config.APP_WEBSITE)
          }
        },
        {
          label: 'Check for Update',
          click: () => {
            const Updater = require('./updater')
            Updater.checkForUpdates()
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Report an Issue...',
          click: () => {
            const shell = require('./shell')
            shell.openExternal(config.APP_WEBSITE)
          }
        }
      ]
    }
  ]

  if (!windows.main.needLogin) {
    template[0].submenu.push({
      label: 'logout',
      click: () => windows.main.dispatch('logout')
    })
  }

  if (process.platform === 'darwin') {
    // Add WebTorrent app menu (Mac)
    template.unshift({
      label: config.APP_NAME,
      submenu: [
        {
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Preferences',
          accelerator: 'Cmd+,',
          click: () => windows.main.dispatch('goToPreferences')
        },
        {
          type: 'separator'
        },
        {
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    })

    // Add Window menu (Mac)
    // template.splice(5, 0, {
    //   role: 'window',
    //   submenu: [
    //     {
    //       role: 'minimize'
    //     },
    //     {
    //       type: 'separator'
    //     },
    //     {
    //       role: 'front'
    //     }
    //   ]
    // }
    // )
  }

  // On Windows and Linux, open dialogs do not support selecting both files and
  // folders and files, so add an extra menu item so there is one for each type.
  if (process.platform === 'linux' || process.platform === 'win32') {
    // File menu (Windows, Linux)
    template[0].submenu.unshift({
      label: 'Quit',
      click: () => app.quit()
    })

    // Edit menu (Windows, Linux)
    template[1].submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Preferences',
        accelerator: 'CmdOrCtrl+,',
        click: () => windows.main.dispatch('preferences')
      })

    // Help menu (Windows, Linux)
    // template[3].submenu.push(
    //   {
    //     type: 'separator'
    //   },
    //   {
    //     label: 'About ' + config.APP_NAME,
    //     click: () => windows.about.init()
    //   }
    // )
  }
  // Add "File > Quit" menu item so Linux distros where the system tray icon is
  // missing will have a way to quit the app.
  if (process.platform === 'linux') {
    // File menu (Linux)
    template[0].submenu.push({
      label: 'Quit',
      click: () => app.quit()
    })
  }

  return template
}
