import pkg from "@slack/bolt";
const { App, AwsLambdaReceiver } = pkg;

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Initializes your app with your bot token and app token
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: awsLambdaReceiver,
});

const keywordResponses = [{ keyword: "こんにちは", reply: "こんにちは" }];

app.event("app_mention", async ({ event, say }) => {
  const text = event.text;
  const matched = keywordResponses.find(({ keyword }) =>
    text.includes(keyword),
  );

  if (matched) {
    await say({
      text: `@${event.user} ${matched.reply}`,
      thread_ts: event.thread_ts ?? event.ts,
    });
  } else {
    await say({
      text: `<@${event.user}>`,
    });
  }
});

export const handler = async (event, context, callback) => {
  const lambdaHandler = await awsLambdaReceiver.start();
  return lambdaHandler(event, context, callback);
};
