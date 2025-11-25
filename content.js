let inputsToClick = [];
let isDebug = false;
browser.storage.sync.get({ debug: false }).then((value) => {
  isDebug = value.debug;
});

async function isAutoFinishEnabled() {
  const data = await browser.storage.sync.get({ autoFinish: false });
  return data.autoFinish;
}

function clickInputByValue(value, maxRetries = 10, interval = 300) {
  let attempt = 0;

  const tryClick = () => {
    const input = document.querySelector(`input[value="${value}"]`);

    if (input) {
      input.click();
      if (isDebug) console.log(`Clicked input with value "${value}"`);
      inputsToClick = inputsToClick.filter((i) => i != value);
    } else if (attempt < maxRetries) {
      attempt++;
      if (isDebug)
        console.log(
          `Input "${value}" not found. Retrying ${attempt}/${maxRetries}...`,
        );
      setTimeout(tryClick, interval);
    } else {
      if (isDebug)
        console.warn(`Input "${value}" not found after ${maxRetries} attempts`);
    }
  };

  tryClick();
}

async function clickValidate(maxRetries = 10, interval = 300) {
  const btnText = ["valider", "suivant"];
  let attempt = 0;
  if (await isAutoFinishEnabled()) btnText.push("terminer");

  const tryClick = async () => {
    const btn = [...document.querySelectorAll("button")].find((b) =>
      btnText.includes(b.textContent.trim().toLowerCase()),
    );
    if (inputsToClick.length > 0) {
      setTimeout(tryClick, interval);
      if (isDebug) console.log("Waiting for all responses to be clicked!");
    } else if (btn) {
      btn.click();
      if (isDebug) console.log(`Clicked validate with value "${value}"`);
    } else if (attempt < maxRetries) {
      attempt++;
      if (isDebug)
        console.log(`Validate not found. Retrying ${attempt}/${maxRetries}...`);
      setTimeout(tryClick, interval);
    } else {
      if (isDebug)
        console.warn(`Validate not found after ${maxRetries} attempts`);
    }
  };
  tryClick();
}

browser.runtime.onMessage.addListener(async (msg) => {
  if (msg.action === "clickInput") {
    inputsToClick.push(msg.value);
    clickInputByValue(msg.value);
  } else if (msg.action === "clickValidate") {
    await clickValidate();
  }
});
