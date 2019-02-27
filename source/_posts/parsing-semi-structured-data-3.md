---
title: 'Parsing semi-structured data, part 3'
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
seo_description: An introduction to parsing semi-structured data using Python and NLTK
date: 2019-02-27 18:34:58
tags:
---


After some research, we've found the [NLTK section on information extraction](http://www.nltk.org/book/ch07.html), which seems like a great place to start.

The NLTK document recommends the following:

1. Tokenize and tag sentences using a _part of speech_ (PoS) tagger.
2. Create a _Chunker_ to identify the segments of the sentence we are looking for. The simplest option is a Regular Expression Chunker, which we can use if there is a clear pattern of parts of speech which will identify the data we're looking for.
3. If there is no clear pattern for parts of speech or we find some conflict, we'll have to use a more difficult approach.


## List of PoS tags NLTK

There are a lot of PoS tags in the default tagger. If you don't have a background in linguistics, this might be overwhelming. Fortunately, there's a simple convenience method that will show you all of the tags and examples:

```python
import nltk
nltk.help.upenn_tagset()
```


## Tagging the Parts of Speech

In the following snippet, we'll load our data and tag it using the PoS tagger:

```python
import nltk

data = []

with open('./data.csv') as f:
	for line in f.readlines():
		title, num = line.replace('\n', '').split('\t')
		sentences = [nltk.pos_tag(nltk.word_tokenize(sent)) for sent in nltk.sent_tokenize(title)]
		data.append({
			'title': title,
			'num': num,
			'sentences': sentences
		})
```

Now, let's look at the data our chunker has acquired. To make things easier, we'll only look at the data we've manually marked (in a previous post) as having "1" bedroom.

```python
one_bedrooms = [d for d in data if d['num'] == '1']
for one_bedroom in one_bedrooms:
	print(one_bedrooms['sentences'])
```

This prints out a lot of data, but here's a segment:

```python
[[('1', 'CD'), ('bedroom', 'NN'), ('Apt', 'NNP'), ('w', 'NN'), ('Balcony', 'NNP'), ('-', ':'), ('Bloor', 'NNP'), ('&', 'CC'), ('Sherbourne', 'NNP')]]
[[('PET', 'NNP'), ('FRIENDLY', 'NNP'), ('1', 'CD'), ('bdrm+den', 'NN'), ('available', 'JJ'), ('Apr', 'NNP'), ('1', 'CD'), ('!', '.')]]
[[('BRAND', 'NNP'), ('NEW', 'NNP'), ('17', 'CD'), ('DUNDONALD', 'NNP'), ('ST,1BED+DEN,1BATH', 'NNP'), (',', ','), ('PARKING', 'NNP'), (',', ','), ('LOCKER', 'NNP'), (',', ','), ('BALCONY', 'NNP')]]
[[('One', 'CD'), ('Bdrm', 'NNP'), ('Condo', 'NNP'), ('For', 'IN'), ('Rent', 'NNP')]]
```

Here, we have some of the most important examples.

1. `('1', 'CD'), ('bedroom', 'NN')`: A simple pattern, that could be nice to use: `CD` (numeral, cardinal), followed by `NN` (common singular noun). Perhaps `CD` followed by `NN` will be our pattern!
2. `('1', 'CD'), ('bdrm+den', 'NN')`: Another match for our pattern!  Excellent!
3. `('17', 'CD'), ('DUNDONALD', 'NNP')`: Oh no! This is a street address followed by a proper singular noun. Maybe we won't need `NNP`.  Unfortunately, the tokenizer kept `('ST,1BED+DEN,1BATH', 'NNP')` as a single token.  Perhaps if this were split up, we would have a match for our `CD` `NN` pattern.
4. `('One', 'CD'), ('Bdrm', 'NNP')`: This is a valid use of a proper singular noun. Looks like we're going to have some trouble with this pattern.

Unfortunately, there isn't going to be a clear, easy PoS pattern that we can use to extract our information; we'll have to go with the more complex approach.


## Classifier-Based Chunking for Information Extraction

The next step is to use a classifier. [NLTK has a tutorial on this](http://www.nltk.org/book/ch07.html#training-classifier-based-chunkers).

We'll explore this in the next part in this series.