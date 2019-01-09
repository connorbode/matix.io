---
title: 'Shopify: Delete Multiple Items through the API'
banner_lg: banner-lg.jpg
banner_sm: banner-sm.jpg
date: 2019-01-09 12:04:57
tags:
seo_description:
---


## How can I delete multiple objects at once in Shopify?

If you're like us, you've run into trouble trying to run a batch of delete operations on the Shopify API.  The Shopify API allows you to perform 2 calls per second.  For retrieving objects, you can retrieve a batch size of 250 objects at once.  That allows you to fetch up 500 objects per second, which is enough for most applications.

For most developers, the first instinct is to use Shopify's REST API to delete an item. For example, you can delete a product with the following request: 

```
DELETE /admin/products/<product_id>.json
```

**This restricts you to deleting 2 items per second**.  It's just not enough for most people.

## GraphQL: A Faster Option for Bulk Delete

Shopify offers a GraphQL endpoint, `/admin/api/graphql.json`.  GraphQL is the emerging successor to REST APIs.  Using the GraphQL API, we are able to send a batch of up to 100 operations to Shopify in a single HTTP request.  That means you can delete 100 objects in a single HTTP request.

There are still rate limits for the GraphQL operations.  Based on our calcuations, you can perform 10 delete operations per second, giving you 5x the performance of the REST API.  You can view the rate limiting details [in Shopify's documentation](https://help.shopify.com/en/api/graphql-admin-api/call-limit#single-query-limit).


## How can I delete an object in Shopify using GraphQL?

All GraphQL requests are `POST /admin/api/graphql.json`.  You'll need to include the following headers:

```
Content-Type: application/graphql
Accept: application/json
X-Shopify-Access-Token: <access_token>
```

The `<access_token>` is your API password if you're using a private app like us.  If you're using OAuth, you'll need to check the documentation for how to retrieve your `<access_token>`. 

To delete multiple metafields, like we needed to, here's an example request body:

```graphql
mutation {
    first: metafieldDelete(input: {
		id: "gid://shopify/Metafield/<first_metafield_id>"
    }) {
    	userErrors { field message } deletedId 
    }
    
    second: metafieldDelete(input: {
		id: "gid://shopify/Metafield/<second_metafield_id>"
    }) { 
    	userErrors {field message } deletedId 
    }
}
```

This is going to call the `metafieldDelete` mutation twice, using `<first_metafield_id>` and `<second_metafield_id>`.


For more information (including a list of all available mutations), [read the GraphQL documentation on Shopify's website](https://help.shopify.com/en/api/graphql-admin-api)