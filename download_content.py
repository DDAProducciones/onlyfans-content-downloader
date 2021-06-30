from flask import Flask, render_template, request, redirect, Response
from flask_cors import CORS
import requests
app = Flask(__name__)
CORS(app)
@app.route('/test', methods = ['POST'])
def worker():
	# read json + reply
	data = request.get_json()
	print(data, "<----")

	i = 0
	for url in data['imgs']:
		i += 1
		r = requests.get(url, allow_redirects=True)
		file_name = url.split('?')[0].split('/')[-1]
		print(i, "Downloading: %s" %  file_name)
		open(f'./images/{file_name}', 'wb').write(r.content)
	print('Photo download finished.')

	i = 0
	for url in data['vids']:
		i += 1
		r = requests.get(url, stream=True)
		file_name = url.split('?')[0].split('/')[-1]
		print(i, "Downloading: %s" %  file_name)
		open(f'./videos/{file_name}', 'wb').write(r.content)
	print('Video download finished.')
	return 'Hello, world!'

if __name__ == '__main__':
	app.run()
