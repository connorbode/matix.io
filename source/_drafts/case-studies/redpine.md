---
title: Building an App to help musicia
seo_description: 
tags:
layout: case-study
logo: logo.png
introduction: RedPine is the first concert crowdbooking platform. Whether you're an artist looking to crowdfund a show, venue looking to boost business or a fan looking to attend unique concerts, we got you!
---

![Screenshot of mobile app development](screenshot1.png)

__RedPine Music offers management tools that help musicians coordinate with venues to run flawless events.__

Events are complicated to organize. Who will design the show posters? Who's advertising on social media? Where will tickets be sold? Who's bringing the drum kit 🥁? And more importantly, who's bringing the cow bell?

There are many questions, and often the lack of organization leaves those questions unanswered. RedPine's toolset helps everyone come together to plan the perfect show.

## The Project

RedPine needed to build a mobile app for use at their live shows. They had two major requirements: they needed to be able to scan & validate tickets sold via their web platform; and they need to be able to sell tickets & merchandise at their shows. 

The app had to be secure: fraudsters couldn't be allowed to show fake tickets and get into shows for free.  But the solution would also have to be fast, as an app that took too long to scan tickets would leave impatient patrons waiting to get into the bar, venues losing sales on drinks, and RedPine potentially losing deals.

Additionally, RedPine wanted their musicians and venues to be able to coordinate shows using the app.  RedPine offers a feature called _Show Hub_ on their web platform which helps everyone involved in a show to plan and coordinate. But they were having one major problem: because they had to log into Show Hub to check their messages, users were missing important messages. Our job was to replicate Show Hub in the mobile app so users would be able to plan from their phone and receive notifications when there were updates.



![app development in montreal](screenshot2.png)


__The RedPine Music mobile app was designed, developed, and deployed to Google Play and the App Store in under three months.__

Our team was able to quickly refine the requirements and complete the project within a tight deadline, making the application available for the Canadian spring when hipsters come out of hibernation and head to bars for a PBR and some rock & roll.

## Features and challenges

The final product includes a secure ticket scanning feature to validate pre-purchased tickets to the show; a checkout flow for ticket & merchandise; tap or swipe to pay with credit card via Square Point-of-Sale; and all features from RedPine's Show Hub.

Integrating Square Point-of-Sale ended up being a challenging task. The mobile app was built using React Native, a framework for developing cross-platform mobile applications.  Unfortunately, there was no easy way to integrate Square Point-of-Sale into the application so we built [react-native-square-pos](/react-native-square-pos/) to make it easier for the next developer who encounters this problem.

![mobile app development studio](screenshot3.png)

Check out the app on the [App Store](https://itunes.apple.com/us/app/redpine/id1458779748?mt=8) or [Google Play](https://play.google.com/store/apps/details?id=com.redpinemusic.mobile&rdid=com.redpinemusic.mobile).

If you're interested in learning more about this project or our team, [we'd love to chat](/#get-in-touch).