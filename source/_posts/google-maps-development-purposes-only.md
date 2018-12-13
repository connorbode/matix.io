---
title: For development purposes only
banner_lg: banner-lg.png
banner_sm: banner-sm.png
date: 2018-12-12 20:19:14
tags:
---


If you've been affected by the changes to the Google Maps API, don't worry.  Chances are it's very easy to fix the problem.

## What happened?

During August 2018 Google released an update to their Maps services changing the way they are used.  The update included [changes to their pricing model](https://cloud.google.com/maps-platform/pricing/sheet/).  This update has broken embedded Google Maps on many websites, rendering some pages ugly and unprofessional.


## Am I affected?

You'll certainly know if you are affected.  Your website's Google Map will show a gray overlay with the words "For development purposes only".  There will also be a popup which says "This page can't load Google Maps correctly".


## How can I fix the problem?

__If you're just showing your business on a map on your website, the service is still free!__ This is the most common use for Google Maps.  Most likely, you're embedding Google Maps using the Javascript API, or you're requesting too many permissions with your Google Maps Embed.  Your embedded HTML should look like this:

{% codeblock lang:html %}
<iframe src="https://www.google.com/maps/embed/v1/place?q=times+square&key=YOUR_API_KEY" allowfullscreen></iframe> 
{% endcodeblock %}

That's it!  If you use this embed method, Google Maps is free for unlimited usage.

__If you're using Google Maps for anything else__, chances are you'll be able to use the service for free for a certain number of views and afterwards you'll have to pay.  For example, if you want to use the Dynamic Javascript API, it will be free for the first 28,000 views. Afterwards, you'll pay $7.00 per 1,000 views!  If you're a high traffic website, that can add up quick.  It might be beneficial to check out a competitor like Mapbox, [which offers the same service for $0.50 per 1,000 views (and 50,000 free views)](https://www.mapbox.com/pricing/).  

[You can see the full list of Google Maps pricing here](https://cloud.google.com/maps-platform/pricing/sheet/). 