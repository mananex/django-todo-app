# Very simple and minimalistic ToDo web-application

This is my first web application written in the Django framework. The interface is simple. In addition, I used pure HTML, CSS and JS.

### Installation
Before installing dependences, download and install Python 3.x.x. [from official site](https://www.python.org/). I'm using `Python 3.11.7`. **Installation instructions will be for Windows OS only**.

Launch command line (cmd) and start executing the following commands.

#### 1. Create a virtual environment, go there and clone this repository.
```
python -m venv myToDoAppVenv
cd myToDoAppVenv
git clone https://github.com/mananex/django-todo-app.git
```
#### 2. Go into the repository and run the cmd.bat file
```
cd django-todo-app
cmd.bat
```
The `cmd.bat` file launches a virtual environment and nothing more.
#### 3. Download Python packages
```
pip install -r requirements.txt
```
#### 4. Configure the Django project
```
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic
```
**Note:** if you want to access the Django admin panel, you need to create a superuser using `python manage.py createsuperuser` command.
#### 5. Run the server
```
python manage.py runserver
```
After running the project, you can access the web page at `http://localhost:8000`.
The path to the admin panel is `/admin`, the path to the API overview page is `/api`.

**Note:** every time you want to run the web application you can just double click `cmd.bat` file and run the `python manage.py runserver` command.
