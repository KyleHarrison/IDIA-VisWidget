IDIA-VisWidget
===============================

A Custom Jupyter Widget Library

Installation
------------

To install use pip:

    $ pip install VisWidget
    $ jupyter nbextension enable --py --sys-prefix VisWidget


For a development installation (requires npm),

    $ git clone https://github.com/KyleHarrison/IDIA-VisWidget.git
    $ cd IDIA-VisWidget
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix VisWidget
    $ jupyter nbextension enable --py --sys-prefix VisWidget
