const path = require('path')

const WINDOW_MAIN = () => {
  if ( process.env.NODE_ENV === 'development' ) {
    return 'http://127.0.0.1:3000'
  } else {
    return path.join('file://', __dirname, '/../src/index.html')
  }
}

const config = {
  APP_NAME: "Gatsby Desktop",
  APP_WEBSITE: "https://github.com/Necmttn/gatsby-desktop",
  CRASH_REPORT_URL: "http://127.0.0.0:3000",
  DELAYED_INIT: 5000 /* 5 seconds */,
  // WINDOW_MAIN: `http://localhost:3000`
  WINDOW_MAIN: WINDOW_MAIN(),
  WINDOW_INITIAL_BOUNDS: {
    width: 1024,
    height: 768 // TODO: Check perfect size for it.
  },
  UI_HEADER_HEIGHT: 20
}

module.exports = config
