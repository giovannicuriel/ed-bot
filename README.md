# ed-bot

A nice script to inform people about retrospective meeting actions.

## What is it for

Suppose that you use Google Suite. And suppose that your team uses scrum. You
have daily meetings, demo meetings and retrospective meetings. You wish that,
in some way, you all could be remembered of what things were pointed out in
this retro meeting, particularly which actions should be taken. You are also
doomed to use Google Chat, because of reasons.

This script is intended to be used with Google Scripts - it will read a sheet
from Drive and send a notification message (actually two messages) to a Google
Chat room (which is supposed to be the one everyone in your team has access to).
You need to create a webhook, which will be demonstrated and deploy it.
Unfortunately, I could not find a way to install triggers by CLI - you will need
to create it by hand. But is very easy to do so.

## Sheet structure

There is no much to say about it: it should have at least two sheet. One called
'Atual' (aka 'Current', for you non portuguese speakers), and 'Anotações extras'
for other things. 'Atual' should have the following columns, in this exact
order:

- Action: what should be done
- Responsible: who should do what is supposed to be done
- Due to: until when it should be done
- Done?: is it done already?
- Link: a web site link, if needed. This can be used to indicate things like
  "fill this form until next week"

This script won't read the column name. Its position is important, though.

The 'Anotações extras' sheed should have the following columns:

- Source: any indication where this request came from
- Due to: when this task should be done
- Task: what should be done.

## Script variables

There are a few things that you need to setup before deploying this script, and
that's the configuration structure. Right at the top of 'index.ts' you should
find this structure:

```typescript
const config = {
  chatbotUrl: "WEBHOOK_URL_HERE",
  projectUrl: "GOOGLE SCRIPT PROJECT URL HERE",
  retrospective: {
    sheetId: "SPREADSHEET ID HERE",
  }
}
```

The chatbotUrl is the webhook that will be used to send messages to Google Chat.
[Here](https://developers.google.com/hangouts/chat/how-tos/webhooks) you can
find more information about how to create them.

The project URL is where the Google Script project is hosted. This will be used
only to add a link at the end of the message indicating which bot generated
that messasge (useful for disabling it after it is no longer needed). It should
look like `https://docs.google.com/spreadsheets/d/{SCRIPT_ID_GOES_HERE}/edit`.
The URL can be retrieved after its creation. Of course you can put any URL here
and change it later.

Finally, the spreadsheet ID is the ID for the spreadsheet that will be used to
generate the messages. It can be retrieved by checking the spreadsheet URL:

`https://docs.google.com/spreadsheets/d/{SPREADSHEED_ID_GOES_HERE}/edit`

## Create and deploy it

First things first: you should create the project in Google Script. You should
run:

```bash
npm run login
npm run create
# Select 'standalone'
```

It should print something like:

```text
Created new standalone script: https://script.google.com/d/{SCRIPT_ID_GOES_HERE}/edit
```

Which is the project URL you should add to the configuration structure.
After that, just push and deploy:

```bash
npm run push
npm run deploy
```

These commands will copy the code to Google Script and create a deployment.

## Authorization and first run

The first executiong, sadly, needs to be performed manually. That's because it
needs to set extra permissions in order to properly run it (it should, at least,
access a Google Drive document and send a request to an external service). To
do that, just open the project and select `sendRetrospectiveResults` and run
it. It will open a 'Ed-bot wants some permissions' window. Allow everything
to it (it is harmless, I swear), and then it will work as expected.

## Scheduled run

Google Script allow triggers to be installed - these are timed executions that
run in a particular time, which can be useful for the purpose of this bot.
Check [here](https://developers.google.com/apps-script/guides/triggers/installable)
for more information on that.