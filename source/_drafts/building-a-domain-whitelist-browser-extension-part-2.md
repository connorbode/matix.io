---
title: Building a domain whitelist browser extension (part 2)
banner_lg:
banner_sm:
seo_description:
tags:
---

In the last part of this series, we started creating a browser whitelist. If you haven't read that series, [get caught up!](https://matix.io/building-a-domain-whitelist-browser-extension).

At the end of the article, we identified various UX issues. We'll continue to fix those UX issues so we have a usable extension.

# Letting the user know when their requests were blocked

At the moment, the user is not alerted when their requests get blocked. Of course, this can lead to confusion (why the $%^&@ isn't my page loading?!?!)

How can we resolve this?

There are a number of events triggered, but one way is to trigger a browser notification.  To do this, we'll need to edit our `manifest.json`, adding the `notifications` permission.  Then, we can trigger a notification as follows:

```javascript
browser.notifications.create({
	type: "basic",
	title: "Blocked request",
	message: "Some requests have been blocked. Click to manage firewall."
})
```

If you have many requests that gets blocked, this is very annoying. To limit the number of notifications that get sent, we can do the following:

```javascript
if (!lastNotification || Date.now() - lastNotification > threshold) {
	browser.notifications.create({
		type: "basic",
		title: "Blocked request",
		message: "Some requests have been blocked. Click to manage firewall."
	})
	lastNotification = Date.now()
}
```

And, for this to work, you'll need to define the following in the appropriate scope (e.g. wrapping function):

```javascript
let lastNotification, threshold = 10000 // don't send notifications twice in 10 seconds
```

# Handling notification clicks

Our notification had the call to action "Some requests have been blocked. Click to manage firewall."

To handle that situation, we can add the following handler:

```
browser.notifications.onClicked.addListener(() => {
	browser.tabs.create({
		url: 'manager.html'
	})
})
```

This will open a new tab to manage the extension. In the next part of this series, we'll set up the `manager.html` page.  Specifically, we will display a list of all URLs that have been blocked and add a way to manage the existing rules of the firewall.