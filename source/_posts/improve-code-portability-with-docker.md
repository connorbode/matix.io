---
title: Improve code portability and development environments using Docker
date: 2019-02-24 02:23:13
tags:
banner_lg: splash-lg.jpg
banner_sm: splash-sm.jpg
seo_description: Improve your development workflow and code portability by using Docker to build your development environments.
---


Still using LAMP / WAMP stack? It's time to level up.

Containers can help you isolate your development environments


## The Problem

Every coding project comes with an environment. There are languages and frameworks and databases and caches and endless other dependencies that need to be installed. Each comes with specific version requirements that may or may not work the same on different operating systems. 

Developers inevitably encounter a struggle when setting up a project on a new computer.


## The Solution

What if projects came bundled with their environments? It's possible, and easy with a tool called [Docker](https://www.docker.com/) and its partner [Docker Compose](https://docs.docker.com/compose/).

The concept is that the application will run inside a virtual machine. That VM will always be the same, so we can eliminate operating system discrepencies. That virtual machine will be bundled with a script to download and run the application.

Goodbye project setup problems!