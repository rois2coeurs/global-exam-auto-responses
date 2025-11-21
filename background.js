function is_valid_exam_url(url) {
  const regex =
    /^https:\/\/exam\.global-exam\.com\/training\/activity\/\d+\/content\/\d+$/;
  return regex.test(url);
}

async function isDisabled() {
  const data = await browser.storage.sync.get({ disable: false });
  return data.disable;
}

async function isAutoValidateEnabled() {
  const data = await browser.storage.sync.get({ autoValidate: false });
  return data.autoValidate;
}

browser.webRequest.onBeforeRequest.addListener(
  async (details) => {
    if ((await isDisabled()) || !is_valid_exam_url(details.url)) return;

    const filter = browser.webRequest.filterResponseData(details.requestId);

    let chunks = [];

    filter.ondata = (event) => {
      chunks.push(event.data);
      filter.write(event.data);
    };

    filter.onstop = async () => {
      const blob = new Blob(chunks);
      const text = await blob.text();
      try {
        const data = JSON.parse(text);
        await process_exam_questions(data);
      } catch (e) {
        console.error(e);
      }

      filter.close();
    };
  },
  { urls: ["https://exam.global-exam.com/training/*"] },
  ["blocking"],
);

function click_right_answers(questions, tabs) {
  for (const e of questions)
    if (e.is_right_answer) click_input_by_value(e.id, tabs);
}

async function process_exam_questions(data) {
  const tabs = await browser.tabs.query({
    url: "https://exam.global-exam.com/*",
  });
  if (data.props.activitySettings.correction.during_activity === null) {
    warn_toast(
      "You need to enable the correction for the extension to work",
      tabs,
    );
    return;
  }
  data.props.examQuestions.data.forEach(async (element) => {
    click_right_answers(element.exam_answers, tabs);
  });
  if (await isAutoValidateEnabled()) click_validate(tabs);
}

function click_input_by_value(value, tabs) {
  tabs.forEach((tab) => {
    browser.tabs.sendMessage(tab.id, {
      action: "clickInput",
      value: value,
    });
  });
}

function warn_toast(value, tabs) {
  tabs.forEach((tab) => {
    browser.tabs.sendMessage(tab.id, {
      action: "warnToast",
      value: value,
    });
  });
}

function click_validate(tabs) {
  tabs.forEach((tab) => {
    browser.tabs.sendMessage(tab.id, {
      action: "clickValidate",
      value: "clickValidate",
    });
  });
}
