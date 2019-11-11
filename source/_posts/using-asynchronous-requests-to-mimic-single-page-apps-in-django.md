---
title: Using Asynchronous Requests to Mimic Single Page Apps in Django
banner_lg: splash-lg.png
banner_sm: splash-sm.png
seo_description: >-
  Want your traditional webapp to feel like a single page app?  Here's how it
  can be accomplished, in general and in Django!
date: 2019-11-10 22:18:59
tags:
---


_I've created an [example Django project for the tutorial here on Github](https://github.com/matix-io/django-webapp-async-example) to demonstrate what's discussed in this tutorial._

Single Page Apps (SPAs) built on frameworks like Vue, React, and Angular, create excellent user-experiences.  The apps are built fully on the client side, so for any action the user performs, there will be immediate feedback.  Instead of loading a new page when a link is clicked or a form is submitted, the SPA will perform HTTP requests asynchronously and update the view.  

The resulting experience is much more pleasant than a traditional web application, where a link click or a form submit will cause the page to fully reload.  On a slow connection, this often means a blank white browser while the next page finishes loading.

So why not build an SPA?

SPAs add complexity to a project.  Instead of working on a single web application, you'll now have a separate backend API and frontend SPA.  These two components interact with each-other and with two components instead of one, your project complexity increases.  Bugs become harder to track down.

## How can we make a traditional web application feel like a Single Page App?

Consider how a traditional web application works:

1. An HTTP request is made to the server (GET if we're loading a page, POST if we're submitting a form)
2. The server processes the request, and returns HTML, to be displayed in the web browser

The HTML that is returned to the browser is complete; that is, it starts with `<html>`, ends with `</html>`, contains the `<head>`, and the `<body>` and everything in between.

Let's say we have a simple website with two pages:

__Page 1:__

```html
<html>
  <head></head>
  <body>
    <div id="header">
      <a href="/page-1">Page 1</a>
      <a href="/page-2">Page 2</a>
    </div>
    <div id="content">
      <h1>This is Page 1</h1>
    </div>
  </body>
</html>
```

and __Page 2:__

```html
<html>
  <head></head>
  <body>
    <div id="header">
      <a href="/page-1">Page 1</a>
      <a href="/page-2">Page 2</a>
    </div>
    <div id="content">
      <h1>This is Page 2</h1>
    </div>
  </body>
</html>
```

_(please don't comment on HTML semantics, this is just an example)_

As you can see, the majority of the HTML structure is very similar here.  The only thing that is unique to Page 1 and to Page 2 is the `innerHTML` of `#content`.

Why is that important?  __If we want to change the page asynchronously, all we have to do is fetch the `innerHTML` of `#content` from the server.__

## How does that work in general, for web applications?

The web-server will need to be able to return an HTML partial (instead of the complete HTML document) if requested.  Using the example above, here's how the webapp might do this:

__For a full-page load:__

```html
GET /page-1

<html>
  <head></head>
  <body>
    <div id="header">
      <a href="/page-1">Page 1</a>
      <a href="/page-2">Page 2</a>
    </div>
    <div id="content">
      <h1>This is Page 1</h1>
    </div>
  </body>
</html>
```

__For a partial-page load:__

```html
GET /page-1?async

<h1>This is Page 1</h1>
```

This would be similar for form-submits, where a `POST /page-3?async` would also return a partial-HTML response.  The particulars of the implementation are up to you, of course, but this is how the server should function in-general.

How would you hook your browser up to make the async requests?

```javascript
function hook(scope) {
  scope.querySelectorAll('a').forEach(function (anchor) {

    // check if the anchor is internal
    if (anchor.href.indexOf(window.location.origin) === 0) {
      anchor.addEventListener('click', function (e) {

        // stop the anchor click from actually loading the next page
        e.preventDefault();

        // add our "async" GET parameter to the URL of the next page
        var url = anchor.href

        if (url.indexOf('?') === -1) {
          url += '?async';
        } else {
          url += '&async';
        }

        // asynchronously load the next page
        // if you want to display a loading spinner, now would be the time
        fetch(anchor.href)
          .then(function (res) {
            return res.text();
          })
          .then(function (res) {

            // inject the contents of the next page into our #content div
            document.querySelector('#content').innerHTML = res;

            // make sure that any links in the updated scope are also "hooked"
            hook(document.querySelector('#content'));

            // if you used a loading spinner, you could hide it now
          });
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  hook(document);
});
```

That's an example of how the Javascript would work.  Of course in practice, it's likely to be more complicated for your project.


## How does this work in Django?

We'll use a [context processor](https://docs.djangoproject.com/en/2.2/ref/templates/api/#writing-your-own-context-processors) to make sure that all of our views know whether to return a partial or full HTML response.

_My main module is named "core"_

In `core/context_processors.py`:

```python
def check_async(request):
  ctx = {}
  if 'async' in request.GET:
    ctx['async'] = True
  return ctx
```

Now, make sure this context processor will run by making sure that your app name (`core` in my case) is added to `INSTALLED_APPS` in `core/settings.py`, and also by making sure that `TEMPLATES['OPTIONS']['context_processors']` includes `core.context_processors.check_async` in `core/settings.py`.

Then, the variable should be getting passed down to your templates.  Let's look at the templates folder.

In `templates/base.html`:

```html
{% if not async %}
<html>
  <head></head>
  <body>
    <div id="header">
      <a href="/page-1">Page 1</a>
      <a href="/page-2">Page 2</a>
    </div>
    <div id="content">
      {% endif %}
      {% block content %}{% endblock %}
      {% if not async %}
    </div>
    <script src="/static/hook.js"></script>
  </body>
</html>
```

In `templates/page-1.html`:

```html
{% extends 'base.html' %}

{% block content %}
<h1>Page 1</h1>
{% endblock %}
```

And in `templates/page-2.html`:

```html
{% extends 'base.html' %}

{% block content %}
<h1>Page 2</h1>
{% endblock %}
```

Finally, make sure `static/hook.js` contains the Javascript defined above.

That's it!  Now, your webapp will function like a traditional webapp, but if the user has Javascript enabled, those page transitions will be asynchronous.

Feel free to check out the [sample Django project I've created that implements what we've discussed in this tutorial](https://github.com/matix-io/django-webapp-async-example)!

## Final comments

Of course, if you want this to feel like a real Single Page App, you're going to need to modify that Javascript, but this should be enough to get you started to a smoother webapp.

Good luck!
