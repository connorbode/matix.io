---
title: Access your Twitter feed using Python
banner_lg: banner-lg-2.jpg
banner_sm: banner-sm.jpg
seo_description: >-
  Use Python to programmatically fetch your Twitter feed and perform other
  actions.
date: 2019-02-13 22:00:19
tags:
---


Want to access Twitter programmatically, using Python?  Here's how.

## Getting set up

We'll use [`python-twitter`](https://github.com/bear/python-twitter) to get connected.

Install it using `pip install python-twitter`.

Now, head over to [Twitter's developer portal](https://developer.twitter.com/en/apps/) and create yourself an app.

After the app's created, you'll need to visit __Details > Keys and tokens__. There you'll find the keys you need:

- Consumer API key
- Consumer API secret
- Access token
- Access token secret

__If you don't see your access token details, you'll need to click the "Create" button__.


## Creating our script

Now, let's connect to Twitter!

```python
import twitter

connection_details = {
	'consumer_key': '<consumer_key>',
	'consumer_secret': '<consumer_secret>',
	'access_token_key': '<access_token>',
	'access_token_secret': '<access_token_secret>'
}

api = twitter.Api(**connection_details)
```

Now you'll have access to all the Twitter data you need, from your own account.  Keep in mind that you're acting as yourself. If you need access to other's data, you'll need to use OAuth -- that's for another tutorial.

With this library, you'll have many methods available to you. You can always check what methods are available using `dir()`:

```python
from pprint import pprint
pprint(dir(api))
['CheckRateLimit',
 'ClearCredentials',
 'CreateBlock',
 'CreateFavorite',
 'CreateFriendship',
 'CreateList',
 'CreateListsMember',
 'CreateMute',
 'CreateSubscription',
 'DEFAULT_CACHE_TIMEOUT',
 'DestroyBlock',
 'DestroyDirectMessage',
 'DestroyFavorite',
 'DestroyFriendship',
 'DestroyList',
 'DestroyListsMember',
 'DestroyMute',
 'DestroyStatus',
 'DestroySubscription',
 'GetBlocks',
 'GetBlocksIDs',
 'GetBlocksIDsPaged',
 'GetBlocksPaged',
 'GetDirectMessages',
 'GetFavorites',
 'GetFollowerIDs',
 'GetFollowerIDsPaged',
 'GetFollowers',
 'GetFollowersPaged',
 'GetFriendIDs',
 'GetFriendIDsPaged',
 'GetFriends',
 'GetFriendsPaged',
 'GetHelpConfiguration',
 'GetHomeTimeline',
 'GetListMembers',
 'GetListMembersPaged',
 'GetListTimeline',
 'GetLists',
 'GetListsList',
 'GetListsPaged',
 'GetMemberships',
 'GetMentions',
 'GetMutes',
 'GetMutesIDs',
 'GetMutesIDsPaged',
 'GetMutesPaged',
 'GetReplies',
 'GetRetweeters',
 'GetRetweets',
 'GetRetweetsOfMe',
 'GetSearch',
 'GetSentDirectMessages',
 'GetShortUrlLength',
 'GetStatus',
 'GetStatusOembed',
 'GetStreamFilter',
 'GetStreamSample',
 'GetSubscriptions',
 'GetTrendsCurrent',
 'GetTrendsWoeid',
 'GetUser',
 'GetUserRetweets',
 'GetUserStream',
 'GetUserSuggestion',
 'GetUserSuggestionCategories',
 'GetUserTimeline',
 'GetUsersSearch',
 'IncomingFriendship',
 'InitializeRateLimit',
 'LookupFriendship',
 'OutgoingFriendship',
 'PostDirectMessage',
 'PostMedia',
 'PostMediaMetadata',
 'PostMultipleMedia',
 'PostRetweet',
 'PostUpdate',
 'PostUpdates',
 'SetCache',
 'SetCacheTimeout',
 'SetCredentials',
 'SetSource',
 'SetUrllib',
 'SetUserAgent',
 'SetXTwitterHeaders',
 'ShowFriendship',
 'ShowSubscription',
 'UpdateBackgroundImage',
 'UpdateBanner',
 'UpdateFriendship',
 'UpdateImage',
 'UpdateProfile',
 'UploadMediaChunked',
 'UploadMediaSimple',
 'UsersLookup',
 'VerifyCredentials',
 ...
```

And if you're curious about what each of those methods do, the author of the package has [left comments in the source code](https://github.com/bear/python-twitter/blob/master/twitter/api.py); just go there and `ctrl+f` the method's name.

For example, if you're interested in getting the user's feed, as they would see it in the app, you can use `api.GetHomeTimeline()`.

That's it for now!
