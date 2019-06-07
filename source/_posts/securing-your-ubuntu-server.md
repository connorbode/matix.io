---
title: Securing your Ubuntu server from common attacks
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
seo_description: Learn some essentials for keeping your Ubuntu server safe from hackers.
date: 2019-06-07 16:24:00
tags:
---


Launching a machine on Digital Ocean or Amazon's EC2?  Chances are, within minutes of it being online, you'll have bots checking for ways in. 

Luckily, there are some easy steps you can take right away to prevent hackers from getting in.


## Configuring the server to avoid common SSH attacks

By default, SSH runs on port 22. Everyone knows this, including the bots that are scanning the internet for vulnerable servers. 

Want proof that this is an issue?  Launch a machine on Digital Ocean, then run:

```bash
tail -f /var/log/auth.log
```

In our experience, you're going to see a lot of login attempts very quickly. 

Here's a snippet of our log from the past couple of minutes:

```ssh
Jun  7 19:29:24 ubuntu-s-1vcpu-1gb-tor1-01 sshd[2016]: Invalid user test123 from 142.93.119.116 port 40820
Jun  7 19:29:24 ubuntu-s-1vcpu-1gb-tor1-01 sshd[2016]: Received disconnect from 142.93.119.116 port 40820:11: Normal Shutdown, Thank you for playing [preauth]
Jun  7 19:29:24 ubuntu-s-1vcpu-1gb-tor1-01 sshd[2016]: Disconnected from invalid user test123 142.93.119.116 port 40820 [preauth]
Jun  7 19:32:54 ubuntu-s-1vcpu-1gb-tor1-01 sshd[2088]: Invalid user dominik from 142.93.119.116 port 51584
Jun  7 19:32:54 ubuntu-s-1vcpu-1gb-tor1-01 sshd[2088]: Received disconnect from 142.93.119.116 port 51584:11: Normal Shutdown, Thank you for playing [preauth]
Jun  7 19:32:54 ubuntu-s-1vcpu-1gb-tor1-01 sshd[2088]: Disconnected from invalid user dominik 142.93.119.116 port 51584 [preauth]
Jun  7 19:33:35 ubuntu-s-1vcpu-1gb-tor1-01 sshd[2091]: Invalid user usuario from 49.206.224.31 port 51454
Jun  7 19:33:35 ubuntu-s-1vcpu-1gb-tor1-01 sshd[2091]: Received disconnect from 49.206.224.31 port 51454:11: Normal Shutdown, Thank you for playing [preauth]
Jun  7 19:33:35 ubuntu-s-1vcpu-1gb-tor1-01 sshd[2091]: Disconnected from invalid user usuario 49.206.224.31 port 51454 [preauth]
```

Occasionally, you're also going to see a bot that attempts to brute-force a login using many different username / password combinations.

### How can we prevent bots from breaking in?

#### 1. Disabling Password Authentication

Brute force attacks try common username / password combinations to find a working login.  If we disable password authentication in favour of public key authentication, then brute forcing becomes theoretically impossible. 

How do we do it?

First, you need to [set up public-key authentication](https://kb.iu.edu/d/aews) and make sure you can connect using your public key.  __This is very important; if you can't connect using your public key, the next steps will lock you out of your server.__

After that's complete, let's disable password authentication.  Open up `/etc/ssh/sshd_config` and add the following lines:

```bash
PubkeyAuthentication yes
PasswordAuthentication no
ChallengeResponseAuthentication no
```

Now we can restart the SSH daemon as follows:

```bash
systemctl reload ssh
```

Now log out and log back in.  Brute-force attacks should now fail.


#### 2. Hiding your SSH service from the public

As we mentioned above, everyone knows SSH runs on port 22, and there are bots hunting for servers that are misconfigured.

Are these bots performing sophisticated attacks?  No.

These bots are scanning as many machines as they possibly can on the internet (and there are a LOT), looking for common vulnerabilities.  If they don't find the vulnerability they are looking for on your machine, they will move on.

They are performing what's known as a "horizontal scan": they are scanning many IP addresses, looking at a few known ports.

What if we change our SSH port?

If we move the SSH port to an upper-range, unknown port, we drastically reduce the number of scans that reach our server.

Choose a number between 49152 and 65535.  We'll choose 55239.  Then, add the following line to `/etc/ssh/sshd_config`:

```bash
Port 55239 # or whatever number you chose
```

__If you have any firewall enabled, it's important that you configure it to allow traffic through that port, otherwise you will be locked out of your server.  We'll discuss configuring the firewall below.__

Restart the SSH daemon as follows:

```bash
systemctl reload ssh
```

Now log out.  When you attempt to log back in, you should receive the message `Connection refused`, because SSH is no longer listening on the default port.  You'll now need to connect on port 55239 (on unix SSH client, you can pass `-p 55239`).


#### 3. Banning malicious IPs

So now we've hidden the service and made it theoretically impossible to brute force a login, but we'll likely still encounter abuse (it's the internet, of course we'll get attacked!)

The next step is to install `fail2ban`, which will ban IP addresses that make too many login attempts.

```bash
apt-get install fail2ban
systemctl start fail2ban
```

The default install on Ubuntu will protect the SSH port.


## Configuring a firewall

So we've protected the SSH port.  But what if there are other ports open?  

It's possible that you've installed software that opened up ports without you knowing! For example, [MongoDB opened itself up to the public by default](http://www.tothenew.com/blog/is-your-mongodb-publicly-accessible/) in previous versions.

A firewall helps you to control what ports are open to the internet.  Let's set up a default configuration:

```bash
apt-get install ufw
ufw default deny # if we don't have another rule, deny the request

# MAKE SURE THIS IS CORRECT OR YOU WILL BE LOCKED OUT
ufw allow 55239 # this is the SSH port that you configured before
```

Finally, let's enable the firewall:

```bash
ufw enable
```

Hopefully you didn't get locked out 😁


## Configuring automatic security updates

Finally, we want to make sure that our machine automatically updates itself. New vulnerabilities are discovered every day.  

What if a vulnerability for `ufw` or `fail2ban` or Ubuntu's TCP stack is discovered? 

As soon as a patch is available, we want it to be applied.

To do this, follow a tutorial on [installing unattended-upgrades](https://libre-software.net/ubuntu-automatic-updates/).  


## Ok, I'm done.  Am I safe?

Great!  Your machine is _probably_ ok for now.. IT security is complicated.

Every port you open will increase your attack surface.  Only open a port if it is absolutely necessary. And every time you open a port, do your research about how you can keep that port secure.

Good luck!