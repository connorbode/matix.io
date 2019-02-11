---
title: Finding security.txt in Alexa Top 1M (part 2)
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
seo_description: 'Using grequests, search the Alexa Top 1M sites for instances of security.txt.'
date: 2019-02-11 14:15:28
tags:
---


In the last post, [we wrote a naive script to check which of the Alexa Top 1m sites were using the security.txt protocol](security-txt).

This script won't be used because it might take around 115 days to run. It needs to be optimized.

As a recap, the issue was that blocking network requests were being sent out one at a time.

How can we fix this? If we use send out batches of network requests, we'll still block on the responses but our execution time will be improved by the size of the batch.

## Using `grequests` to send out batches of requests

[grequests](https://github.com/kennethreitz/grequests) is a great library that will let us send out batches of requests. 

`grequests` has a similar syntax to the `requests` library. However, you usually need to refactor your code as the style of usage is a bit different.

The main difference is you need to think in blocks. With `requests`, you can execute a request, then handle the response. With `grequests`, you need to build your block of requests, then execute your requests, then handle the responses.

Remember the three steps:

1. Build your block of requests
2. Execute your requests
3. Handle the responses


```python
import grequests

BATCH_SIZE = 50

requests = []

with open('./top-1m.csv') as f:
	for line in f.readlines(): 
		_, domain = line.replace('\n', '').split(',')

		# step 1: Build your block of requests
		requests += build_requests(domain)

		if len(requests) > BATCH_SIZE:

			# step 2: Execute your requests
			responses = grequests.map(requests)

			# step 3: Handle the responses
			for response in responses:
				handle_response(response)

			requests = []
```

`grequests.map` is the function that blocks on the network requests. It takes the list of requests and turns them into a list of responses.

## Building a request

Building a request has the same syntax as when you're using `requests`:

```python
def build_requests(domain):
	kwargs = {'timeout': 5}
	return [
		grequests.get('https://{}/security.txt'.format(domain), **kwargs),
		grequests.get('https://{}/.well-known/security.txt'.format(domain), **kwargs)
	]
```

## Handling the response

The trick with handling the response is that you usually need the context of the request. We have that context via `response.request`.

Here's a quick sample:

```python
def handle_response(response):
	if response.status_code == 200 and len(response.content) < 2000:
		return True
	else:
		return False
```



## Putting it all together

Here's the final code that we'll run to check Alexa Top 1M for security.txt:

```python
import grequests
import json


DATA_FILE = './data.json'
BATCH_SIZE = 50

def open_data():
	try:
		with open(DATA_FILE) as f:
			data = json.loads(f.read())
	except:
		data = {}

	return data

def save_data(data):
	with open(DATA_FILE, 'w') as f:
		f.write(json.dumps(data))


def build_requests(domain):
	kwargs = {'timeout': 5}
	return [
		grequests.get('https://{}/security.txt'.format(domain), **kwargs),
		grequests.get('https://{}/.well-known/security.txt'.format(domain), **kwargs)
	]

def handle_response(response, data):
	if response and response.status_code == 200 and len(response.content) < 2000:
		domain = response.url.replace('https://', '').split('/')[0]
		
		if domain not in data:
			data[domain] = {}

		try:
			if response.url.__contains__('.well-known'):
				data[domain]['.well-known'] = response.content.decode('utf8')
			else:
				data[domain]['root'] = response.content.decode('utf8')
		except:
			pass
		
		save_data(data)

current_line = 0
data = open_data()
requests = []
with open('./top-1m.csv') as f:
	for line in f.readlines(): 
		_, domain = line.replace('\n', '').split(',')
		requests += build_requests(domain)

		if len(requests) > BATCH_SIZE:
			responses = grequests.map(requests)
			for response in responses:
				handle_response(response, data)

			requests = []
			print('{}/1000000 ({}%)'.format(current_line, 100 * current_line / 1000000))

		current_line += 1
```

## Next steps

The main issue here is that we're making a couple of assumptions for the URL:

- We're assuming the site uses `https`
- We're assuming that the domain responds to a request to a non-`www.` domain

It might be a better idea to use domains from CommonCrawl (this would also provide a much larger list of domains).

The next steps for the project are.. analysis!