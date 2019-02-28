---
title: 'Parsing semi structured data, part 4'
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
date: 2019-02-28 18:05:28
tags:
seo_description: Learn how to create a custom classifier-based chunker using Python and NLTK.
---


In a previous post, we followed the tips from [http://www.nltk.org/book/ch07.html](NLTK's Extracting Information from Text) to tokenize apartment listing titles and tag them with parts of speech. When we used these tools to attempt to extract the number of bedrooms from the listings, the results weren't great. We concluded that we'll need to use some more advanced tools.


## Creating a custom chunker

We're going to move forward creating a custom chunker that will extract our number-of-bedrooms data. The [NLTK book has a great example on training classifier-based chunkers](http://www.nltk.org/book/ch07.html#training-classifier-based-chunkers). Unfortunately, the class they give doesn't come with any instruction on how to train it.

Let's figure it out.

Here's the Tagger class they provide:

```python
class ConsecutiveNPChunkTagger(nltk.TaggerI): [1]

    def __init__(self, train_sents):
        train_set = []
        for tagged_sent in train_sents:
            untagged_sent = nltk.tag.untag(tagged_sent)
            history = []
            for i, (word, tag) in enumerate(tagged_sent):
                featureset = npchunk_features(untagged_sent, i, history) [2]
                train_set.append( (featureset, tag) )
                history.append(tag)
        self.classifier = nltk.MaxentClassifier.train( [3]
            train_set, algorithm='megam', trace=0)

    def tag(self, sentence):
        history = []
        for i, word in enumerate(sentence):
            featureset = npchunk_features(sentence, i, history)
            tag = self.classifier.classify(featureset)
            history.append(tag)
        return zip(sentence, history)
```

The `__init__` method seems to take some training data, which gets parsed by the `nltk.tag.untag` method.

Luckily, web-search has saved the day yet again.  [Web documentation shows how nltk.tag.untag() works](https://tedboy.github.io/nlps/generated/generated/nltk.tag.untag.html):

```python
from nltk.tag.util import untag
untag([('John', 'NNP'), ('saw', 'VBD'), ('Mary', 'NNP')])
# ['John', 'saw', 'Mary']
```

Great! Now for the boring work..


## Preparing data for our classifier

Our goal here will be to extract all of the "x Bedroom" data. For that, we'll need three tags:

- `X` will represent our number
- `B` will represent a word synonymous to bedroom
- `U` will represent unimportant data

If you recall, our 1500+ listing titles collected from Craigslist are in a CSV file `data.csv`, in the first column.  Let's create a new file called `chunker-data.csv`. For each title, we'll tokenize the title. Each row in `chunker-data.csv` will represent a title, and each token will be placed into a column. The column immediately following a token will have a `U`.

For example:

`This will be super boring`

Will be transformed into:

`This,U,will,U,be,U,super,U,boring,U`.

Then, we'll manually go through 1500 rows, and mark the `X` and `B` values in the rows.

__You can join in the fun!__ .. or just wait and download the result.

```python
import nltk

f = open('./chunker-data.csv', 'w')
with open('./data.csv') as f:
	for line in f.readlines():
		title = line.replace('\n', '').split('\t')[0]
		tokens = nltk.tokenize.word_tokenize(title)
		f.write('{}\t'.format(title))
		for token in tokens:
			f.write('{}\tU\t'.format(token))
		f.write('\n')

f.close()
```

In the next part of this series, we'll publish the CSV.. and test it in the classifier.