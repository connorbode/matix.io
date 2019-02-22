---
title: Making scraped security.txt data downloadable
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
seo_description: >-
  We compile security.txt data found from Alexa top one million results into a
  downloadable format.
date: 2019-02-21 22:19:32
tags:
---


Finally, let's make the security.txt data acquired available to the public.

There will be two steps to this:

1. Compiling it into downloadable data
2. Making it searchable via the web


## Compiling it into downloadable data

What valuable information have we acquired and what should we make available?

Security.txt files are located in two places: `/security.txt` and `/.well-known/security.txt`.

We've found valid security.txt files, but we've also collected the locations of valid security.txt files. The contents of those files are valuable (for people who are looking for bug bounty programs, for instance), but the locations of those files are also valuable (for periodically fetching updates to the content, and for providing a link to the content).

Since it is possible for the files in the root directory and the .well-known directory to be different, the data should be kept separate. For example

We've built a [serializable parser for security.txt files](/security-txt-parser).

With all that information, let's use the following data format:

```json
{
	"<domain>": {
		"root": "<serialized from parser>",
		".well-known": "<serialized from parser>"
	}
}
```

If you're interested, [here's the security.txt data from Alexa Top 1M sites](security-txt-data.json)


## User experience for browsing the data

What user experience should we provide for users browsing the data? Nice tools might include:

- a search bar, to search for domains
- a filter bar, to filter by provided fields

For example users may use this tool to look for bug bounty programs. They would be able to use the filters to filter by sites with policies, then continue from there.
