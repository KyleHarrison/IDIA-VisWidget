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
        index: 1,
        _data : [],
        _sample : [],
        _rawdata : []
    })
});


// Custom View. Renders the widget model.
var HelloView = widgets.DOMWidgetView.extend({
    render: function () {
        _data = this.model.get('_data');
        dataset = new vis.DataSet();
        var sqrt = Math.sqrt;
        var pow = Math.pow;

        this.value_changed();
        this.model.on('change:_sample', this.value_changed, this);


        // create the animation data
        for (var i = 0; i < _data.length; i++) {
            var sample = _data[i];
            var style = sqrt(pow(sample[0], 2) + pow(sample[1], 2) + pow(sample[2], 2));
            dataset.add({ x: sample[0], y: sample[1], z: sample[2], style: style, id: i });
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
        graph = new vis.Graph3d(this.el, dataset, options);

    },
    value_changed: function () {
        var sample = this.model.get('_sample');
        console.log(sample);
    }

});


module.exports = {
    HelloModel : HelloModel,
    HelloView : HelloView
};
