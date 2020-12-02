/**
 *
 * hypixel-checker
 *
 * Checks if anyone has logged into your account and notifies you
 *
 * Github Repository:
 *
 *
 * Change config by entering your username and api key 👇
 **/
const path = require("path");
const { app, BrowserWindow } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "./assets/logo.jpg"),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile("./public/index.html");
};
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
