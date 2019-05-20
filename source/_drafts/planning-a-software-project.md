---
title: Planning a software project
banner_lg: splash-lg.jpg
banner_sm: splash-sm.jpg
seo_description:
tags:
---

Ever wonder how a software project gets started?  This post goes over how we handle planning your project, taking an exciting idea and preparing it for implementation.


## Who will use your application?

This is the first important question that needs to be asked. Who will use your application? Will there be many types of users or will all users be equal?

Some applications will just have a single class of users. For example, on Instagram all users are created equal: everyone can take photos and upload them to their accounts. 

Other applications will have multiple types of users. For example, Uber has both drivers and riders -- which one are you?


## How will your application be used?

After we know *who* will use the application, we need to determine *how* they will use the application. This is done by writing what's called **Use Cases**.

Here are some examples:

- As a user of Instagram, I can take a photo with my camera and it will upload to my account
- As an Uber rider, I can request a ride from point A to point B
- As an Uber driver, I can accept a ride-request to take a rider from point A to point B

There are also some standard use cases which are included in almost every application, like:

- As a user, I can sign up for an account
- As a user, I can log into my account
- As a user, I can recover a forgotten password


## Wireframing

We admit it: use cases aren't the easiest things for everyone to understand. We try our best to get the use cases correct the first time around, but they will undoubtedly need some work.

Wireframing helps us align on those use cases. A wireframe is a prototype of your application, drawn only with lines. There are no fancy designs, just boxes to show a button a user might click or a textarea they might type into.

Here's an example wireframe for a log in page:

![wireframe for login page](wireframe.png)

**It's not pretty, but it helps us make sure we understand how you want the application to function.**


## Technical planning

At this point, we have a pretty good understanding of what you want to build. Now it's our turn to figure out what's required on the technical end.

We'll figure out what components are required:

- do we need a web server?
- do we need a database?
- do we need to send out emails?
- do we need to send out sms or make robocalls?
- are there jobs that need to be run in the background, for example "once per day at midnight"?
- ...

We'll also identify how these components will interact to implement each of your use cases.

For example, to sign up for an account:

1. User fills out form on the mobile app
2. Mobile app sends details to web server
3. Web server validates the form
4. Web server sends out a registration confirmation to user's email
5. User clicks a link in email which makes request to web server
6. Web server marks user's account as "confirmed"
7. Web server launches mobile app
8. Mobile app refreshes user's account, verifying it is confirmed

