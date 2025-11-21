let inputsToClick = [];

function clickInputByValue(value, maxRetries = 10, interval = 300) {
  let attempt = 0;

  const tryClick = () => {
    const input = document.querySelector(`input[value="${value}"]`);

    if (input) {
      input.focus(); // focus first
      const event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      input.dispatchEvent(event);
      console.log(`Clicked input with value "${value}"`);
    } else if (attempt < maxRetries) {
      attempt++;
      console.log(
        `Input "${value}" not found. Retrying ${attempt}/${maxRetries}...`,
      );
      setTimeout(tryClick, interval);
    } else {
      console.warn(`Input "${value}" not found after ${maxRetries} attempts`);
    }
  };

  tryClick();
}

browser.runtime.onMessage.addListener((msg) => {
  if (msg.action === "clickInput") {
    inputsToClick.push(msg.value);

    clickInputByValue(msg.value);
  }
});

window.addEventListener("load", () => {
  inputsToClick.forEach((val) => clickInputByValue(val));
});
