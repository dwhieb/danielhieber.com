/* global ghost */

/* eslint-disable
  func-names,
  max-nested-callbacks,
  prefer-arrow-callback
*/

describe('Recent Posts', function () {

  it('fetches recent posts', function (done) {

    expect(ghost).toBeDefined();

    ghost.init({
      clientId: 'ghost-frontend',
      clientSecret: 'c7441a524886',
    });

    const ghostOptions = {
      limit: 5,
      fields: 'title,slug,image,updated_at,html',
    };

    const url = ghost.url.api('posts', ghostOptions);

    fetch(url, { mode: 'no-cors' })
    .then(res => {
      if (res.ok) {
        res.json().then(data => {
          expect(Array.isArray(data)).toBe(true);
          expect(0 < data.length <= 5).toBe(true);
          const post = data[0];
          expect('title' in post).toBe(true);
          expect('slug' in post).toBe(true);
          expect('image' in post).toBe(true);
          expect('updated_at' in post).toBe(true);
          expect('html' in post).toBe(true);
          done();
        });
      } else {
        fail('Request for posts unsuccessful.');
        done();
      }
    })
    .catch(err => {
      fail(JSON.stringify(err, null, 2));
      done();
    });

  });

});
