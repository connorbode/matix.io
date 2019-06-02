---
title: What browser am I using?
banner_lg:
banner_sm:
seo_description:
tags:
layout: post-blank
---

<div class="meta">
	<h1>What browser am I using?</h1>
	<div id="add-details"></div>
	<a href="#content-wrapper"><h2>What is a browser? ↓</h2></a>
</div>

<div id="content-wrapper" class="wrapper">
	<div class="content">
		This is some content...
	</div>
</div>

<script src="ua-parser.min.js"></script>
<script>
var browser = new UAParser(window.navigator.userAgent).getBrowser()
var browserString = browser.name + ' ' + browser.major;
var browserName = browser.name.toLowerCase();
var browserImg = 'https://github.com/alrra/browser-logos/raw/master/src/' + browserName + '/' + browserName + '_64x64.png';
var div = document.createElement('div');
div.classList.add('user-browser');
div.innerHTML = (browserImg ? '<img src="' + browserImg + '"> ' : '') + '<div class="browser-wrap"><div class="currently-using">You are currently using...</div><div class="browser-string">' + browserString + '</div></div>';
document.querySelector('#add-details').appendChild(div);
</script>

<style>
h2 {
	font-family: "Roboto";
	font-weight: lighter;
	position: absolute;
	bottom: 20px;
	margin: auto;
	left: 0;
	right: 0;
	color: #3583f2;
}
.meta {
	width: 100% !important;
	margin-top: 0 !important;
}

.meta * {
	text-align: center;
}

#splash-img {
	display: none;
}

.meta .date {
	display: none;
}

.user-browser {
	font-family: "Roboto";
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 30px;
	font-weight: lighter;
	margin-top: 35px;
}

.user-browser * {
	padding: 0 10px;
}

.currently-using {
	font-size: 15px;
	text-align: left;
}

.browser-string {
	text-align: left;
	margin-top: 5px;
}
</style>