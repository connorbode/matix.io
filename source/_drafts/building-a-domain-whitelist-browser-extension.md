---
title: Building a domain whitelist browser extension
banner_lg: splash-lg.jpg
banner_sm: splash-sm.jpg
seo_description:
tags:
---

Today we're going to build a domain whitelist browser extension. We'll be building specifically for FireFox, but the APIs are similar for Chromium-based browsers.

# Functionality

The goals of this project are as follows:

1. Include a hardcoded whitelist of URL patterns that the browser is allowed to load
2. For every web request, only allow the URL to load if it is in the whitelist
3. For URLs that are getting blocked by the whitelist, we want to let the user know

# Setting up the extension

The most important part of a browser extension is the `manifest.json`. This file defines properties of the browser extension, including what permissions it will have and how it will behave.

Our `manifest.json` will look like this:

```
{
	"manifest_version": 2, 
	"name": "Domain Whitelist",
	"version": "1.0",
	"description": "Prevents the browser from loading websites from non-whitelisted domains.",
	"permissions": [
		"webRequest",
		"webRequestBlocking",
		"<all_urls>"
	],
	"background": {
		"scripts": ["background.js"]
	}
}
```

Let's deconstruct the two important parts of this manifest: `permissions` and `background`.

In `permissions`, we're granting various permissions to our extension:

- `webRequest` allows us to intercept HTTP requests made by the browser. 
- `webRequestBlocking` allows us to redirect those HTTP requests.
- Finally, `<all_urls>` is going to let us use the interception & redirection permissions we've gained on any URL.

In `background`, we've included a script `background.js`, which will run all the time. Inside `background.js`, we're going to use the permissions we've acquired.

# The background script

Our background script, `background.js`, is going to be built as follows:

```javascript
(() => {
	const whitelist = [
		/https:\/\/trello\.com\/*/
	]
	browser.webRequest.onBeforeRequest.addListener((request) => {
			const url = request.url
			let allowed = false
			whitelist.forEach((rule) => {
				if (rule.test(url)) allowed = true
			})
			if (!allowed) {
				return {
					cancel: true
				}
			}
		}, {
			urls: ['<all_urls>']
		},
		['blocking']
	)
})()
```

Again, let's deconstruct what's happening here.

1. We're defining our whitelist patterns in the code.  These will be used to verify that loaded URLs are valid.
2. Using our `webRequest` permission, we're intercepting every request that is made with our listener
3. We're checking the URL of each request against our whitelist
4. If the URL is not in our whitelist, we're going to use our `webRequestBlocking` permission to cancel the request. 

# Loading the extension

Now that we've created a simple extension, we can load the extension as follows:

1. In FireFox, visit `about:debugging#addons`
2. Click `Load Temporary Add-on...`
3. Find the folder you've built the app in, and load it

The extension is now active. If you visit any site except that doesn't match your whitelist patterns it won't load. Even for trello.com, you'll notice some images aren't loading because they're going to be loaded from external domains.

# UX considerations and next steps

At this point, the application is going to cause some major headaches:

- Editing the whitelist needs to be done manually, in the code, and the extension needs to be reloaded each time.
- When a web request is cancelled, the user isn't going to know. There's no indication of why a page hasn't loaded, it just won't. Debugging this will be painful and time-consuming.

In the next part of this series, we'll explore how we can solve these problems. 