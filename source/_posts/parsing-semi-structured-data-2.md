---
title: 'Parsing semi-structured data, part 2'
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
seo_description: How can we approach the problem of parsing semi-structured data?
date: 2019-02-25 23:21:45
tags:
---


Now that we have our data, let's start our attempts to parse it.

What formats does the data take?

The most common format is a number (e.g. 1-9, or "One") followed by an indication of bedrooms (e.g. "bedrooms", "beds", etc). We'll need to capture as many of the room indication words as we can.

Next, there are words that indicate the number of rooms (for instance "bachelor", "studio", etc.).

Finally, there is the form "2+1", which implies that there are two bedrooms, plus one room which could be considered as a bedroom. While labeling the data, we considered a "2+1" to be a 2 bedroom.


## Brainstorming

How can we approach this problem?

- For the number-based indicators, one level of the algorithm could be used to determine where the number is located. For example, it would determine that the ngram (*, "bedroom") should have the number of bedrooms located before bedroom. The next level of the algorithm could be used to determine if that preceeding statement is indeed a number.
- Using a part-of-speech tagger may be helpful.
- While it is intimidating, neural networks may be a good solution. [This post may be a good start](https://blogs.itemis.com/en/deep-learning-for-information-extraction).

We'll continue more in the next part of this series.