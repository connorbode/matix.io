---
title: Django i18n Translation Cheatsheet
tags: 'django, translation'
banner_lg: splash-lg.png
banner_sm: splash-sm.png
seo_description: A quick tutorial on how to implement basic translation in Django
date: 2019-12-11 07:33:30
---


This tutorial is going to cover a basic internationalization (translation) setup for Django, including the following three points:

1. Setting up a language switcher
2. Translating static content (i.e. hardcoded text in your templates, or in your Python code)
3. Translating user content (i.e. text in your models)

Let's get started!


## Setting up a language switcher

First, let's make sure your `settings.py` has the appropriate settings enabled.  Here's what's important:

```python
# enable translations
USE_I18N = True

# define your languages
LANGUAGES = [

  # the format here is [language_code, language_text].
  # the idea is that you use the language_code to 
  # match what language is in use, and language_text
  # to display to the user.  
  ['en', 'English'],
  ['fr', 'Français']
]

# set your default language.
LANGUAGE = LANGUAGES[0][0]

# install the LocaleMiddleware in between SessionMiddleware and CommonMiddleware
MIDDLEWARE = [
  ...
  'django.contrib.sessions.middleware.SessionMiddleware',
  'django.middleware.locale.LocaleMiddleware',
  'django.middleware.common.CommonMiddleware',
  ...
]

```

Next, let's mount the i18n urls in your `urls.py`:

```python
urlpatterns = [
  path('i18n/', include('django.conf.urls.i18n')),
]
```

Next, you'll want to edit your main template to add in the language switcher. 

```html
{% load i18n %}
  {% csrf_token %}
  {% get_current_language as LANGUAGE_CODE %}
  {% get_available_languages as LANGUAGES %}
  {% for language in LANGUAGES %}
    {% if language.0 != LANGUAGE_CODE %}
    <form action="{% url 'set_language' %}" method="post">
      {{ csrf_token }}
      <input type="hidden" name="language" value="{{ language.0 }}">
      <button type="submit">{{ language.1 }}</button>
    {% endif %}
  {% endfor %}
</form>
```

You'll probably want to use some CSS to style those buttons to look nicer.


## Translating static text in Django (in your templates or your code)

Now let's translate the static text in our application.  Static text exists in two places: in Django templates and in our Python code.  This text gets translated with the following procedure:

i) We mark the text as translatable
ii) We extract the translatable text from Django into standard translation files called [PO files](https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html)
iii) We use a PO file editor to translate our PO files into different languages
iv) We load the translated files back into Django

Steps 2-4 can be repeated as necessary, when you update text in your templates or code.


### i) Marking text as translatable

If you're marking text in a Django template, all you need to do is: 

```html
{% load i18n %}
{% trans 'text you want to translate' %}
```

If you're in Python, do the following:

```python
from django.utils.translation import gettext_lazy as _

translated_string = _('text you want to translate')
```


### ii) Extracting translatable text from Django

You'll need to set `LOCALE_PATHS` in your `settings.py` first so that Django knows where to look for locale files.

I usually set it as the following:

```python
LOCALE_PATHS = [
  os.path.join(BASE_DIR, 'locales')
]
```

Now, every time you want to __add a new language__, you need to run:

```bash
python manage.py makemessages -l fr
# replacing fr with your language_code, which should correspond 
# to a language_code in LANGUAGES in settings.py
```

If you've updated the text in your application that needs to be translated, you need to run:

```bash
python manage.py makemessages
# this will update all of your existing language translations
```

### iii) Editing the translation files

You'll need to edit the translation files that were generated in the previous step using a PO editor.  My favourite is [POEDIT](https://poedit.net/) (cross-platform and free).

In POEDIT, click _Edit a Translation_ to and open the `.po` file Django generated.  Since my main `LOCALE_PATHS` is `locales` and I generated a translation for `fr`, mine is located at `locales/fr/LC_MESSAGES/django.po`.  You can use the tool to fill in a translation for all the text.

After you're done, save the file.

When you've updated the text in your application and you're translating again, just edit the same file.  All of your existing translations will still be there.


### iv) Loading the translation files back into Django

Finally, we need to compile the `.po` translations we just edited into a more efficient format for Django to use.

This is quick and easy: `python manage.py compilemessages`.


## Translating Django Models (user content)

This isn't supported by the Django base install, so we need a package.  [There are many packages that solve this problem](https://djangopackages.org/grids/g/model-translation/) but the one I use is [django-modeltranslation](https://django-modeltranslation.readthedocs.io/en/latest/index.html).

Here's the procedure:


### i) Installation

First install the package

```bash
pip install django-modeltranslation
```

Then fix up your `settings.py`:

```python
# make sure modeltranslation is above django.contrib.admin

INSTALLED_APPS = [
  ...
  'modeltranslation',
  ...
  'django.contrib.admin',
  ...
]
```


### ii) Translating Models

Create a file called `translation.py` and use it as follows:

```python
from modeltranslation import translator
from . import models


@translator.register(models.MyModel)
class MyModelTranslation(translator.TranslationOptions):
  fields = ('any_field_on_MyModel',)
```

Then in `admin.py`:

```python
from django.contrib import admin
from modeltranslation.admin import TranslationAdmin
from . import models


@admin.register(models.MyModel)
class MyModelAdmin(TranslationAdmin):
  fields = ('any_field_on_MyModel',)
```

Now you'll have the translation fields show up in Django Admin.  If you had previously entered data for the model before adding the translations, you might want to run `python manage.py update_translation_fields` to make sure the data is properly saved for your new translations.

That's it.  Now you can use the models as you normally would, but there's more information on [accessing the translations here](https://django-modeltranslation.readthedocs.io/en/latest/usage.html).  If you need to edit those model translations from somewhere other than Django Admin, see the [documentation here](https://django-modeltranslation.readthedocs.io/en/latest/forms.html).
