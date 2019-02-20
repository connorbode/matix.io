---
title: SSH Port Forwarding
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
seo_description: >-
  Learn how to forward a port on a remote server to your local machine. Use this
  SSH trick to access services on remote machines without exposing those
  services to network dangers.
date: 2019-02-20 00:02:48
tags:
---


SSH port forwarding is an essential trick for working with remote servers.

In general, networks are a dangerous place. 

You never know who will be communicating with your machine on any network. If you're exposing your machine to the internet, you're going to be getting hit with scans the instant it is exposed.

The more ports you have open, the more at risk you are. Every open port provides a potential way in to your system for an attacker. 


## What is SSH port forwarding?

SSH port forwarding allows you to take a port on the remote machine which is not exposed, and forward it through SSH to your local machine.

Let's look at an example:

You have a remote machine, accessible on the LAN at 192.168.1.10.

__You don't trust the network, because it's accessible via unprotected Wifi in a public place__

On your remote machine, you have:

- a PostgreSQL database running on the standard port 5432, but it's listening on 127.0.0.1 (localhost) and not 0.0.0.0, because you don't want to expose your database to the network
- SSH running on the standard port 22, listening on 0.0.0.0 and accessible at 192.168.1.10:22

If you want to access your PostgreSQL database, you can log in via SSH, then connect using `psql`. That will work fine.

But what happens when you want an application to connect to your PostgreSQL database? For example, let's say you want to use a GUI to view your PostgreSQL database.. Because the database isn't exposed, you can't access it.  And your GUI likely doesn't know how to log in via SSH then connect to PostgreSQL. 

So what can you do?  Forward the port to your local machine; then you'll be able to connect to it locally.


## How can I forward a remote port to a local port via SSH?

To forward a remote port to your local machine, do the following:

```bash
ssh -L <local_port>:127.0.0.1:<remote_port> <ssh_login>
```

Following our previous example, let's forward the remote PostgreSQL port 5432 to our local port 44444.

```bash
ssh -L 44444:127.0.0.1:5432 user@192.168.1.10
```

Now, you'll be able to point your Postgres GUI to 127.0.0.1 on port 44444, to log in.
