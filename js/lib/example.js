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
    })
});



// Custom View. Renders the widget model.
var VisWidgetView = widgets.DOMWidgetView.extend({
    render: function () {
        _data = this.model.get('_data');
        _sample = this.model.get('_sample');
        var sqrt = Math.sqrt;
        var pow = Math.pow;
        this.model.on('change:_sample', this.value_changed, this);
        this_model = this.model;
        that = this;
        var x = [];
        for (var i = 0; i < _sample.length; i++) {
            x.push(i);
        }

        var hsv2rgb = function (H, S, V) {
            var R, G, B, C, Hi, X;

            C = V * S;
            Hi = Math.floor(H / 60);  // hi = 0,1,2,3,4,5
            X = C * (1 - Math.abs(((H / 60) % 2) - 1));

            switch (Hi) {
                case 0: R = C; G = X; B = 0; break;
                case 1: R = X; G = C; B = 0; break;
                case 2: R = 0; G = C; B = X; break;
                case 3: R = 0; G = X; B = C; break;
                case 4: R = X; G = 0; B = C; break;
                case 5: R = C; G = 0; B = X; break;

                default: R = 0; G = 0; B = 0; break;

            }

            return 'rgb(' + parseInt(R * 255) + ',' + parseInt(G * 255) + ',' + parseInt(B * 255) + ')';
        };
        


        sample_plot = {
            x: x,
            y: _sample,
            
            type: 'line'
        };

        points = {
            xaxis: 'x2',
            yaxis: 'y2',
            text: [],
            x: [],
            y: [],
            z: [],
            name: [],
            mode: 'markers',
            hoverinfo: 'text',
            marker: {
                size: 12,
                color: [],
                line: {
                    color: [],
                    width: 0.5
                },
                opacity: 1
            },
            type: 'scatter3d'
        };
        var distance_range = []
        // create the scatter plot data dict
        for (var i = 0; i < _data.length; i++) {
            distance_range.push(sqrt(pow(_data[i][0], 2) + pow(_data[i][1], 2) + pow(_data[i][2], 2)));

            datapoint = _data[i];

            points.name.push(i);
            points.x.push(datapoint[0]);
            points.y.push(datapoint[1]);
            points.z.push(datapoint[2]);
            
            points.text.push("<br> <b>ID:</b> " + i + " <br><b>X:</b> " + datapoint[0].toFixed(2) + "    <b>Y:</b> " + datapoint[1].toFixed(2) + "    <b>Z:</b> " + datapoint[2].toFixed(2));
        }

        min_dist = Math.min(...distance_range);
        max_dist = Math.max(...distance_range);

        x_max = Math.max(...points.x);
        y_max = Math.max(...points.y);
        z_max = Math.max(...points.z);
        
        x_min = Math.min(...points.x);
        y_min = Math.min(...points.y);
        z_min = Math.min(...points.z);

        //set the scatter plot data points colours 
        for (var i = 0; i < _data.length; i++) {

            var hue = (1 - (distance_range[i] - min_dist) * 1 / (max_dist - min_dist)) * 240;

            console.log(hue);
            color = hsv2rgb(hue, 1, 1);
            points.marker.color.push(color)
            points.marker.line.color.push(color)
        }
        console.log(points.marker.color);

        //for (var i = 0; i < _data.length; i++) {
        //    var style = sqrt(pow(_data[i][0], 2) + pow(_data[i][1], 2) + pow(_data[i][2], 2));
        //    points.marker.color.push(i);
        //}



        dataSet = [points, sample_plot];

        graph3d = document.createElement("div");

        this.el.appendChild(graph3d);


        layout = {
            autosize: false,
            //width: 1000,
           // height: 700,
            scene: {
                domain: {
                    x: [0, 1],
                    y: [0.3, 1]
                }
            },
            xaxis: { domain: [0,1] },
            yaxis: { domain: [0,0.3] },
            margin: {
                l: 20,
                r: 0,
                b: 35,
                t: 0,
                pad: 0
            },
            hoverlabel: {
                bgcolor: 'white',
                font: { color: 'black' }
            },
        };
        Plotly.newPlot(graph3d, dataSet, layout);

        graph3d.on('plotly_click', function (data) {
            console.log(data);
            //On plot click triggers for subplot. 2D plot click triggers an event, 3D does not
            if (data.event == null) {
                this_model.set('index', data.points[0].pointNumber);
                that.touch();
            }
            
        });
    },
    value_changed: function () {
        sample_plot.y = this_model.get('_sample');
        Plotly.react(graph3d, dataSet, layout);
    },

   

});



module.exports = {
    VisWidgetModel: VisWidgetModel,
    VisWidgetView: VisWidgetView
};
