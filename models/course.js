const Document = require('./Document');

const whitelist = [
  'description', // includes terms taught, course number
  'links', // org, info (link to course page)
  'organization',
  'role',
  'title',
];

const Course = class Course extends Document {
  constructor(data) {

    // empty object for copying valid data to
    const course = {};

    // required attributes
    const required = [
      'description',
      'organization',
      'role',
      'title',
    ];

    // check for required attributes
    required.forEach(attr => {
      if (!(attr in data)) throw new Error(`The "${attr}" attribute is required.`);
    });

    // copy whitelisted attributes
    Course.whitelist.forEach(attr => {
      if (attr in data) course[attr] = data[attr];
    });

    // set "type" attribute
    course.type = 'course';

    // instantiate the new Document object
    super(course, whitelist);

  }

  // whitelist of allowable properties in the Reference data
  static get whitelist() {
    return Document.whitelist.concat(whitelist);
  }

};

module.exports = Course;
