---
title: How to save a document in VIM with superuser privileges.
banner_lg: banner-lg.png
banner_sm: banner-sm.png
seo_description: Learn how to save a document with superuser privileges in VI or VIM.
date: 2019-02-22 23:59:58
tags:
---


Imagine this scenario:

You're logged into a server. You've been editing a file in `vi` for 30 minutes and you're finally about to finish. You type `:wq` to save and quit, but a warning comes up.

> 'readonly' option is set (add ! to override)

Dammit. You forgot that the file is owned by root, and you don't have the privileges you need to write to it.

How can you get privileges without losing your edits?

Use this great trick:

`:w !sudo tee %`


## How does this work?

There's a [great explanation on Stack Overflow](https://stackoverflow.com/a/7078429/962996), but we'll provide a brief summary:

1. `:w [file]` will write the current document to `[file]`
2. `:w ![cmd]` will pipe the current document to `[cmd]`, a command of your choice
3. `:w !sudo tee [file]` will write the current document to `[file]`, using superuser privileges. The `tee` command allows you to pipe stdin to a subcommand / file and also to stdout.
4. `%` refers to the current filename in VIM, so `:w !sudo tee %` is going to write the current document to the opened filename, with superuser privileges.