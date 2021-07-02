import flask
from flask.helpers import url_for
from flask.templating import render_template
import requests
import os
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/download_content', methods = ['POST'])
def download_content():
    content = request.get_json()
    user_info = content.pop('userInfo')

    # Make file directories if not already existant.
    file_path = f"./subscription/{user_info['username']}"
    subfolders = ['avatar', 'photo', 'video', 'archived']
    if not os.path.exists(file_path):
        for subfolder in subfolders:
            os.makedirs(f"{file_path}/{subfolder}")

    # Download content (photos/videos).
    i = 0  # Progress counter, e.g. 4/300, i = 4 in this example.
    for e in content['imgs']:
        file_name = e.split('?')[0].split('/')[-1]
        file_existance = os.path.isfile(f'{file_path}/{subfolders[1]}/{file_name}')
        i += 1
        if file_existance:
            print(f"⏭️  [{i}/{user_info['photo_count']}] [{subfolders[1].upper()} SKIPPED, ALREADY EXISTS] = {file_name}")
            continue
        else:
            try:
                file = requests.get(e, allow_redirects=True)
                open(f'{file_path}/{subfolders[1]}/{file_name}', 'ab').write(file.content)
                print(f"✔️  [{i}/{user_info['photo_count']}] [{subfolders[1].upper()}] = {file_name}")
            except ConnectionError:
                print("The server encountered an internal error and was unable to complete your request. Either the server is overloaded or there is an error in the application.") 

    return 'Download completed.'

    #     print(f"${i}/${photo_count}. Downloading: ${file_name}")
    #     print('Photo download finished.')

    # i = 0
    # for url in data['vids']:
    #            i += 1
    #            r = requests.get(url, stream=True)
    #            file_name = url.split('?')[0].split('/')[-1]
    #            print(i, "Downloading: %s" %  file_name)
    #            open(f'./videos/{file_name}', 'wb').write(r.content)
    #            print('Video download finished.')
    # return 'Hello, world!'

if __name__ == '__main__':
    app.run(debug=True)
