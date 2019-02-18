---
title: Finding security.txt in Alexa Top 1M (part&nbsp;3)
date: 2019-02-17 21:21:12
tags:
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
seo_description: We analyze the data found by scraping security.txt results from the Alexa top 1 million domains.
---


In past posts in this series, we [wrote a naive script to check the Alexa Top 1m sites for usage of the security.txt standard](/security-txt) and then [we optimized that script to be run in practical time](/security-txt-optimization).

Now, after the script has been run, it's time to analyze it.


## Analyzing the results

A first look shows that 18403 domains host security.txt. That's nearly 2% of websites; not bad.

But, let's dive a bit deeper into the data...


## Tumblr domains

The first thing to be pointed out is that there are a number of `*.tumblr.com` domains, which all have Tumblr's security.txt.

If we eliminate all of the `*.tumblr.com` domains, we have 11014 remaining. 


## Soft 404s

Next, it seems like there are a *lot* of false positives which are actually soft 404 pages. A soft 404 is when a web-server responds with a 200 status code, but sends a "we couldn't find that" page. When we scanned for security.txt documents, we kept all status 200 responses with a short body.

How can we find the soft 404s?  Well, security.txt shouldn't include any HTML. Let's check for HTML using this function:

```python
from bs4 import BeautifulSoup

def is_html(content):
	return bool(BeautifulSoup(content, "html.parser").find())
```

After removing the soft 404s, only 4201 domains remain.


## Empty responses

Many of the responses have no content; let's clear those out.

After removing the empty responses, only 2617 domains remain.


## Parsing out the remainder

Now, there seem to still be some garbage responses. For instance, some of the responses are soft 404s which do not include HTML (e.g. a simple text response of `not found`).

Let's try the approach of looking for what would be in a security.txt file. For the valid responses that have been found, there is *definitely* a colon (`:`) and also *likely* a line break (`\r\n`, `\r` or `\n`). Let's have a look for only matches to those formats.

At this point, we only have 1612 domains left (around 0.1% of the total). 

Of those domains, it seems there are still some false positives. In a subsequent post, we'll look through the remaining data.

