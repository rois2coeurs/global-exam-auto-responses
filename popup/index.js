const disableElement = document.getElementById("disable");
const autoValidateElement = document.getElementById("auto-validate");
const autoFinishElement = document.getElementById("auto-finish");
const debugElement = document.getElementById("debug");

const DEFAULT_SETTINGS = {
  disable: true,
  autoValidate: false,
  autoFinish: false,
  debug: false,
};

async function loadSettings() {
  const data = await browser.storage.sync.get(DEFAULT_SETTINGS);
  disableElement.checked = data.disable;
  autoValidateElement.checked = data.autoValidate;
  autoFinishElement.checked = data.autoFinish;
  debugElement.checked = data.debug;
}

async function addEventsListeners() {
  disableElement.addEventListener("change", async (e) => {
    await browser.storage.sync.set({ disable: disableElement.checked });
  });
  autoValidateElement.addEventListener("change", async (e) => {
    await browser.storage.sync.set({
      autoValidate: autoValidateElement.checked,
    });
  });
  autoFinishElement.addEventListener("change", async (e) => {
    await browser.storage.sync.set({
      autoFinish: autoFinishElement.checked,
    });
  });
  debugElement.addEventListener("change", async (e) => {
    await browser.storage.sync.set({ debug: debugElement.checked });
  });
}

async function main() {
  await loadSettings();
  await addEventsListeners();
}

main();
