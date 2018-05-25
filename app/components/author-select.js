import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({

  tagName: 'select',
  classNames: ['form-control'],
  authors: null,
  book: null,

  change(event) {
    const selectedAuthorId = event.target.value;
    //const selectedAuthor = this.get('authors').find((record) => record.id === selectedAuthorId);
    const selectedAuthor = get(this, 'authors').find((record) => record.id === selectedAuthorId);

    // this.sendAction('action', selectedAuthor, this.get('book'));
    get(this, 'press_author')(selectedAuthor, this.get('book'));
  }
});
