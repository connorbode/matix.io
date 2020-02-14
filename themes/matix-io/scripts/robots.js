const fs = require('fs')

hexo.extend.generator.register('robots', function (locals) {
  const posts = [].concat(locals.posts.toArray(), locals.pages.toArray())
    .filter(post => {
      return !!post.hide
    })
  const data = 'User-agent: *\n' + posts.map(function (post) {
    return `Disallow: ${post.path}\n`
  });

  return {
    path: 'robots.txt',
    data
  }
});
