---
title: Checking for security.txt
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
seo_description: >-
  Security.txt is a growing concept. We'll write a quick script to check the
  Alexa top 1m sites to see who's using the concept.
date: 2019-02-11 13:09:28
tags:
---


[Scott Helme's security.txt](https://scotthelme.co.uk/say-hello-to-security-txt/) is an interesting concept. It was proposed around 1 year ago, on January 1st, 2018.

After 1 year, how many sites have adopted it?

Let's have a look by checking out the Alexa top 1 million sites to see which are implementing the standard. 

This tutorial will cover a naive approach to fetching the 1 million sites. In follow up posts, we'll optimize to allow simultaneous network requests, then analyze the results.

## Alexa top 1m

First, let's download the Alexa top 1 million document.  At the time of writing, [the document is available for download from Amazon S3](http://s3.amazonaws.com/alexa-static/top-1m.csv.zip).

Download and unzip the file:

```bash
wget http://s3.amazonaws.com/alexa-static/top-1m.csv.zip
unzip top-1m.csv.zip
```

## Iterating the domains

Now that we've downloaded the top 1 million domains, we can iterate them as follows:

```python
data = {}
with open('./top-1m.csv') as f:
	for line in f.readlines():
		_, domain = line.replace('\n', '').split(',')
		data[domain] = check_domain(domain)
```

## Fetching the security.txt

According Scott Helme's site, security.txt should be placed either in the web root (`/security.txt`) or in the `.well-known` directory (`/.well-known/security.txt`). 

We'll need to install requests: `pip install requests`.

Then, let's check the URLs:

```python
def check_url(url):
	kwargs = {
		'timeout': 5
	}
	print('checking {}'.format(url))
	return requests.get(url, **kwargs).status_code == 200

def check_domain(domain):
	return {
		'/security.txt': check_url('{}/security.txt'.format(domain)),
		'/.well-known/security.txt': check_url('{}/.well-known/security.txt'.format(domain))
	}
```

## Current code

Here's our current block of code. We don't recommend running it, because it's going to take you a long time to iterate all those sites. We recommend reading it over if you're interested, but then skipping to the next section where we'll discuss inefficiencies.

```python
import requests
import json


DATA_FILE = './data.json'

def open_data():
	try:
		with open(DATA_FILE) as f:
			data = json.loads(f.read())
	except IOError:
		data = {}

	return data

def save_data(data):
	with open(DATA_FILE, 'w') as f:
		f.write(json.dumps(data))

def check_url(url):
	kwargs = {
		'timeout': 5
	}
	return requests.get(url, **kwargs).status_code == 200

def check_domain(domain):
	return {
		'/security.txt': check_url('https://{}/security.txt'.format(domain)),
		'/.well-known/security.txt': check_url('https://{}/.well-known/security.txt'.format(domain))
	}


with open('./top-1m.csv') as f:
	data = open_data()
	for line in f.readlines():
		_, domain = line.replace('\n', '').split(',')
		data[domain] = check_domain(domain)
		save_data(data)
```

## Blocking network requests

This naive approach uses blocking network requests.

We have the following:

- a 5 second timeout per request
- 2 requests per domain
- 1 million domains

In the worst case, this is going to take `5 * 2 * 1000000 = 10000000 seconds`.  That's around 115 days.  We don't really want to wait that long, so in the next tutorial we'll use `grequests` to send multiple network requests out at once.