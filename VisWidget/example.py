import ipywidgets as widgets
from traitlets import Unicode, Int, List
from traitlets import observe
from ipywidgets import interact, interactive, fixed, interact_manual
import ipywidgets as widgets
from ipywidgets import Output

import matplotlib.pyplot as plt
import numpy as np
from IPython.display import display, clear_output


@widgets.register
class HelloWorld(widgets.DOMWidget):
    def __init__(self, data, rawdata):
        super().__init__()
        if data is not None:
            self._data = data.tolist()
        if rawdata is not None:
            self._rawdata = rawdata.tolist()
            self._sample = self._rawdata[0]
        
        vbox=widgets.HBox(children=(self, self.out))
        display(vbox)

    _view_name = Unicode('HelloView').tag(sync=True)
    _model_name = Unicode('HelloModel').tag(sync=True)
    _view_module = Unicode('VisWidget').tag(sync=True)
    _model_module = Unicode('VisWidget').tag(sync=True)
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)
    index = Int(0).tag(sync=True)
    _data = List([]).tag(sync=True)
    _rawdata = List([]).tag(sync=True)
    _sample = List([]).tag(sync=True)

    plt.ioff()
    ax=plt.gca()
    out=widgets.Output()
    

    @observe('index')
    def val_changed(self, change):
        self.plot(change['new'])
        self._sample = self._rawdata[(change['new'])]

    def plot(self, index):
        self.ax.clear()
        self.ax.plot(self._rawdata[index])
        with self.out:
            clear_output(wait=True)
            display(self.ax.figure)

        #out = widgets.Output()
        #self.ax.clear()
        #self.ax.plot(self._rawdata[index])
        #with out:
        #    clear_output(wait=True)
        #    display(self.ax.figure)


