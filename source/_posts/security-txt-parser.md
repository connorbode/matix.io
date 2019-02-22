---
title: Building a security.txt parser in Python
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
seo_description: >-
  We build a security.txt parser using Python, and provide a JSON-serializable
  format for security.txt data.
date: 2019-02-21 22:21:16
tags:
---


In this post, we'll build a parser for a security.txt file. 

The [draft spec](https://tools.ietf.org/html/draft-foudil-securitytxt-05#section-3.5) mentions two things that should be parsed:

- fields
- comments

The spec has a "Field Definitions" section which lists the following fields:

- Acknowledgements
- Canonical
- Contact
- Encryption
- Hiring
- Policy
- Preferred-Languages

Each field should be followed by a value, then terminated by an EOL (end-of-line) character (such as \r\n, \r, or \n). For example: `Field: Value\r`

Additionally, the spec mentions that one or more lines of comments can be listed immediately above the field, and that

> Parsers SHOULD associate the comments with the respective field.

Finally, the spec does not place a limitation on how many times the `Acknowledgements`, `Contact`, `Encryption`, `Hiring` or `Policy` fields appear. The `Canonical` and `Preferred-Languages` fields must only appear once.


## Modeling the data

Let's first consider how we'll model the data:

```python
class SecurityTxtField:
	def __init__(self, value, comment=None):
		self.value = value
		self.comment = comment if comment is not None and comment != '' else None


class SecurityTxt:
	def __init__(self):
		self.canonical = None
		self.preferred_languages = None
		self.acknowledgements = []
		self.contact = []
		self.encryption = []
		self.hiring = []
		self.policy = []
```

We won't go crazy building classes with getters and setters; this simple data model should do.


## Building a parser

The general idea for our parser is as follows:

- Divide the file into lines and iterate each line
- If a line starts with `#`, grab the text and save it, as the comment should apply to the next field
- If a line isn't a field and isn't a comment, discard any saved comments
- If a line is a field, grab the value and save it, along with any saved comments

Let's complete our SecurityTxt class:

```python
import re


class SecurityTxt:
	def __init__(self, value):
		self.canonical = None
		self.preferred_languages = None
		self.acknowledgements = []
		self.contact = []
		self.encryption = []
		self.hiring = []
		self.policy = []
		self.raw = value
		self.parse(value)

	def match(self, field, line):
		_match = re.match('^{}: ([^\\n]+)'.format(field), line)
		if _match:
			return _match.groups(1)[0]
		else:
			return None

	def parse(self, value):
		comment = ''
		value = value.replace('\r\n', '\n').replace('\r', '\n')
		lines = values.split('\n')

		for line in lines:
			acknowledgements = self.match('Acknowledgements', line)
			canonical = self.match('Canonical', line)
			contact = self.match('Contact', line)
			encryption = self.match('Encryption', line)
			hiring = self.match('Hiring', line)
			policy = self.match('Policy', line)
			preferred_languages = self.match('Preferred-Languages', line)

			if line[0] == '#':
				comment += line[1:].lstrip() + '\n'

			elif acknowledgements:
				self.acknowledgements.append(SecurityTxtField(acknowledgements, comment))
				comment = ''

			elif canonical:
				self.canonical = SecurityTxtField(canonical, comment)
				comment = ''

			elif contact:
				self.contact.append(SecurityTxtField(contact, comment))
				comment = ''

			elif encryption:
				self.encryption.append(SecurityTxtField(encryption, comment))
				comment = ''

			elif hiring:
				self.hiring.append(SecurityTxtField(hiring, comment))
				comment = ''

			elif policy:
				self.policy.append(SecurityTxtField(policy, comment))
				comment = ''

			elif preferred_languages:
				self.preferred_languages = SecurityTxtField(preferred_languages, comment)
				comment = ''

```


## Serializing the data

Finally, let's add a method to serialize our data. One standard way to do this in Python is to implement a `to_dict` method, which can then easily be converted to JSON.

```python
class SecurityTxtField:
	...

	def to_dict(self):
		return {
			'value': self.value,
			'comment': self.comment
		}


class SecurityTxt:
	...

	def to_dict(self):
		dump = lambda _list: [l.to_dict() for l in _list]

		return {
			'acknowledgements': dump(self.acknowledgements),
			'canonical': self.canonical.to_dict() if self.canonical else None,
			'contact': dump(self.contact),
			'encryption': dump(self.encryption),
			'hiring': dump(self.hiring),
			'policy': dump(self.policy),
			'preferred_languages': self.preferred_languages.to_dict() if self.preferred_languages else None,
			'raw': self.raw
		}
```