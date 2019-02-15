---
title: Finding polarized sentiment in tweets using Python
date: 2019-02-14 22:33:48
tags:
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
seo_description: This tutorial shows how to fetch all replies to a tweet. It is the first part of a series which analyzes tweets containing polarized sentiment.
---


_This tutorial is a continuation of our [access your Twitter feed using Python](/access-twitter-using-python/) article. If you need, check it out._

The following Tweet has gotten a lot of action over the past few days:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Folks, changing names away from things like &quot;master&quot; and &quot;slave&quot; or &quot;whitelist&quot; and &quot;blacklist&quot; is about making everyone feel welcome<br><br>MATTERS<br>+ Inclusion<br><br>DOES NOT MATTER<br>+ Your feelings on &quot;what the world is coming to&quot;<br>+ Your &quot;slippery slopes&quot;<br>+ Your &quot;well actually&quot; etymologies</p>&mdash; Ben Lesh 🧢🏋️‍♂️💻🎨 (@BenLesh) <a href="https://twitter.com/BenLesh/status/1095487146251546624?ref_src=twsrc%5Etfw">February 13, 2019</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Regardless of your position on the subject, the interesting part about it is that the community is extremely polarized in their opinions.

People either love it or hate it.

This is reflected in their responses. Some are overwhelmingly positive and others are overwhelming negative.

Let's have a look at the overall sentiment of responses.

## Pulling the tweet data

Unfortunately, Twitter doesn't offer an easy way to get replies to a particular tweet.

It seems that we're able to search all tweets sent to a `@BenLesh` by using that as a search term.

All the tweets have an `id`, and the search seems to return items in reverse chronological order.  

Replies also have a property `in_reply_to_status_id`.

The best we can do is as follows:

1. Visit the tweet in your browser and grab the URL (for this tweet, its https://twitter.com/BenLesh/status/1095487146251546624)
2. The URL format is `/<twitter_handle>/status/<status_id>`.  Grab the `status_id`
3. Search all tweets sent to that user. You can get a maximum of 200 tweets per search query, so you'll get the 200 most recent tweets sent to that user.
4. Go through the response tweets. Compare the `in_reply_to_status_id` to the `status_id` from step 2; if it's a match, you found a reply! Also, keep note of the minimum `id` value, as we'll tell Twitter during the next search that we want `id`s less than that.
5. Repeat steps 3 & 4

Unfortunately, we don't have an end condition. You can check the number of replies to a tweet and use that as your end condition. 

Depending on how old the tweet is, this might take a long time. You also may hit the APIs rate limits at some point.

Basically, this is just a "do the best you can" thing.

Here's the code used to pull the data. There's no end condition, so you'll just have to `ctrl-c` when you think you have enough data.

At the time of running, the tweet in question was only 2 days old, and 180/182 responses were accumulated in about 100 requests.

```python
import twitter
import json

CONSUMER_KEY = '<consumer_key>'
CONSUMER_SECRET = '<consumer_secret>'
ACCESS_TOKEN = '<access_token>'
ACCESS_TOKEN_SECRET = '<access_token_secret>'

connection_details = {
	'consumer_key': CONSUMER_KEY,
	'consumer_secret': CONSUMER_SECRET,
	'access_token_key': ACCESS_TOKEN,
	'access_token_secret': ACCESS_TOKEN_SECRET
}

api = twitter.Api(**connection_details)

max_id = None
stored_tweets = []
status_id = 1095487146251546624
search_term = '@BenLesh'

while True:
	tweets = api.GetSearch(term=search_term, max_id=max_id, count=200)

	for tweet in tweets:
		if tweet.in_reply_to_status_id == status_id:
			stored_tweets.append(tweet.text)

		if max_id is None or max_id > tweet.id:
			max_id = tweet.id

	print('found {} tweets'.format(len(stored_tweets)))
	with open('./cache.json', 'w') as f:
		f.write(json.dumps(stored_tweets))
```

## Next steps

Now that we have the data, we'll analyze it in a subsequent post.