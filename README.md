# Setup
- create app on api.slack.com
- add it to your workspace
- add Bot User
- add necessary Authorizations to Bot User
- Enable Webhooks for App
- Add bot to slack channel
- define /commands
- define env variables in `.env` (`SIGNING_TOKEN`, `SLACK_APP_TOKEN`, `SLACK_BOT_TOKEN` )


# Start App

in terminal, in repository root
```
npm start
```

in Slack channel
```
/pick
```
fill inputs in modal prompt,
then submit

# Scope 
This slack App aims to allow members of a Slack Channel to be registered for a specific task
And randomly pick one of the selected members.
It should remember previously entered tasks, 
as well as log how often members have already been picked for that task,
so as to prioritize the members with the lowest count 
