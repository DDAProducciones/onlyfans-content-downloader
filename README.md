![OnlyFans ContentDownloader Banner](https://drive.google.com/uc?export=view&id=1Uj8yQ92GPE2--uzEaeMfqECWKTwj8SaF)
**Disclaimer**: I do not encourage nor support illegally spreading or downloading/scraping a user's content/material without their permission/consent in any sort of way. Any/all potential risks involved regarding your OnlyFans-account are not mine to bare. This project has been developed by me, solely to test and to better my coding-skills. The source-code is also public so that other people can learn from, improve, help with, the source-code. With that being said: enjoy! ~ MassiveSchlong!

# Table of Contents  
- [Features](#Features)
- [Dependencies](#Dependencies)
- [Setup](#Setup)
- [Configurations (optional)](#Configurations)
- [Deficiencies](#Deficiencies)

## Features
- Bulk download all the photos, videos, archives from your OnlyFans-subscription(s).
- Can be easily configured to only download certain media- types or files from the content-creator.
- Can be easily configured to only download recent/new uploads from the content-creator.
- Effectively and efficiently downloads the user's content by only downloading media files that you don't have yet.
- Automatically creates a nicely structured and categorized download-folder named 'subscriptions'.
- Downloads the user's avatar and header image/photo in raw resolution.
- Downloads differently from alternative OnlyFans-content scrapers/downloaders, by simulating an actual user.
- Almost no maintenance required unlike other scrapers, because of the unique way that the content is scraped.
- Less dependencies required in comparison to other scrapers.
- Less code than alternative scrapers.
- No cookie, session, login or other information required unlike other scrapers.
- Easy to use, easy to set up, and user-friendly.
- Intelligent. Dynamically executes code-blocks based on the page state instead of a static download order. It takes the most effecient route to download the media files based on where the code is executed from.
- Shows you the download progression in both the frontend and back-end.
- Shows how many media files are hidden/locked from you.

## Dependencies
1. [Python](https://www.python.org/downloads/)
2. `pip install flask`
3. `pip install flask_cors`

## Setup
Make sure to follow the steps precisely and in chronological order!

1. Open the project folder in VSCode, then left-click the Python file and then right-click "Run Python File in Terminal".
![Run code in VSCode](https://drive.google.com/uc?export=view&id=12YdOUjuLHzQiBIVAHr9WeUCgm2NxHWK5)

2. Go to the Onlyfans profile you wish to download from via your browser (e.g.: https://onlyfans.com/username_of_creator).
![OF user page](https://drive.google.com/uc?export=view&id=17AXfRJEf8_dL875Ic7NJ-cZnAwK7pX67)

3. Select all the Javascript code (CTRL + A), then copy (CTRL + C) and paste it (CTRL + V) in your web console (SHIFT + CTRL + I) or (F12).
![JS Code in browser console](https://drive.google.com/uc?export=view&id=12FbB2T47Lbe3h9jbj7Vh6Ix6w_z67EOX)

That's it! The download should now start.

## Configurations
The JS code of this app provides configurations so that the download proces can be adjusted/altered to more specific needs. See the table below explains the various configurations you can specify for the app. You can also leave the configuration as is, in that case, the app will use the default values. These configurations can be specified for each content type.
| Name | Type | Default | Description |
| ------ | ------ | ------ | ------ |
| `download` | boolean | true | `true` allows certain or all content to be downloaded. In contrast, `false` will disallow it. The content types are `avatar`, `banner`, `photos`, `videos`, `archived`. E.g. setting the `download` value for `videos` to `false`, would disallow any videos to be downloaded. |
| `iterationSpeedDelayInSeconds` | integer | 0 | `0` delays the iteration speed over the media files (e.g. the photos and videos) by zero seconds. How higher the number (in seconds), how slower the iteration proces happens. Slowing this proces down can be useful if media files fail to load before iteration occurs. Might occur with poor server response times, bandwidth, internet connection, PC speed, browser addons, etc. Do not touch this configuration if you do not encounter issues. |
| `scrollIntervalDelayInSeconds` | integer | 3 | Delays each scroll to the bottom of the page by `3` seconds. This number depends on how fast the page loads on your machine. How higher the number, how longer each interval is delayed. This is useful on machines that need more time to load the content. In contrast, lowering the number speeds up the scrolling process. This can be risky because if the browser is not able to load all the next scrolled media files, then your download will be incomplete. On the other side, if you machine is able to load the media files fast, then you might want to consider lowering this number to save yourself time. `0` disables the delay altogether.|
| `scrollExtentInPercentage` | integer | 100 | `100` means 100% (percent). Allows you to download only a portion of the user's media files. E.g. `50` would mean, that the code will download up to 50% of the page content. `100` means 100%, to download all media files. This configuration is useful if you just want the latest uploads from a certain user instead of having to iterate over all the media files again. It allows you to save yourself time.|

# Deficiencies
The following list does not impact the actual functionality. This means that all the content will still downloads as intended. Consider these minor issues that only affect the user experience at minimal.
1. JS code is unnecessarily iterating over content that has already been visited. Does not impact the download process, just makes you wait longer. An estimation of the delay could be: if you were to download 50 photos, each photo taking 0,2 seconds: 50 * 0,2 = 10 seconds of download time (100%). In worst case scenario, each photo is iterated three times: 50 * 3 * 0,2 = 30 seconds of download time (300%).
2. The program does not check how much storage capacity is available on your local machine. If you have 10Mb of free storage left and have 1GB of content to download, well, then the program will crash when full storage capacity is reached.
