![OnlyFans ContentDownloader Banner](https://drive.google.com/uc?export=view&id=1Uj8yQ92GPE2--uzEaeMfqECWKTwj8SaF)
**Disclaimer**: I do not encourage nor support illegally spreading or downloading/scraping a user's content/material without their permission/consent in any sort of way. Any/all potential risks involved regarding your OnlyFans-account are not mine to bare. This project has been developed by me, solely to test and to better my coding-skills. The source-code is also public so that other people can learn from, improve, help with, the source-code. With that being said: enjoy! ~ CameraDesuYo!

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

## Dependencies
1. [Python](https://www.python.org/downloads/)
2. `pip install flask`
3. `pip install flask_cors`
4. `pip install requests`

## Usage
Make sure to follow the steps precisely and in chronological order!
1. Open the Python file in Visual Studio and run it (CTRL + ALT + N). 
2. Go to the Onlyfans profile you wish to download from via your browser. Example: https://onlyfans.com/username_of_creator
3. Select all the Javascript code (CTRL + A), then copy (CTRL + C) and paste it (CTRL + V) in your web console (SHIFT + CTRL + I) or (F12).
That's it! The download should now start.

# Known bugs/issues/deficiencies
The following list does not impact the actual functionality. This means that all the content will still downloads as intended. Consider these minor issues that only affect the user experience at m
1. Code is redundant in some places. Does not impact the download process! Just not optimally coded. You won't really notice though qua speed.
2. JS code is unnecessarily iterating over content that has already been visited. Does not impact the download process, just makes you wait a couple seconds longer.