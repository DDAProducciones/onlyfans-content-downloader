from flask import Flask, request
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

@app.route('/download_content', methods = ['POST'])
def download_content():
    profile = request.get_json()

    # Make file directories if not already existant.
    file_path = f"./subscription/{profile['username']}"
    
    # Make subfolders.
    subfolders = list(profile['content_type'].keys())
    if not os.path.exists(file_path):
        for subfolder in subfolders:
            os.makedirs(f"{file_path}/{subfolder}")

    # Download content.
    for k in profile['content_type'].keys():
        i = 0  # Progress counter, e.g. 4/300, i = 4 in this example.
        for v in profile['content_type'][k]['source']:
            i += 1  
            try:
                file_name = v.split('?')[0].split('/')[-1]
                file_existance = os.path.isfile(f'{file_path}/{k}/{file_name}')
                
                if file_existance:
                    print(f"⏭️  [{i}/{profile['content_type'][k]['count']}] [{k.upper()} SKIPPED, ALREADY EXISTS] = {file_name}")
                    continue
                else:
                    file = requests.get(v, allow_redirects=True)
                    open(f'{file_path}/{k}/{file_name}', 'ab').write(file.content)
                    print(f"✔️  [{i}/{profile['content_type'][k]['count']}] [{k.upper()}] = {file_name}")
            except ConnectionError:
                print("The server encountered an internal error and was unable to complete your request. Either the server is overloaded or there is an error in the application.") 
        print('Photo download finished.')
    return 'Photo download finished.'

if __name__ == '__main__':
    app.run(debug=True)
