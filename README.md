# escRainbow



## How to clone this repo and set up virtual environment for python and install flask
* make sure you have installed python (recommend 3.5/3.6 version)
* make sure you have installed pip (by typing ```pip freeze```)
* use pip to install virtual environment package
```pip install virtualenv```

```bash
git clone https://github.com/xmliszt/escRainbow.git
cd escRainbow
virtualenv venv
./venv/Scripts/activate
# or source ./venv/bin/activate  [for MacOS]
# you will see (venv) in front of your command line
# means you have activated the virtual environment successfully
pip install -r requirements.txt # this will install flask
```

* to deactivate the virtual environment
```bash
deactivate
```