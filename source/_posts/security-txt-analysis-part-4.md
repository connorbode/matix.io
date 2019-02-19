---
title: Finding security.txt in Alexa Top 1M (part&nbsp;4)
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
seo_description: >-
  We analyze the data found by scraping security.txt results from the Alexa top
  1 million domains.
date: 2019-02-18 22:47:36
tags:
---


In previous posts, we were parsing out the remainder of the data from our security.txt scans. Of course, there have been many false positives.  In this post, we'll continue to look at false positives that have shown up and eliminate as many as possible.


## JSON Web Key

There is an interesting response that shows up on 73 domains, all seemingly related to sex. The response is as follows:

```
{"header": {"alg": "RS256", "jwk": {"e": "AQAB", "kty": "RSA", "n": "uU92Y0aMQslqQCkXY_TuCUu25GN6R_tnNQVOZSR8B-VtX8ts-iEfvAqd9Dx6rhPCIFqfy6kq8a1rx0_9mhtlcDEGM6-4h36_778hxyXrpBM9G283NsVBelx7RN07eMAAzNeByhpMspfM_hQn6LuqlNZe-6MA-Bdstgoo6MuO6KB4n_aM3KKPmVcQc6obCEl0F0kp-9nd9trC33tll1E2fnYBzOmxryFRX4GQg7aj-NkOIFfgRD37wXOA-I6VyJSRhRwVicOkQOFXseJWg0rN6fIJnMSwbxAAD_h_ZmKQxQNtdyHtyjD7DBXsVrjO4kcTO3Ffo1edcqFIHEbbTBcNww"}}, "payload": "eyJ0bHMiOiBmYWxzZSwgInRva2VuIjogIlBVd0N1REY0UVlVdHhFMl9BRzZEdk5Cc0VEM1ZtaTRKWk9yc0pTWmFxSDQiLCAidHlwZSI6ICJzaW1wbGVIdHRwIn0", "signature": "N2FsGEuseThBV_ThL99bKnahLAvE-C9GgLD_69I1iwT4e9livo1zlioW6vk5f9PztlLEQVab59xwUWZMqxO_x3-hp6040EZ-931qVO5eNl1pat9Nm9C18OlF4OylMX0SxcbqpB3Q8DDZroUmCGlw_Xkc57nLYJ-lZNLF6B0ZIUVEOn_wGLqohIo3hDWeqZGRQRfoEtM78oprEwSR0sjKRR3UEO-DSwaGiO1KR1iIXUQ3nBdk6QvCesvGT_oDlghsKILkMepiqOPlWEfPzVepXDbQ7uP2MLeAWbwftLrectBvWrEsY4cJaNprZlc1Xf34Gdq0nDSKLTU-cwTNrqHMIQ"}
```

There has been no further investigation, but it seems odd that this key would show up in `security.txt`. Perhaps it is unintentional and shows up in other paths as well, or it could be a communication method.

In any case, it should be filtered from the results.

This leaves 1539 results.


## robots.txt

It seems there are a number of `robots.txt` results included. Perhaps the servers respond with `robots.txt` for any query to a `.txt` file.


## Other issues found

There were many false positives:

- JSON responses
- Many stack traces and error messages (e.g. "exception", "file not found", etc.)
- PHP output (e.g. starting with "<?")
- Lots of information disclosure, like paths ("/home/user/web-directory") and even some database credentials
- Lots of "This domain is used for technical purposes. You have probably found it in an email sent by one of UniSender clients. UniSender is an email marketing service https://www.unisender.com/"
- Some HTML comments that were missed by the HTML parser.


## There has to be a better way

Instead of looking for things that *don't look like security.txt*, why not look for things that *look like security.txt*?

Looking at [the spec](https://tools.ietf.org/html/draft-foudil-securitytxt-05#section-3.3), there are 7 keys that might be present:

- Acknowledgements
- Canonical
- Contact
- Encryption
- Hiring
- Policy
- Preferred-Language

Each should be at the start of a new line (or at the start of the file) and be followed by a colon, then space (`: `).

Regex pattern:

```
(^|\n|\r\n|\r)(Acknowledgements|Canonical|Contact|Encryption|Hiring|Policy|Preferred\-Language)(\: )
```

Perhaps this would have been a better approach from the start.


## Next steps

In the next post, we'll make this data searchable.