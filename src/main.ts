import {app, BrowserWindow} from "electron";
import * as path from "path";
import * as url from "url"

  function createWindow () {
    const height = 500;
    const width = Math.round(height * 235 / 400);

    let win = new BrowserWindow({width: width, height: height, resizable: false, title: "Kalkulator"})
  
    win.setMenu(null);

    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    }))
  }
  
  app.on('ready', createWindow)