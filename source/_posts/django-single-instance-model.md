---
title: Django Single Instance Model
banner_lg: splash-lg.png
banner_sm: splash-sm.png
date: 2019-06-12 15:40:30
tags:
seo_description:
---


_Looking for the project?  Check it out [on Github](https://github.com/matix-io/django-single-instance-model)._

---

We use Django in most of our projects.

We build web APIs, task processors, webapps, and others types of applications, all in Django.  It's a very versatile platform & we love it.


## CMS-style Projects

Some of our projects are what we call CMS-style projects (a CMS is a Content Management System).  These projects are usually websites, often for marketing purposes.  The thing these sites have in common is that there isn't a lot of functionality, but there is a lot of data that needs to be managed.  There is usually a website manager and their job is to use a special admin panel to manage their sites data.

In a CMS-style project, the user often needs to be able to **modify content that will show up on the pages of their websites**.  For example, they might want to edit the links to their social media accounts, or manage a block of text describing their company.

CMS projects are the kind that are typically implemented in Wordpress, but we find Django to be a much better environment to code in.


## Django as a CMS

Django Admin is a great tool.  It instantly provides you with a dashboard to manage the data in the backend of your site.  This is extremely useful when you want to move fast.

But we've found a major pitfall with Django and Django Admin when used as a CMS: **models are designed to have multiple instances**.

What do we mean?  Let's walk through a simple example:

```python
from django.db import models


class BlogPost(models.Model):
    title = models.CharField(max_length=100)
    body = models.TextField(max_length=5000)
```

Let's say you're using Django for a blog.  The `BlogPost` model represents posts on the blog.  **We can have 0 blog posts, or we can have 1 blog posts, or 10 or 20**.  It's a data model, and we can create as many or as few instances as we need.

And Django Admin provides a great interface for managing these data points.


**Why is this a problem?**

When we're building out a CMS-style site, sometimes we just need to store data.  Here's an example:

```python
from django.db import models

class SocialMedia(models.Model):
    twitter = models.URLField(max_length=200)
    facebook = models.URLField(max_length=200)
    instagram = models.URLField(max_length=200)
```

The CMS-style site will only ever need one instance of `SocialMedia`.  In fact, it will **always need exactly one instance** of `SocialMedia`.


**Why even use a model?**

We could store these social accounts elsewhere, but then we would lose the ability to manage them in Django Admin.  We put them in a model so that we can quickly build out a dashboard for the manager to edit data in.

But, because Django doesn't support our requirement of "have exactly one instance of this model, always", we find we have two extra scenarios to handle:

- It's possible that there won't be an instance of the `SocialMedia` model.  
- It's possible that there will be multiple instances of the `SocialMedia` model.

If we want to proceed this way we have to write extra code to deal with these scenarios and we have to explain the issues & how to deal with them to the user.

There has to be a better way.


## Exactly one instance of a model in Django

What's the solution?  We enforce there being exactly one instance of a model in Django at all times.

We created [`django-single-instance-model`](https://github.com/matix-io/django-single-instance-model) to solve this problem.

It's really simple to use.  In your `models.py` file:

```python
from django.db import models
from single_instance_model.models import SingleInstanceModel


class SocialMedia(models.Model, SingleInstanceModel):
    twitter = models.URLField(max_length=200)
    facebook = models.URLField(max_length=200)
    instagram = models.URLField(max_length=200)
```

And in your `admin.py` file:

```python
from django.contrib import admin
from single_instance_model.admin import SingleInstanceModelAdmin
from . import models


@admin.register(models.SocialMediaAdmin)
class SocialMediaAdmin(SingleInstanceModelAdmin):
	pass
```

That's it!

Here's a demo of what the user experience looks like:

![using Django Single Instance Model](demo.gif)

---

Have feedback?  Get at us on Twitter [@matix_io](https://twitter.com/matix_io).