---
title: Search the security.txt records found in the Alexa Top 1 Million
date: 2019-03-19 21:47:32
tags:
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
seo_description: Use this index to search security.txt records in the Alexa Top 1 Million sites
---

<div class="security-txt-wrapper">
	<div class="search-wrapper" id="search-wrapper">
		<div class="filters">
			<div class="search">
				<input type="text" id="search" placeholder="Filter by domain name">
			</div>
			<div class="filter">
				<div class="filter-title">Filter by existence of fields (click to enable)</div><div class="check" data-key="canonical">Canonical</div><div class="check" data-key="preferred_languages">Preferred Languages</div><div class="check" data-key="acknowledgements">Acknowledgements</div><div class="check" data-key="contact">Contact</div><div class="check" data-key="encryption">Encryption</div><div class="check" data-key="hiring">Hiring</div><div class="check" data-key="policy">Policy</div>
			</div>
		</div>
		<div id="filter-toggle" class="filter-toggle">Show filters</div>
		<div class="read-about-this-project"><a href="/security-txt-search">Read about this project</a></div>
		<div id="num-results" class="num-results"></div>
		<div id="results" class="results"></div>
	</div>
	<div class="details">
		<div id="back-to-results" class="back-to-results">&lt; Back to results</div>
		<div id="domain" class="domain"></div>
		<div id="txt"></div>
	</div>
</div>

<script src="data.js"></script>
<script type="text/template" id="template">
	<div class="title">{title}</div>
</script>
<script>
var q = function (query) { return document.querySelectorAll(query) }
var template = q('#template')[0].innerText;
var results = q('#results')[0];
var search = q('#search')[0];
var numResults = q('#num-results')[0];
var searchWrapper = q('#search-wrapper')[0];
var backToResults = q('#back-to-results')[0];
var domain = q('#domain')[0];
var txt = q('#txt')[0];
var elem, tpl, searchTimeout;
var filters = {};

function handleDomainClick(_domain) {
	return function () {
		var text = '';
		var dd = data[_domain];
		domain.innerText = _domain;

		if (dd['.well-known']) {
			text += '<a href="https://' + _domain + '/.well-known/security.txt" target="_blank">/.well-known/security.txt</a><pre>' + dd['.well-known'].raw + '</pre>';
		}

		if (dd['root']) {
			text += '<a href="https://' + _domain + '/security.txt" target="_blank">/security.txt</a><pre>' + dd['root'].raw + '</pre>';
		}

		txt.innerHTML = text;
		searchWrapper.setAttribute('data-hidden', 'true');
	}
}

function refresh() {
	results.innerHTML = '';
	var num = 0;
	var keys = Object.keys(data).sort(function (a, b) {
		if (a < b) return -1;
		if (a > b) return 1;
		return 0;
	});
	var searchValue = search.value.toLowerCase();

	keys.forEach(function (key) {
		// domain filter
		if (searchValue && key.indexOf(searchValue) === -1) return;

		// field filter
		var filterKey
		var isEmpty = function (path, fk) {
			if (!data[key][path]) return true;
			if (!data[key][path][fk] || data[key][path][fk].length === undefined) {
				return data[key][path][fk] === null;
			} else {
				return data[key][path][fk].length === 0;
			}
		}
		for (filterKey in filters) {
			if (filters[filterKey] === true && isEmpty('root', filterKey) && isEmpty('.well-known', filterKey)) return; 
		}

		// create element
		elem = document.createElement('div');
		elem.classList.add('result');
		elem.addEventListener('click', handleDomainClick(key));
		tpl = template.replace('{title}', key);
		elem.innerHTML = tpl;
		results.appendChild(elem);
		num += 1;
	});

	numResults.innerText = num + ' results found';
}

refresh();

search.addEventListener('keyup', function () {
	if (searchTimeout) clearTimeout(searchTimeout);
	searchTimeout = setTimeout(refresh, 300);
});

backToResults.addEventListener('click', function () {
	searchWrapper.setAttribute('data-hidden', 'false');
});

q('.filter .check').forEach(function (filterButton) {
	filterButton.addEventListener('click', function (e) {
		var target = e.target;
		var key, checked;

		while (true) {
			key = target.getAttribute('data-key');

			if (key !== null) {
				break;
			}

			target = target.parentElement;
		}

		checked = target.getAttribute('data-checked');

		if (checked === 'true') {
			target.setAttribute('data-checked', 'false');
			filters[key] = false;
		} else {
			target.setAttribute('data-checked', 'true');
			filters[key] = true;
		}
		refresh();
	});
})

var filters = q('.filters')[0];
var filtersOpen = false;
var filterToggle = q('#filter-toggle')[0];
filterToggle.addEventListener('click', function () {
	if (filtersOpen) {
		filters.setAttribute('data-open', 'false');
		filtersOpen = false;
		filterToggle.innerText = 'Show filters'
	} else {
		filters.setAttribute('data-open', 'true');
		filtersOpen = true;
		filterToggle.innerText = 'Hide filters'
	}
});
</script>

<style>
body {
	overflow: hidden;
}

.filter-toggle {
	background: #555;
	display: inline-block;
	color: white;
	padding: 5px 10px;
	border-radius: 10px;
	cursor: pointer;
}

.read-about-this-project {
	display: inline-block;
	margin-left: 10px;
}

.filters {
	max-height: 0;
	overflow: hidden;
	transition: max-height 0.5s ease-in-out;
}

.filters[data-open="true"] {
	max-height: 300px;
}

.search-wrapper * {
	user-select: none;
}

.search-wrapper br {
	display: none;
}

.filter-title {
	color: #555;
	margin-bottom: 5px;
}

.check {
	display: inline-block;
	padding: 10px;
	border: 1px solid #eee;
	border-radius: 10px;
	margin-right: 5px;
	margin-bottom: 5px;
	cursor: pointer;
	user-select: none;
}

.check[data-checked="true"] {
	background: #eee;
}

.result {
	padding: 20px 10px;
	cursor: pointer;
	position: relative;
	border-bottom: 1px solid #eee;
}

.result::after {
	content: '>';
	position: absolute;
	right: 20px;
	top: 50%;
	transform: translateY(-50%);
	color: #999;
}

.result:hover {
	background: #efefef;
	border-radius: 5px;
}

.security-txt-wrapper {
	position: fixed;
	overflow: hidden;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1000;
	background: white;
}

.results {
	border-top: 1px solid #eee;
	max-height: 600px;
	overflow-y: scroll;
	position: relative;
	top: 0;
	left: 0;
	z-index: 1;
	-webkit-overflow-scrolling: touch;
}

.search-wrapper {
	transition: transform 0.2s ease-in-out;
	transform: translateX(0);
	background: white;
	position: relative;
	z-index: 1;
	padding: 0 10px;
}

.search-wrapper[data-hidden="true"] {
	transform: translateX(-100%);
}

.details {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 0;
	padding: 0 10px;
	width: 100%;
	height: 100%;
	overflow: scroll;
}

input {
	font-size: 17px;
	padding: 5px;
	width: 100%;
	border-radius: 10px;
	border: 1px solid #eee;
	margin-bottom: 10px;
}

.num-results {
	padding: 20px 0;
}

.back-to-results {
	padding: 20px 0;
	color: #555;
	cursor: pointer;
}

.domain {
	font-size: 30px;
}

#txt {
	overflow: scroll;
	width: 100%;
}
</style>