---
title: On Qubes OS and Compartmentalization
banner_lg: splash-lg.jpg
banner_sm: splash-sm.jpg
seo_description: >-
  Learn about security by compartmentalization as demonstrated by Qubes OS, a
  leading operating system for those concerned about security.
date: 2019-02-08 11:56:03
tags:
---


If you're concerned about security, [Qubes OS](https://www.qubes-os.org/) is an excellent operating system. For users who require absolute security and privacy to avoid persecution or targeted attacks, Qubes OS is a great candidate (perhaps the best, at this time).

For the average user who's goal is to improve security without sacrificing user experience, Qubes OS may not be the right solution.  This is mainly due to the learning curve and limitations of operating under a [Xen architecture](https://wiki.xen.org/wiki/Xen_Project_Software_Overview).

## What can we learn from Qubes?

Qubes is packed full of security goodies (and [their documentation](https://www.qubes-os.org/doc/) is an excellent resource for anyone looking to some research).

But what if you want to enjoy the comforts of a different operating system?

Let's have a look at various Qubes concepts and see how they can be applied to other environments. 

## Compartmentalization

The core concept of Qubes is compartmentalization, or isolation: the creation of "qubes" which separate the various activities you engage in on your computer. 

The [example that they give in their glossary](https://www.qubes-os.org/doc/glossary/) is that you want to keep your internet browsing isolated from your banking activities.

Why? 

Let's say you have two laptops: one for banking and one for browsing all corners of the internet. 

When you browse the internet, chances are you'll stumble upon some evil software and you won't even know it. It's very possible that your laptop will get infected. But because you do your banking on a different laptop, it just doesn't matter.

But laptops cost money and take up space, and we'd all rather have just one, so what's the solution?

## Compartmentalization by virtualization

How can we compartmentalize our activities on a single computer? We use virtualization. 

Virtualization allows us to run an _Guest_ operating system on top of our _Host_ operating system.

_A brief example for those who aren't familiar with the concept: let's say you're a "Mac person", but you need to run a Windows program. [Parallels](https://www.parallels.com/) is a popular tool that will let you run Windows on your Mac. Parallels is a virtualization tool, letting you run a Windows operating system on top of your Mac operating system._

So how can virtualization help us to compartmentalize our activities? 

Going back to our previous example, we had one laptop for browsing the internet and one laptop for banking. Now that we've introduced the concept of virtualization, we can create one virtual laptop for banking and one virtual laptop for browsing the internet.

![demonstration of compartmentalization by virtualization](compartmentalization.png)

The Host operating system runs directly on your laptop. The Host, runs two Guests on top.

Your host operating system needs to be able to communicate with it's Guests. In a perfectly isolated example, we have commands going into the Guest operating system, but only graphical output returning to the Host (you have to be able to see what's going on!)

If this were possible, we would be able to install all the malware in the world on the Web Browsing Guest and both our Host and our Banking Guest would be safe. 

## Attacks on compartmentalization by virtualization

Unfortunately, it's not possible to perfectly isolate Host and Guest environments.

The following scenarios cause problems:

- Information needs to flow between your Guests and you might also need to transfer information to your Host. For example, maybe you want to copy-paste text between compartments, or maybe you want to transfer a file. To facilitate this transfer of information, we open up the possibility of malware jumping between compartments.
- [Virtual machine breakout attacks](https://en.wikipedia.org/wiki/Virtual_machine_escape) are also a possibility, allowing a bug to escape from a Guest onto the Host.
- Any activities that occur directly on the Host impact all of the Guests; therefore protecting the Host is the most important.

## Practical implementation

In future posts, we'll explore practical implementation of Qubes concepts using Virtualbox.