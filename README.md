![OnlyFans ContentDownloader Banner](https://drive.google.com/uc?export=view&id=1Uj8yQ92GPE2--uzEaeMfqECWKTwj8SaF)
**Disclaimer**: I do not encourage nor support illegally spreading or downloading/scraping a user's content/material without their permission/consent in any sort of way. Any/all potential risks involved regarding your OnlyFans-account are not mine to bare. This project has been developed by me, solely to test and to better my coding-skills. The source-code is also public so that other people can learn from, improve, help with, the source-code. With that being said: enjoy! ~ MassiveSchlong!

# Table of Contents  
- [Features](#Features)
- [Requirements](#Requirements)
- [Setup](#Setup)

## Features
- Bulk download all the photos, videos, archives from your OnlyFans-subscription(s).
- Downloads differently from alternative OnlyFans-content scrapers/downloaders.
- Finds and downloads all of the specified content, not just a part of it.
- Does not break easily and requires less maintenance.
- No cookie, session or other information required.
- Easy to use, set up, and user-friendly.

## Dependencies
1. [Python](https://www.python.org/downloads/)
2. `pip install flask`
3. `pip install flask_cors`
4. `pip install requests`

## Usage
Make sure to follow the steps precisely and in chronological order!

1. Open the Python file in Visual Studio and run it via "Run Python File in Terminal".
![Step 1: Click "Run Python File in Terminal" in VSCode](https://i.ibb.co/yPRDDpk/py1.png)
2. Go to the Onlyfans profile you wish to download from via your browser. Example: https://onlyfans.com/username_of_creator
3. Select all the Javascript code (CTRL + A), then copy (CTRL + C) and paste it (CTRL + V) in your web console (SHIFT + CTRL + I) or (F12).
That's it! The download should now start.

# Known bugs/issues/deficiencies
The following list does not impact the actual functionality. This means that all the content will still downloads as intended. Consider these minor issues that only affect the user experience at minimal.
1. JS code is unnecessarily iterating over content that has already been visited. Does not impact the download process, just makes you wait longer. An estimation of the delay could be: if you were to download 50 photos, each photo taking 0,2 seconds: 50 * 0,2 = 10 seconds of download time (100%). In worst case scenario, each photo is iterated three times: 50 * 3 * 0,2 = 30 seconds of download time (300%).
2. Uncaught out of memory problems. Downloading a lot of content from one user (1000+ videos from one user for example) can give memory problems.
3. The program does not check how much storage capacity is available. If you have 10MB of free storage left and have 1GB of content to download, well then the program crashes at some point.
4. Sometimes when the page is loading, the OF website doesn't load the next content automatically and you have to press a button to load it. The code currently has no way to load the next content if that button appears. The button only appears if your browser can't handle the amount so this is unlikely to occur but could happen.
