---
title: React Native Square POS
banner_lg: square-pos.jpg
banner_sm: square-pos-sm.jpg
seo_description: >-
  A React Native module for interacting with the Square Point of Sale (POS)
  application.
date: 2019-05-12 00:47:13
tags:
---


__If you're looking for [documentation on react-native-square-pos, it's available on Github](https://github.com/matix-io/react-native-square-pos)__

## Square POS

Square Point of Sale (POS) is a mobile application that allows users to capture credit card transactions from their mobile device.  By plugging in their Square Reader via Lightning connector or headset jack users can swipe or tap credit cards to quickly accept the payment.

Square POS can be integrated into other mobile applications (including react native apps) to accept credit card transactions.  The flow looks like this:

1. The React Native application constructs a payload which will tell Square POS details like how much to charge and what currency the charge should be in.
2. The React Native application launches Square POS, with the payload.
3. The user completes the charge using Square POS.
4. The user is automatically returned to the React Native app, with details from the Square transaction.

This is a great way to accept credit card payments in your mobile app (especially if you can't use Square's in-app payments, which are limited to organizations in the United States).


## Square POS in React Native

When we went to integrate Square POS into an application, we found there was no public React Native module for the task.  The APIs available are in Objective-C (iOS) and Java (Android), but we've made the task of integrating Square POS into React Native a little bit easier for everyone with an [simple package](https://github.com/matix-io/react-native-square-pos).

For more details on the package, or to get some instructions on how to install it, you can [check out the project on Github](https://github.com/matix-io/react-native-square-pos).