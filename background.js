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
        console.log("Response JSON:", data);

        await process_exam_questions(data);
      } catch (e) {
        console.log("Response text:", text);
      }

      filter.close();
    };
  },
  { urls: ["<all_urls>"] },
  ["blocking"],
);

function click_right_answers(questions) {
  for (const e of questions) if (e.is_right_answer) click_input_by_value(e.id);
}

async function process_exam_questions(data) {
  data.props.examQuestions.data.forEach((element) => {
    click_right_answers(element.exam_answers);
  });
}

function click_input_by_value(value) {
  browser.tabs.query({ url: "https://exam.global-exam.com/*" }).then((tabs) => {
    tabs.forEach((tab) => {
      browser.tabs.sendMessage(tab.id, { action: "clickInput", value: value });
    });
  });
}
