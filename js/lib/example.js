var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');
var vis = require('vis');

// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
var HelloModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'HelloModel',
        _view_name : 'HelloView',
        _model_module : 'VisWidget',
        _view_module : 'VisWidget',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        value : 'World'
    })
});


// Custom View. Renders the widget model.
var HelloView = widgets.DOMWidgetView.extend({
    render: function () {
        console.log("Creating html");
        // this.value_changed();
        // this.model.on('change:value', this.value_changed, this);

        var data = null;
        var graph = null;
        // Called when the Visualization API is loaded.
            // create the data table.
            data = new vis.DataSet();
            // create some shortcuts to math functions
            var sqrt = Math.sqrt;
            var pow = Math.pow;
            var random = Math.random;
            // create the animation data
            var imax = 100;
            for (var i = 0; i < imax; i++) {
                var x = pow(random(), 2);
                var y = pow(random(), 2);
                var z = pow(random(), 2);
                var style = (i % 2 == 0) ? sqrt(pow(x, 2) + pow(y, 2) + pow(z, 2)) : "#00ffff";
                data.add({ x: x, y: y, z: z, style: style });
            }
            // specify options
            var options = {
                width: '600px',
                height: '600px',
                style: 'dot-color',
                showPerspective: true,
                showGrid: true,
                keepAspectRatio: true,
                verticalRatio: 1.0,
                legendLabel: 'distance',
                cameraPosition: {
                    horizontal: -0.35,
                    vertical: 0.22,
                    distance: 1.8
                }
            }
            graph = new vis.Graph3d(this.el, data, options);

    },

    value_changed: function() {
       // this.el.textContent = this.model.get('value');
    }
});


module.exports = {
    HelloModel : HelloModel,
    HelloView : HelloView
};
