---
title: Finding peers from a .torrent file in Python
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
seo_description: >-
  Learn how to find the IP addresses of peers of a torrent file, using Python
  and some free libraries.
date: 2019-02-03 21:31:36
tags:
---


Torrent files contain the metadata required to start downloading data. Underneath an encoding layer, they contain a dictionary structure. The goal of this document is to retrieve a list of peers from a .torrent file. Let's start by decoding the dictionary.

_If you don't have a .torrent file, there's one available on the [Qubes OS download page](https://www.qubes-os.org/downloads/)._

# Decoding the .torrent file

Torrent files are BEncoded (pronounced "b-encoded"). Most languages have a package available for encoding and decoding the format. 

For Python, you can use the tool [`bencode.py`](https://pypi.org/project/bencode.py/), as follows:

```
import bencode

with open('./your-file.torrent') as f: raw_data = f.read()
data = bencode.decode(raw_data)
```

There are three important keys in the data dictionary that we will deal with: `info` and `announce` / `announce-list`.

`info` contains details on the contents of the torrent, but more importantly it is used to compute what is known as the "info hash"

`announce` and `announce-list` contain the URLs of servers which will help us to find peers.

# Computing the info hash

The info hash is used to identify the torrent on the network. You can compute it as follows:

```
import hashlib
info_hash = hashlib.sha1(bencode.bencode(data['info'])).hexdigest()
```

# Finding peers

There are two types of announce URLs: UDP and HTTP. The protocols for these URLs are different. [HTTP URLs are documented here](http://www.bittorrent.org/beps/bep_0003.html) and [UDP URLs are documented here](http://www.bittorrent.org/beps/bep_0015.html). The spec ends up being quite complicated; an easier route is to use an already implemented library.

We've had success using [BTDHT, "an implementation of the BitTorrent Distributed Hash Table"](https://github.com/nitmir/btdht)

After computing the info hash, you can use the BTDHT library to fetch a list of peers as follows:

```
import btdht
import binascii
from time import sleep
dht = btdht.DHT()
dht.start()
sleep(15) # wait for the DHT to build

while True:
    print(dht.get_peers(binascii.a2b_hex(info_hash)))
    sleep(1)
```

You'll notice that this list will continue to grow as more peers are discovered.

The list will contain an IP address and a port for each peer. 