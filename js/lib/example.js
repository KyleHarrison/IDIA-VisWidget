var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');
var Plotly = require('plotly.js');

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
var VisWidgetModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name: 'VisWidgetModel',
        _view_name: 'VisWidgetView',
        _model_module: 'VisWidget',
        _view_module: 'VisWidget',
        _model_module_version: '0.1.0',
        _view_module_version: '0.1.0',
        index: 1,
        _data: [],
        _sample: [],
        _rawdata: []
    })
});


// Custom View. Renders the widget model.
var VisWidgetView = widgets.DOMWidgetView.extend({
    render: function () {
        _data = this.model.get('_data');
        var dataset3d = new vis.DataSet();
        var sqrt = Math.sqrt;
        var pow = Math.pow;
        this.value = 1;
        var random = Math.random;
        var data_len = _data.length;
        var x = [];
        var y = [];
        var z = [];

        var points = {
            x: [],
            y: [],
            z: [],
            mode: 'markers',
            marker: {
                size: 12,
                color: [],
                line: {
                    color: [],
                    width: 0.5
                },
                opacity: 0.8
            },
            type: 'scatter3d'
        };

        // create the animation data
        for (var i = 0; i < _data.length; i++) {
            points.x.push(_data[i][0]);
            points.y.push(_data[i][1]);
            points.z.push(_data[i][2]);
            var style = sqrt(pow(_data[i][0], 2) + pow(_data[i][1], 2) + pow(_data[i][2], 2));
            points.marker.color.push(style);
            points.marker.line.color.push(style);
        }
        var dataSet = [points];

        graph3d = document.createElement("div");
        this.el.appendChild(graph3d);

        console.log(dataSet);
        var layout = {
            autosize: true,
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0
            }
        };
        Plotly.newPlot(graph3d, dataSet, layout);

    },

});


module.exports = {
    VisWidgetModel: VisWidgetModel,
    VisWidgetView: VisWidgetView
};
