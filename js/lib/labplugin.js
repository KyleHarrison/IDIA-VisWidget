var VisWidget = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'VisWidget',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'VisWidget',
          version: VisWidget.version,
          exports: VisWidget
      });
  },
  autoStart: true
};

