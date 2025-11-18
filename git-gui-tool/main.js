const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const https = require("https");
const simpleGit = require("simple-git");

let mainWindow;
const credsPath = path.join(app.getPath("userData"), "git-creds.json");
const REPO_URL = "https://github.com/1962HCSuper-User/HA-Mart.git";
const REPO_OWNER = "1962HCSuper-User";
const REPO_NAME = "HA-Mart";
// CHANGED: Download to app folder instead of userData
const REPO_PATH = path.join(__dirname, REPO_NAME);

// TODO: Replace with your GitHub OAuth App Client ID
const CLIENT_ID = "Ov23li8DREwK66VRCJI4"; // Get from https://github.com/settings/developers

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,  // ENHANCED: Wider window
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile("index.html");
}

// Helper: POST to GitHub for device code
function postDeviceCode(clientId) {
  return new Promise((resolve, reject) => {
    const postData = `client_id=${encodeURIComponent(clientId)}&scope=repo`;
    const options = {
      hostname: "github.com",
      port: 443,
      path: "/login/device/code",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "Content-Length": Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (d) => { data += d; });
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

// Helper: Poll for access token
function pollAccessToken(deviceCode, interval, clientId) {
  return new Promise((resolve, reject) => {
    const pollFunc = () => {
      const postData = `client_id=${encodeURIComponent(clientId)}&device_code=${encodeURIComponent(deviceCode)}&grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Adevice_code`;
      const options = {
        hostname: "github.com",
        port: 443,
        path: "/login/oauth/access_token",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (d) => { data += d; });
        res.on("end", () => {
          try {
            const params = new URLSearchParams(data);
            const error = params.get("error");
            if (error === "authorization_pending") {
              setTimeout(pollFunc, interval * 1000);
              return;
            } else if (error) {
              reject(new Error(params.get("error_description") || error));
              return;
            }
            const token = params.get("access_token");
            if (token) {
              resolve(token);
            } else {
              reject(new Error("No access token received"));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on("error", reject);
      req.write(postData);
      req.end();
    };
    pollFunc();
  });
}

// Helper: Get GitHub user
function getGithubUser(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path: "/user",
      method: "GET",
      headers: {
        "Authorization": `token ${token}`,
        "User-Agent": "electron-git-app"
      }
    };

    https.get(options, (res) => {
      let data = "";
      res.on("data", (d) => { data += d; });
      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Status ${res.statusCode}`));
        }
      });
    }).on("error", reject);
  });
}

// Helper: Check if collaborator (handles 403 as false)
function isCollaborator(token, username) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path: `/repos/${REPO_OWNER}/${REPO_NAME}/collaborators/${username}`,
      method: "GET",
      headers: {
        "Authorization": `token ${token}`,
        "User-Agent": "electron-git-app"
      }
    };

    https.get(options, (res) => {
      if (res.statusCode === 204) {
        resolve(true);
      } else if (res.statusCode === 404 || res.statusCode === 403) {
        resolve(false);
      } else {
        let data = "";
        res.on("data", (d) => { data += d; });
        res.on("end", () => {
          reject(new Error(`Status ${res.statusCode}: ${data}`));
        });
      }
    }).on("error", reject);
  });
}

// ----------------- Credentials ----------------- (ENHANCED: Token expiry check)
ipcMain.handle("save-creds", async (_, creds) => {
  fs.writeFileSync(credsPath, JSON.stringify(creds));
  return "Credentials saved!";
});

ipcMain.handle("load-creds", async () => {
  if (fs.existsSync(credsPath)) {
    return JSON.parse(fs.readFileSync(credsPath, "utf-8"));
  }
  return null;
});

ipcMain.handle("clear-creds", async () => {
  if (fs.existsSync(credsPath)) {
    fs.unlinkSync(credsPath);
  }
  return "Credentials cleared!";
});

ipcMain.handle("validate-token", async (_, token) => {
  try {
    const user = await getGithubUser(token);
    return { valid: true, username: user.login };
  } catch (err) {
    // ENHANCED: Distinguish expiry (401) from other errors
    if (err.message.includes("401")) {
      return { valid: false, expired: true };
    }
    return { valid: false, expired: false };
  }
});

// ----------------- GitHub Login (Device Flow) -----------------
ipcMain.on("start-github-login", async (event) => {
  const clientId = CLIENT_ID;
  if (!clientId || clientId === "your_client_id_here") {
    event.sender.send("auth-complete", { success: false, error: "Please set CLIENT_ID in main.js" });
    return;
  }

  try {
    const device = await postDeviceCode(clientId);
    event.sender.send("device-code", {
      user_code: device.user_code,
      verification_uri: device.verification_uri,
      interval: device.interval || 5
    });
    
    setTimeout(() => {
      shell.openExternal(device.verification_uri);
    }, 1500);

    const token = await pollAccessToken(device.device_code, device.interval || 5, clientId);
    const user = await getGithubUser(token);
    const isCollab = await isCollaborator(token, user.login);
    const creds = { username: user.login, token, isCollaborator: isCollab, timestamp: Date.now() };  // ENHANCED: Add timestamp for expiry
    fs.writeFileSync(credsPath, JSON.stringify(creds));
    event.sender.send("auth-complete", { success: true, username: user.login, isCollaborator: isCollab });
  } catch (err) {
    event.sender.send("auth-complete", { success: false, error: err.message });
  }
});

// ----------------- Git Operations (ENHANCED: Progress, Dates) -----------------
const getCreds = () => {
  if (fs.existsSync(credsPath)) {
    return JSON.parse(fs.readFileSync(credsPath, "utf-8"));
  }
  return null;
};

// Helper: Send progress update
const sendProgress = (percent, phase, type = 'general') => {
  mainWindow.webContents.send('progress-update', { percent, phase, type });
};

// Helper: Get last commit date
const getLastCommitDate = async (repoPath) => {
  const git = simpleGit(repoPath);
  try {
    const log = await git.log({ n: 1 });
    return log.latest.date ? new Date(log.latest.date).toLocaleDateString() : 'Unknown';
  } catch {
    return 'No commits';
  }
};

// Helper: Get file modified dates in status
const getFileDates = (files) => {
  return files.map(file => ({
    ...file,
    modifiedDate: fs.existsSync(path.join(REPO_PATH, file.path)) 
      ? new Date(fs.statSync(path.join(REPO_PATH, file.path)).mtime).toLocaleString() 
      : 'Unknown'
  }));
};

ipcMain.handle("repo-exists", async () => {
  return fs.existsSync(REPO_PATH);
});

ipcMain.handle("clone-repo", async () => {
  if (fs.existsSync(REPO_PATH)) {
    return "Repository already downloaded!";
  }
  const git = simpleGit();
  try {
    await git.clone(REPO_URL, REPO_PATH, {
      progress: ({ phase, loaded, total }) => {
        const percent = total > 0 ? Math.round((loaded / total) * 100) : 0;
        sendProgress(percent, phase, 'clone');
      }
    });
    sendProgress(100, 'Complete', 'clone');
    return "Repository downloaded successfully!";
  } catch (err) {
    sendProgress(0, 'Error', 'clone');
    return `Clone failed: ${err.toString()}`;
  }
});

ipcMain.handle("status", async () => {
  if (!fs.existsSync(REPO_PATH)) {
    return "Repository not downloaded! Download first.";
  }
  const git = simpleGit(REPO_PATH);
  try {
    const status = await git.status();
    const lastDate = await getLastCommitDate(REPO_PATH);
    let msg = status.isClean() 
      ? `Repository is up-to-date! No changes. Last updated: ${lastDate}` 
      : `Repository has changes! Files modified: ${status.files ? status.files.length : 0}. Last updated: ${lastDate}\nModified files:\n${getFileDates(status.files || []).map(f => `- ${f.path} (Updated: ${f.modifiedDate})`).join('\n')}`;
    return msg;
  } catch (err) {
    return `Status check failed: ${err.toString()}`;
  }
});

ipcMain.handle("pull-repo", async () => {
  if (!fs.existsSync(REPO_PATH)) {
    return "Repository not downloaded! Download first.";
  }
  const git = simpleGit(REPO_PATH);
  try {
    sendProgress(0, 'Starting pull...', 'pull');  // Spinner trigger
    await git.pull({
      progress: ({ phase, loaded, total }) => {
        const percent = total > 0 ? Math.round((loaded / total) * 100) : 0;
        sendProgress(percent, phase, 'pull');
      }
    });
    sendProgress(100, 'Pull complete', 'pull');
    return "Pulled latest changes successfully!";
  } catch (err) {
    sendProgress(0, 'Error', 'pull');
    return `Pull failed: ${err.toString()}`;
  }
});

ipcMain.handle("push-updates", async () => {
  const creds = getCreds();
  if (!creds?.isCollaborator) {
    return "You are not a collaborator. Cannot push changes.";
  }
  if (!fs.existsSync(REPO_PATH)) {
    return "Repository not downloaded! Download first.";
  }
  const git = simpleGit(REPO_PATH);
  try {
    sendProgress(0, 'Checking changes...', 'push');
    const status = await git.status();
    if (status.isClean()) {
      sendProgress(0, 'No changes', 'push');
      return "No changes to commit!";
    }
    await git.add(".");
    await git.commit("Update from Git GUI Tool");
    sendProgress(50, 'Pushing...', 'push');
    if (creds) {
      const remotes = await git.getRemotes(true);
      if (remotes.length > 0) {
        const originUrl = remotes.find((r) => r.name === "origin").refs.fetch;
        const pushUrl = originUrl.replace(/^https:\/\/(.*)/, `https://${creds.username}:${creds.token}@$1`);
        await git.push(pushUrl, "main", {
          progress: ({ phase, loaded, total }) => {
            const percent = 50 + (total > 0 ? Math.round((loaded / total) * 50) : 0);
            sendProgress(percent, phase, 'push');
          }
        });
      }
    } else {
      await git.push();
    }
    sendProgress(100, 'Push complete', 'push');
    return "Committed and pushed successfully!";
  } catch (err) {
    sendProgress(0, 'Error', 'push');
    return `Push failed: ${err.toString()}`;
  }
});

ipcMain.handle("upload-file", async () => {
  const creds = getCreds();
  if (!creds?.isCollaborator) {
    return "You are not a collaborator. Cannot upload changes.";
  }
  if (!fs.existsSync(REPO_PATH)) {
    return "Repository not downloaded! Download first.";
  }
  const result = await dialog.showOpenDialog({
    properties: ["openFile", "openDirectory", "multiSelections"]
  });
  if (result.canceled) return "No files selected.";

  const totalFiles = result.filePaths.length;
  let copied = 0;
  result.filePaths.forEach((filePath) => {
    const baseName = path.basename(filePath);
    const dest = path.join(REPO_PATH, baseName);
    fs.cpSync(filePath, dest, { recursive: true });
    copied++;
    const percent = Math.round((copied / totalFiles) * 100);
    sendProgress(percent, `Copied ${copied}/${totalFiles}`, 'upload');
  });

  const git = simpleGit(REPO_PATH);
  try {
    await git.add(".");
    await git.commit("Added new files/folders from upload");
    sendProgress(100, 'Uploading to GitHub...', 'upload');

    const remotes = await git.getRemotes(true);
    if (remotes.length > 0) {
      const originUrl = remotes.find((r) => r.name === "origin").refs.fetch;
      const pushUrl = originUrl.replace(/^https:\/\/(.*)/, `https://${creds.username}:${creds.token}@$1`);
      await git.push(pushUrl, "main", {
        progress: ({ phase, loaded, total }) => {
          const percent = 100 + (total > 0 ? Math.round((loaded / total) * 100) : 0);  // Beyond 100 for push
          sendProgress(Math.min(percent, 200), phase, 'upload');  // Cap at 200 visually
        }
      });
    } else {
      await git.push();
    }
    sendProgress(100, 'Upload complete', 'upload');
    return `Files uploaded and pushed successfully! (${totalFiles} items)`;
  } catch (err) {
    sendProgress(0, 'Error', 'upload');
    return `Upload failed: ${err.toString()}`;
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});