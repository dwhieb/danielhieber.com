/* global ghost */

/* eslint-disable
  max-statements
*/

(() => {

  // The wrapper element where the recent posts will be displayed
  const wrapper = document.querySelector('#posts ol');

  /**
   * Renders a generic message instead of recent posts
   * Used when the Ghost API fails or throws an error
   * @return {undefined} No return
   */
  const renderErrorFallback = () => {
    wrapper.innerHTML = `
    <p><a class=error-fallback href=http://blog.danielhieber.com/>Check out my blog for recent posts!</a></p>
    `;
  };

  // Displays the 5 most recent posts from the Ghost API
  /**
   * Displays the 5 most recent posts from the Ghost API
   * @param  {Array} posts An array of posts to display
   * @return {undefined} No return
   */
  const renderPosts = posts => {

    // If there are no recent posts, it's probably an error - render the fallback
    if (posts.length === 0) {

      renderErrorFallback();

      // Otherwise render each post
    } else {

      posts.forEach(post => {

        // template variables
        const postLink = `http://blog.danielhieber.com/${ post.slug }`;
        const d = new Date(post.updated_at);
        const dateString = `${ d.getFullYear() }-${ d.getMonth() + 1 }-${ d.getDate() }`;

        let imgLink = '';

        if (post.image) {
          imgLink = post.image.includes('//') ? post.image : `//blog.danielhieber.com${ post.image }`;
        }

        // get a preview of the post's text content
        const p = document.createElement('p');
        const previewLength = 240;
        const img = imgLink ? `<img src=${ imgLink }>` : '';

        p.innerHTML = post.html;
        const preview = p.textContent.substring(0, previewLength);

        // the template for each item in the recent posts list
        const html = `
          <li>
            <a href=${ postLink }>
              ${ img }
              <div>
                <h2>${ post.title }</h2>
                <time datetime=${ post.updated_at }>${ dateString }</time>
                <p>${ preview } ... <span>(read more)<span></p>
              </div>
            </a>
          </li>
        `;

        wrapper.insertAdjacentHTML('beforeend', html);
      });
    }
  };

  if (ghost) {

    // initialize the Ghost SDK
    ghost.init({
      clientId: 'ghost-frontend',
      clientSecret: '5abb38b97759'
    });

    // parameters to send to the Ghost API
    const ghostOptions = {
      limit: 5,
      fields: 'title,slug,image,updated_at,html'
    };

    // construct the URL to fetch recent posts
    const recentPostsUrl = ghost.url.api('posts', ghostOptions);

    // call the Ghost API, convert and render the result
    fetch(recentPostsUrl).then(res => {
      if (res.ok) {
        res.json().then(data => renderPosts(data.posts));
      } else {
        renderErrorFallback();
      }
    }).catch(renderErrorFallback);
  } else {
    // display the error fallback if the Ghost API is unavailable
    renderErrorFallback();
  }
})();