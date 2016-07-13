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
| - June 12th, 2016
|   First post to break 1,000 karma!
|   https://www.reddit.com/r/me_irl/comments/4ntbrn/me_irl/
|
| - June 13th, 2016
|   Banned from /r/gifs!
|
| - June 15th, 2016
|   Banned from /r/todayilearned!
|   | you're not funny
|
| - June 16th, 2016
|   Finally up and posting 24/7!
|
| - June 16th, 2016
|   Banned from /r/4chan for 30 days!
|   | >oh durr durr lookatme I posted something a day before it's a year old
|   | IT'S A LEAP YEAR FUCKER, THAT MEANS IT'S BEEN 365 DAYS
|
| - June 17th, 2016
|   Banned from /r/progresspics!
|   | unwelcome bot
|
| - June 18th, 2016
|   Banned from /r/news!
|
| - June 20th, 2016
|   Banned from /r/pics!
|
| - June 20th, 2016
|   Banned from /r/funny!
|   | Serial reposters will be banned
|
| - June 21st, 2016
|   Banned from /r/gonewild!
|
| - June 22nd, 2016
|   Banned from /r/creepy!
|   | Serial reposters will be banned
|
| - June 24th, 2016
|   First post to break 2,000 karma!
|   https://www.reddit.com/r/BlackPeopleTwitter/comments/4po9fp/pimp_my_ride/
|
| - June 25th, 2016
|   First post to break 4,000 karma!
|   https://www.reddit.com/r/Showerthoughts/comments/4ps86d/i_spent_my_early_20s_trying_to_get_new_games_to/
|
| - June 26th, 2016
|   Banned from /r/WTF!
|
| - June 26th, 2016
|   Banned from /r/worldnews!
|
| - June 27th, 2016
|   Added as an approved submitter to /r/EternityClub: front page posters only!
|
| - June 28th, 2016
|   Banned from /r/aww!
|
| - June 29th, 2016
|   Banned from /r/bestof!
|
| - June 29th, 2016
|   Banned from /r/trashy!
|   | no bots pls
|
| - June 29th, 2016
|   Banned from /r/nosleep!
|
| - June 30th, 2016
|   Banned from /r/me_irl!
|   | sorry no one liek yous
|
| - July 3rd, 2016
|   Banned from /r/AdviceAnimals!
|
| - July 3rd, 2016
|   Banned from /r/IAmA!
|   | Repost novelty / Bot account
|
| - July 3rd, 2016
|   Banned from /r/gaming!
|   | Bots and novelty accounts are also not allowed in /r/gaming.
|
| - July 3rd, 2016
|   Banned from /r/AskReddit!
|
| - July 4th, 2016
|   First post to break 6,000 karma!
|   https://www.reddit.com/r/BlackPeopleTwitter/comments/4r5uau/skateboarding_chicken/
|
| - July 5th, 2016
|   Banned from /r/technology!
|
| - July 5th, 2016
|   Banned from /r/PerfectTiming!
|
| - July 5th, 2016
|   Banned from /r/politics!
|
| - July 8th, 2016
|   Banned from /r/food!
|
| - July 9th, 2016
|   Banned from /r/self!
|
| - July 13th, 2016
|   Banned from /r/JusticePorn!
|
| - July 13th, 2016
|   Banned from /r/woahdude!
|   
∨
```

Total number of bans to date: 27

## Installation Instructions
Before running the application you will need to create your own `lib/credentials.js` file. We supplied an example file `credentials.js.example` that is filled with fake values.

Once that is taken care of you can either run the project on your host machine with node or in a docker container:
```
# docker
docker build -t shittyrb .
docker run -d -v /etc/localtime:/etc/localtime:ro shittyrb

# nodejs
npm install
npm install -g forever
forever start main.js
```

## Fun Docker timezone issue!
Apparently Docker containers are not guaranteed to have the same timezone as the host machine. Normally this is not an issue, however when dealing with cronjobs this could lead to seemingly erratic behavior. Luckily there is an easy fix, simply share either `/etc/timezone` or `/etc/localtime` with the container as a read-only volume. For projects that use an Alpine base image (such as this project), make sure to share `/etc/localtime` as `/etc/timezone` does not exist. For example:
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
