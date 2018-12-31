---
title: Determine how long a visitor is on a page.
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
seo_description: >-
  Do you want to know how long a user has spent on your website?  Here's a
  simple Javascript solution.
date: 2018-12-31 18:46:51
tags:
---


Do you want to know how long a user has spent on your website?  Here's how!

## The Data

For each page a user visits, you'll need to store the following data:

- `user_id`: a way to uniquely identify your user
- `page`: the page the user visited; for example `/index.html`
- `opened_at`: the time the user opened the page
- `last_checkin`: the last time we recorded the user on that page

## The Process

We're going to have two major actions:

1. When the user first visits the page, we'll execute some Javascript to create a new data point on the server.
2. At some regular interval (let's say every 10 seconds), we'll update the `last_checkin` data on the server.

## The Endpoints

Let's assume that we're using the REST endpoint `/data`.  We'll have `POST /data` to create a new datapoint and `PUT /data/:id` to update the `last_checkin` of that datapoint.

Of course, you would need to build this route on your server yourself, and store the data that is sent to it.  Perhaps a subsequent blog post will cover how that can be achieved.

## The Javascript

In the pages you want to track, you can include the following Javascript.  The example uses `fetch`, [which you will need to polyfill for full browser compatibility](https://github.com/github/fetch).

```javascript
(function () {
	var checkInInterval = 10000; // check in every 10 seconds
	var userId = 1; // you'll need to figure out how you get the user id
	var data = {
		user_id: userId, 
		page: window.location.pathname,
		opened_at: Date.now()
	};

	// create a new datapoint on the server
	fetch('/data', {
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify(data)
	}).then(function (res) { return res.json() }).then(function (data) {
		setInterval(function () {

			// check in
			data.last_checkin = Date.now();
			fetch('/data/' + data.id, {
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				method: 'PUT',
				body: JSON.stringify(data)
			});

		}, checkInInterval);
	})
})();
```
