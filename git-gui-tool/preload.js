const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("gitAPI", {
  // Login
  startGithubLogin: (clientId) => ipcRenderer.send("start-github-login", clientId),
  onDeviceCode: (cb) => ipcRenderer.on("device-code", cb),
  onAuthComplete: (cb) => ipcRenderer.on("auth-complete", cb),

  // Creds
  loadCreds: () => ipcRenderer.invoke("load-creds"),
  clearCreds: () => ipcRenderer.invoke("clear-creds"),
  validateToken: (token) => ipcRenderer.invoke("validate-token"),

  // Git
  repoExists: () => ipcRenderer.invoke("repo-exists"),
  cloneRepo: () => ipcRenderer.invoke("clone-repo"),
  pullRepo: () => ipcRenderer.invoke("pull-repo"),
  pushUpdates: () => ipcRenderer.invoke("push-updates"),
  status: () => ipcRenderer.invoke("status"),
  uploadFile: () => ipcRenderer.invoke("upload-file"),

  // ENHANCED: Progress listener
  onProgress: (cb) => ipcRenderer.on("progress-update", cb)
});