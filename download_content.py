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
    profile = request.get_json()

    # Make file directories if not already existant.
    file_path = f"./subscription/{profile['username']}"
    
    subfolders = list(profile['content_type'].keys())
    if not os.path.exists(file_path):
        for subfolder in subfolders:
            os.makedirs(f"{file_path}/{subfolder}")

    # Download content (photos/videos).
    i = 0  # Progress counter, e.g. 4/300, i = 4 in this example.
    for e in profile['content_type']['photo']['source']:
        file_name = e.split('?')[0].split('/')[-1]
        file_existance = os.path.isfile(f'{file_path}/{subfolders[2]}/{file_name}')
        i += 1
        if file_existance:
            print(f"⏭️  [{i}/{profile['content_type']['photo']['count']}] [{subfolders[2].upper()} SKIPPED, ALREADY EXISTS] = {file_name}")
            continue
        else:
            try:
                file = requests.get(e, allow_redirects=True)
                open(f'{file_path}/{subfolders[2]}/{file_name}', 'ab').write(file.content)
                print(f"✔️  [{i}/{profile['content_type']['photo']['count']}] [{subfolders[2].upper()}] = {file_name}")
            except ConnectionError:
                print("The server encountered an internal error and was unable to complete your request. Either the server is overloaded or there is an error in the application.") 
	print('Photo download finished.')
    return 'Photo download finished.'

if __name__ == '__main__':
    app.run(debug=True)
