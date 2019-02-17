---
title: How we use Uptime Robot for Complex Monitoring
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
seo_description: >-
  We show you how to use Uptime Robot, a HTTP ping checking service, to monitor
  complex behavior in your web application.
date: 2019-02-17 00:14:30
tags:
---


[Uptime Robot](https://uptimerobot.com/) is a great service for monitoring your website uptime.

The concept is simple: give it a URL, and it will regularly visit that URL. If it gets a non-200 response it sends you a notification by text or email.

If you have sites you need to keep online, this tool can solve your problem. 

But what if you have more complex needs?


## Monitoring complex procedures using Uptime Robot

Let's say you have a server that runs a number of background tasks, and you need to know if those tasks start failing.

Create a URL that, when called, checks to see if any tasks have failed. Make it return 200 if all the tasks have run properly and 500 if things are failing. Point Uptime Robot at the URL and you'll receive notifications when things go wrong.

Here's a quick demo of how you can monitor [Django Background Tasks](https://django-background-tasks.readthedocs.io/en/latest/)

```python
from background_task.models import Task
from django.views.generic import View
from django.http import HttpResponse

class MonitorView(View):
	def get(self, *args, **kwargs):
		has_errors = Task.objects.exclude(last_error__isnull=True).exists()
		status = 500 if has_errors else 200
		return HttpResponse(status=status)
```

Wire the view up in `urls.py`, point Uptime Robot at the URL, and you'll receive an email if any issues arise. 

In general, you can monitor most things on your webapp. Just make sure your view doesn't take too long (or perform database-heavy operations) or Uptime Robot's pings every five minutes may cause a denial of service.