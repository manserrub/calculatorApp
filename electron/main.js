
const { app, BrowserWindow } = require("electron");
const path = require("path");

app.setAppUserModelId("com.example.javawebcalculator");

function createWindow() {

    const mainWindow = new BrowserWindow({
        width: 450,
        height: 750,
        minWidth: 350,
        minHeight: 600,
        title: "Java Web Calculator",
        autoHideMenuBar: true,
        backgroundColor: "#111827",

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        }
    });

    mainWindow.loadURL("http://127.0.0.1:8080");
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
}) ;

