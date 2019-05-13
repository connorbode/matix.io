---
title: What can I learn from an IP address?
banner_lg: splash-lg.jpg
banner_sm: splash-sm.jpg
seo_description: >-
  Given an IP address, what OSINT techniques can we use to extract information?
  Learn how to extract ISP, location, and port information from an IP address.
date: 2019-02-06 10:45:28
tags:
---


Today we'll look into information that can be extracted from an IP address. Here's an initial brainstorm:

- The IP address is provided by some ISP. This should provide us with geographic information and potentially some other details
- We can do a reverse DNS lookup
- We can scan the IP to see what ports / services are running

## Geographic information

The first step we'll do is to find out where the IP address is located. [GeoLite2 is available free for non-commercial usage](https://dev.maxmind.com/geoip/geoip2/geolite2/), providing location data for IP address ranges.

If you're looking to get location information from an IP address quickly, you can run the following command:

```bash
curl ipinfo.io/<ip_address>
```

Which  will return you detailed location data.

## ISP information

We can also run `whois <ipaddress>`. This will provide more detailed output on the Internet Service Provider (ISP) of the IP address.

## Reverse DNS lookup

A reverse DNS lookup will find domain names associated with an IP address. There are a number of ways to do this. Likely, you'll need to combine all of them.

Using Bing search engine, you can query `ip:<ip_address>` to find all pages that have been indexed at that IP address. This will find you any domains that are pointing to web servers on that IP address. _If you have an IP address that is a shared host or a load balancer, you might get a lot of results returned here. However, if it's a dedicated IP address, you'll get some good results._

You can also run `dig +noall +answer -x <ip_address>`. This will return you the domain name that the ISP uses to refer to that IP address.

## Port scan

You can run a port scan on an IP address using `nmap -sV <ip_address>`. This will make a number of requests to that IP address and you may show up in logs. If you don't want to show up in logs, use Shodan as described below.

This port scan will show open ports on the IP, and `nmap` will attempt to identify the services running on those ports.

## Shodan

[Shodan](https://shodan.io) is a great tool that will give you all of this information if you just enter an IP address. If you're looking to attain information on a single IP address quick, this is the way to go. 

If you want to enumerate many IPs, you'll need to purchase a subscription ([priced by number of IPs per month](https://developer.shodan.io/pricing)). If budget is a concern, a custom solution may be a better option.