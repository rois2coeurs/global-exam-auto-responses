function is_valid_exam_url(url) {
  const regex =
    /^https:\/\/exam\.global-exam\.com\/training\/activity\/\d+\/content\/\d+$/;
  return regex.test(url);
}

browser.webRequest.onBeforeRequest.addListener(
  async (details) => {
    if (!is_valid_exam_url(details.url)) return;

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
  data.props.examQuestions.data.forEach(async (element) => {
    click_right_answers(element.exam_answers, tabs);
  });
}

function click_input_by_value(value, tabs) {
  tabs.forEach((tab) => {
    browser.tabs.sendMessage(tab.id, {
      action: "clickInput",
      value: value,
    });
  });
}
