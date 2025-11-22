function ensureContainer() {
  let container = document.getElementById("___gear_toast_container");
  if (!container) {
    container = document.createElement("div");
    container.id = "___gear_toast_container";
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "20px";
    container.style.zIndex = 999999;
    container.style.display = "flex";
    container.style.flexDirection = "column-reverse";
    container.style.gap = "8px";
    document.body.appendChild(container);
  }
  return container;
}

function createToast(htmlContent, bgColor, duration) {
  const container = ensureContainer();

  const toast = document.createElement("div");
  toast.style.background = bgColor;
  toast.style.color = "white";
  toast.style.padding = "10px 16px";
  toast.style.borderRadius = "6px";
  toast.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  toast.style.fontSize = "20px";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.gap = "8px";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.3s";

  const content = document.createElement("div");
  content.innerHTML = htmlContent;
  content.style.display = "flex";
  content.style.alignItems = "center";
  content.style.gap = "8px";
  toast.appendChild(content);

  const closeBtn = document.createElement("div");
  closeBtn.textContent = "✕";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.marginLeft = "auto";
  closeBtn.style.fontWeight = "bold";
  closeBtn.style.opacity = "0.8";
  closeBtn.addEventListener("mouseenter", () => (closeBtn.style.opacity = "1"));
  closeBtn.addEventListener(
    "mouseleave",
    () => (closeBtn.style.opacity = "0.8"),
  );

  closeBtn.onclick = () => {
    toast.style.opacity = "0";
    toast.addEventListener("transitionend", () => toast.remove());
  };
  toast.appendChild(closeBtn);

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.addEventListener("transitionend", () => toast.remove());
  }, duration);
}

function showWarnToast(message) {
  const svgPath = browser.runtime.getURL("assets/public/warning.svg");
  const html = `
       <div style="display:flex;align-items:center;gap:8px;">
         <img src="${svgPath}" width="24" height="24" />
         <span>${message}</span>
       </div>
     `;
  createToast(html, "#e69500", 15000);
}

browser.runtime.onMessage.addListener((msg) => {
  if (msg.action === "warnToast") {
    showWarnToast(msg.value);
  }
});
