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
        index : 1
    })
});


// Custom View. Renders the widget model.
var HelloView = widgets.DOMWidgetView.extend({
    render: function () {
        var model = this.model;
        var that = this;

        var data = null;
        var graph = null;
        data = new vis.DataSet();
        var sqrt = Math.sqrt;
        var pow = Math.pow;
        var random = Math.random;


        // create the animation data
        var imax = 30;
        for (var i = 0; i < imax; i++) {
            var x = pow(random(), 2);
            var y = pow(random(), 2);
            var z = pow(random(), 2);
            var style = sqrt(pow(x, 2) + pow(y, 2) + pow(z, 2));
            data.add({ x: x, y: y, z: z, style: style, id: i });
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
            onclick: (point) => {
                console.log(point);
                this.model.set('index', point.id);
                this.touch();
            },
            legendLabel: 'distance',
            cameraPosition: {
                horizontal: -0.35,
                vertical: 0.22,
                distance: 1.8
            },
            tooltip: function (point) {
                //that.model.set('index', point.data.id);
                //that.touch();
                return "<b>ID:</b> " + point.data.id + "<br>"
                    + "<b>Label:</b> " + point.data.style.toFixed(3) + "<br>"
                    + "<b>X:</b> " + point.x.toFixed(3) + " <b>Y: </b>" + point.y.toFixed(3) + " <b>Z: </b>" + point.z.toFixed(3);
            },
            tooltipStyle: {
                content: {
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '10px',
                    borderRadius: '10px'
                },
                line: {
                    height: '20px',
                    width: '0',
                    borderLeft: '1px hidden #4d4d4d'
                },
                dot: {
                    border: '0px hidden rgba(0, 0, 0, 0.5)'
                }
            }
        }
        graph = new vis.Graph3d(this.el, data, options);

    },

});


module.exports = {
    HelloModel : HelloModel,
    HelloView : HelloView
};
