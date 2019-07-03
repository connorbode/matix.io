---
title: Running Multiple Django Projects via WSGI Middleware
banner_lg: splash-lg.png
banner_sm: splash-sm.png
seo_description: >-
  A simple way to run multiple Django projects on the same infrastructure during
  development.
date: 2019-07-03 09:03:36
tags:
---


Configuring a server for a Django project takes time.  You need to provision services like databases and caches.  You need to set up nginx or Apache.  You need to run your app behind a WSGI module like Gunicorn or uWSGI.

Sometimes, you just want to launch a project online without going through all the configuration.

**Warning: The setup described in this tutorial is not recommended for production.**  

The problems with this setup are described at the bottom of this article.


## The setup

What we're going to do is build a WSGI middleware for running multiple Django projects on the same infrastructure.

**Why the f*&# would you want to do that??**

This setup allows you to run multiple projects on the same nginx server and gunicorn process.  That's two configuration steps you can skip.  You can also use the same database process to back your process.

In a normal Django setup, Gunicorn will run Django's `wsgi.py` file.  What's in a WSGI file?  It's a single function that accepts an HTTP request and returns a response.  That's it.

Instead of mounting Django's WSGI module directly on Gunicorn, we'll create a middleware that chooses which Django project to mount depending on the request that's received.


## Directory structure

```
|- root
    |- wsgi.py
    |- project_one
    |   |- manage.py
    |   |- core
    |       |- __init__.py
    |       |- admin.py
    |       |- models.py
    |       |- settings.py
    |       |- urls.py
    |       |- views.py
    |       |- wsgi.py
    |
    |- project_two
        |- manage.py
        |- core
            |- __init__.py
            |- admin.py
            |- models.py
            |- settings.py
            |- urls.py
            |- views.py
            |- wsgi.py
```


## The code

Here's our middleware, `/root/wsgi.py`:

```python
import sys
import os
import importlib

# this could be loaded from a separate file
apps = {
    'project-one.com': {
        'env': {
            'DATABASE_URL': 'postgres://projectone:projectone@127.0.0.1:5432/projectone'
        },
        'path': '/root/projectone',
        'wsgi': 'core.wsgi'
    },
    'project-two.com': {
        'env': {
            'DATABASE_URL': 'postgres://projecttwo:projecttwo@127.0.0.1:5432/projecttwo'
        },
        'path': '/root/projecttwo',
        'wsgi': 'core.wsgi'
    }
}

def application(environ, startresponse):
    host = environ.get('HTTP_HOST', '')

    if host in apps:
        app = apps[host]
        sys.path.append(app['path'])
        for key, value in app['env'].items():
            os.environ[key] = value
        wsgi = importlib.import_module(app['wsgi'])
        return wsgi.application(environ, startresponse)

    # could be modified to handle host not found
```

What's happening here?  In the `apps` dictionary we're defining each of our Django projects.  `path` points to where the project is located, and `wsgi` names the file that the Django WSGI module is in.  Finally, `env` contains any environment variables we want to set for that project.

## Running

To run this, we'll point Gunicorn at `/root/wsgi.py`.  It's important that Gunicorn be started with `--max-requests=1` so that the application code will get reloaded on every request.  Otherwise, whichever Django project is loaded first will be served until Gunicorn is restarted.

Here's an example of starting the server:

```bash
cd /root
gunicorn wsgi:application --max-requests 1
```

You'll still need to configure static files for each application


## Launching a new project

Want to launch a new project?  Create some new credentials for your database, generate a new folder for static files, update the app config for your `wsgi.py` and restart Gunicorn.

Much quicker than provisioning a new server.


## Problems with this setup

1. Gunicorn is restarting with every request.  You're taking a performance hit for that.
2. There is no compartmentalization.  Everything is running as the same OS user.  If one of your projects gets compromised, they all get compromised.