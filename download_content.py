from flask import Flask, request
from flask_cors import CORS
import requests
import os


app = Flask(__name__)
CORS(app, allow_headers='*')

@app.route('/download_content', methods = ['POST'])
def download_content():
    profile = request.get_json()
    username = list(profile.keys())[0]
    values = profile[username]
    file_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "subscription", username)

    # Make folders if not present already.
    if not os.path.exists(file_path):
        os.makedirs(file_path)
    subfolders = list(values.keys())
    for subfolder in subfolders:
        subfolder_path = os.path.join(file_path, subfolder)
        if not os.path.exists(subfolder_path):
            os.makedirs(subfolder_path)

    # Write content to folders.
    for k in values.keys():
        i = 0
        for v in values[k]["sources"]:
            i += 1
            file_name = v.split('?')[0].split('/')[-1]
            download_location = os.path.join(file_path, k, file_name)
            if os.path.isfile(download_location):
                print(f"⏭️  [{i}/{values[k]['amount']}] [{k.upper()} SKIPPED, ALREADY EXISTS] = {download_location}")
                continue
            else:
                try:
                    file = requests.get(v, allow_redirects=True)
                    open(download_location, 'wb').write(file.content)
                    print(f"✔️  [{i}/{values[k]['amount']}] [{k.upper()}] = {download_location}")
                except ConnectionError:
                    print("The server encountered an internal error and was unable to complete your request. Either the server is overloaded or there is an error in the application.") 
    return f"✔️ {', '.join(subfolders).capitalize()} finished downloading."

if __name__ == '__main__':
    app.run(debug=True)
