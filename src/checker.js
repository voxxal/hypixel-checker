const fs = require("fs");
const yaml = require("js-yaml");
const INFO = {
  VERSION_NUMBER: "1.0.0",
  VERSION_HASH: (() => {
    try {
      return require("child_process")
        .execSync("git rev-parse HEAD")
        .toString()
        .trim();
    } catch (err) {
      console.log(err);
    }
  })(),
};
const CONFIG = (() => {
  try {
    const doc = yaml.safeLoad(fs.readFileSync("config.yml", "utf8"));
    return doc;
  } catch (e) {
    console.log(e);
  }
})();

window.onload = () => {
  const createLine = ({ text, color = "white" }) => {
    let div = document.createElement("div");
    let code = document.createElement("code");
    code.innerHTML = text;
    code.style.color = color;
    div.appendChild(code);

    document.getElementById("terminal").appendChild(div);
  };
  const axios = require("axios");
  const path = require("path");
  const { app, BrowserWindow } = require("electron");
  let LAST_KNOWN_LOGIN;
  createLine({ text: "hypixel-checker", color: "aquamarine" });
  setInterval(
    () => {
      axios
        .get(`https://api.hypixel.net/player`, {
          params: {
            key: CONFIG.API_KEY,
            name: CONFIG.USERNAME,
          },
        })
        .then((res) => {
          const lastLogin = res.data.player.lastLogin;
          if (LAST_KNOWN_LOGIN == undefined) LAST_KNOWN_LOGIN = lastLogin;
          else if (LAST_KNOWN_LOGIN != lastLogin) {
            if (CONFIG.NOTIFICATIONS)
              new Notification("hypixel-checker", {
                body: `Login Detected at ${new Date(
                  lastLogin
                ).toLocaleString()}`,
                icon: path.join(__dirname, "./assets/icon.png"),
              });

            LAST_KNOWN_LOGIN = res.data.player.lastLogin;
            createLine({
              text: `Login Detected at <span style="color:red;">${new Date(
                lastLogin
              ).toLocaleString()}</span>`,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          createLine({
            text: `An error has occured: ${err.response.data.cause}`,
            color: "red",
          });
        });
    },
    CONFIG.CHECK_FREQUENCY > 0.5 ? CONFIG.CHECK_FREQUENCY * 1000 : 500
  );
};
