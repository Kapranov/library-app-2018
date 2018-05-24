import Component from '@ember/component';
import { get } from '@ember/object';

export default Component.extend({

  buttonLabel: 'Save',

  actions: {

    buttonClicked(param) {
      // this.sendAction('action', param);
      get(this, 'press_save')(param);
    }

  }
});
