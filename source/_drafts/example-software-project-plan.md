---
title: An Example Software Project Plan
banner_lg: splash-lg.jpg
banner_sm: splash-sm.jpg
seo_description: We'll demonstrate how we plan a software project.
tags:
---

In this post we'll demonstrate how we proceed with planning a software project. 

Since software projects are solutions to problems, let's start by defining our problem.


## The Problem

Let's say you have an active Instagram account and you want to display the photos from your Instagram account on your website.

This can be accomplished by acquiring an **Instagram Access Token** for your website. You can use that Access Token to fetch the photos from your Instagram feed and you can display them however you would like.

There's just one problem: **these tokens stop working, randomly and without warning**.

When the Access Token stops working, your Instagram feed does too.  Since you don't check every feature of your site every day, you might not notice for some time.. but your users will.

The goal of this project will be to notify you that your Instagram token has expired, so you can refresh it before your users notice.


## Defining the Actors

The first step in planning a project is to describe all the types of users who will use your application.  These users are known as "Actors" in the plan.

In our scenario, we'll only have a single class of users: people who have an Instagram account and have generated an access token.


## Describing the Use Cases

Next, we'll want to describe all the functionality that will be present in the application:

1. As a user, I should be able to create a new account
1. As a user, I should be able to log into my account
1. As a user, I should be able to submit a new Instagram Access Token
1. As a user, I should receive an email alert if an Instagram Access Token is expired
1. As a user, I should be able to store a note with each Instagram Access Token (this might be useful for reminding yourself how you fix a broken token on your site)
1. As a user, I should be able to see a list of my Instagram Access Tokens
1. As a user, I should be able to delete an Instagram Access Token


## Wireframing

For the next step, we'll take those use cases & add a visual element to them.

