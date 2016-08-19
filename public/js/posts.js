/* eslint-env browser */
/* global ghost */

(function posts() {

  const ghostOptions = {
    limit: 5,
    fields: 'title,slug,image,updated_at,html',
  };

  const renderPosts = posts => posts.forEach(post => {

    const postLink = `http://blog.danielhieber.com/${post.slug}`;
    const d = new Date(post.updated_at);
    const dateString = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const img = post.image ? `<img src=${post.image}>` : '';

    // get a preview of the post's text content
    const p = document.createElement('p');
    p.innerHTML = post.html;
    const preview = p.textContent.substring(0, 240);

    const html = `
      <li>
        <a href=${postLink}>
          ${img}
          <div>
            <h2>${post.title}</h2>
            <time datetime=${post.updated_at}>${dateString}</time>
            <p>${preview} ... <span>(read more)<span></p>
          </div>
        </a>
      </li>
    `;

    wrapper.insertAdjacentHTML('beforeend', html);

  });

  const wrapper = document.querySelector('#posts ol');

  ghost.init({
    clientId: 'ghost-frontend',
    clientSecret: 'c7441a524886',
  });

  fetch(ghost.url.api('posts', ghostOptions))
  .then(res => res.json().then(data => renderPosts(data.posts)))
  .catch(() => renderPosts([]));

}());
