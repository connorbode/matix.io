---
title: Parsing semi-structured data using WHISK
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
seo_description: >-
  Use the WHISK information extraction algorithm to extract the number of
  bedrooms from property rental listings.
date: 2019-02-24 15:02:09
tags:
---


_In this series, we'll explore the WHISK information extraction algorithm which is used to generate regular expressions for extracted information from semi-structured data._


## What is WHISK used for in information extraction?

To explain, let's start with a dataset. Go on any listings site, like Craigslist or Kijiji, and look at the apartments section.  The listing titles will vary:

- Absolutely Stunning, 2 Bedroom, 2 Bathroom Stacked Townhouse
- 1 Bedroom, 2 Level Townhome In The Electra Towns
- New Condos 1 Bedr, 87 Peter St, Possession date: Immediately
- Warden/Kennedy 1B+D 2bath suite, locker, parking available immediately
- Warden/7 1 bed+den suite with locker, parking available April 1, 2019!

Let's say you want to extract the number of bedrooms from these titles. The text is semi-structured; that is, there is no predefined format, but the data we want to extract is there.

How can we extract the data?

We could manually write a complex regex for each of the scenarios:

`[0-9]+\s?(Bedroom|bedroom|Bedr|bedr|B|b|Bed|bed)`

It's possible, but we're programmers and we can only repeat a task so many times before we try to automate it.

The WHISK algorithm helps us to automatically generate our rules. It does require some manual work to train, but it will be better than manually writing and testing the rules.


## Collecting some test data

In order to play around with WHISK, we'll need to first get some test data. We'll write a Python script to pull some titles from [Craigslist housing ads in Toronto](https://toronto.craigslist.org/d/apts-housing-for-rent/search/apa).

```python
import requests
import json
from bs4 import BeautifulSoup


def get_page(s):
	url = "https://toronto.craigslist.org/d/apts-housing-for-rent/search/apa?s={}".format(s)
	res = requests.get(url)
	soup = BeautifulSoup(res.text, 'html.parser')
	rows = soup.select('.result-row')
	titles = [r.select('.result-title')[0].text for r in rows]
	return titles


total = 0
all_results = []
target = 1500

while True:
	results = get_page(total)
	total += len(results)
	all_results += results
	if total >= target:
		break
	print('collected {} results'.format(total))

with open('./data.csv', 'w') as f:
	for result in all_results:
		f.write(result + '\n')
```

This script will collect just over 1500 titles from Toronto housing listings.


## Labeling our data

Now, the tedious part of the whole operation. Open up that CSV in your favourite spreadsheet application (use a tab-delimiter, just in case there are commas in the titles). Beside each of those 1500 titles (in the second column), mark the number of bedrooms found in the title. If it's not found in the title, leave it blank.

...

Or you can use our pre-labeled dataset: [data.csv](data.csv). Just keep in mind, we've only done one pass for labeling the data so there may be mistakes.

Next, we'll go over using WHISK to generated our regex rule for extracting the number of bedrooms!