# shitty-repost-bot
A simple bot that periodically finds the highest-rated Reddit submission from exactly one year ago and reposts it. The goal here is to demonstrate the kind of original content Reddit users produce on a daily basis.

## Timeline
```
_
|
| - June 11th, 2016
|   CIRCLJERK_REPOST_BOT was born!
|   https://www.reddit.com/user/CIRCLJERK_REPOST_BOT/
|
| - June 13th, 2016
|   First post to break 1,000 karma!
|   https://www.reddit.com/r/me_irl/comments/4ntbrn/me_irl/
|
| - June 13th, 2016
|   Banned from r/gifs!
|
| - June 15th, 2016
|   Banned from r/todayilearned!
|
| - June 16th, 2016
|   Finally up and posting 24/7!
|
∨
```

## Fun Docker timezone issue!
Apparently Docker containers are not guarrenteed to have the same timezone as the host machine. Normally this is not an issue, however when dealing with cronjobs this could lead to seemingly eratic behavior. Luckily there is an easy fix, simply share either `/etc/timezone` or `/etc/localtime` with the container as a read-only volume. For projects that use an Alpine base image (such as this project), make sure to share `/etc/localtime` as `/etc/timezone` does not exist. For example:
```
docker build -t shittyrb .
docker run -d -v /etc/localtime:/etc/localtime:ro shittyrb
```

## Fun Raspberry Pi setup issues!
We decided to use our old Raspberry Pi to run the bot 24/7. While this seemed like a great idea at the time, it has caused a surprising amount of headaches. Hopefully by documenting our agony other developers will be spared.

#### Alpine Docker image on an ARM architecture
The Raspberry Pi requires a different Alpine base image than x86 machines due to it's ARM architecture. To use it just change the Dockerfile to use the other supplied image like so:
```
# For x86 architectures
#FROM stanleyrya/alpine-node        <-- Comment this out

# For Raspberry Pi architectures
FROM hypriot/rpi-node:6.1-slim      <-- Uncomment this line
```

#### setInterval() over long intervals
On the Raspberry Pi the setInterval() function does not work over long intervals. This means that many cronjob node modules, such as [cron](https://github.com/ncb000gt/node-cron), are also affected. To bypass this issue we included a dummy cronjob that runs every twenty minutes:
```
jobs.createJob('*/20 * * * *', function() {});
```
Feel free to comment it out if you do not plan on running this bot on a Raspberry Pi.

Here are some links that cover the issue in more detail:
https://www.raspberrypi.org/forums/viewtopic.php?f=34&t=128624&start=25
https://github.com/nodejs/node/issues/4262
