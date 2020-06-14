---
title: Fixed-timezone dates and datetimes in Django
tags: 'django, translation'
banner_lg: splash-lg.png
banner_sm: splash-sm.png
seo_description: Learn how to collect and use fixed-timezone dates in Django, while timezone functionality is on.
date: 2019-12-11 07:33:30
---

Timezone logic is the worst.

Here's the scenario I just dealt with:

- I have `USE_TZ = True`, so all datetimes we are dealing with are timezone-aware.
- I'm using Postgres as a database backend, so at the database level, datetimes are always converted to and stored in UTC.
- I have a datetime that I want to store in a fixed timezone (not necessarily the user's timezone).

Imagine the following:

```python
from django.db import models
from django import forms

class Event(models.Model):
    starts_at = models.DateTimeField()

class EventForm(forms.ModelForm):
    class Meta:
        model = Event
        fields = ['starts_at']
```

The `starts_at` datetime is so extremely important, and because of global timezones, it can be easy to introduce bugs that are a nightmare to resolve.

Remember that because we have `USE_TZ = True`, `starts_at` will always want to be assigned a timezone-aware datetime, and when it is saved to the database it will be converted to UTC.

## What timezone is `starts_at` saved in?

The timezone applied to `starts_at` depends on what timezone is active in Django. You can activate a timezone as follows:

```python
from django.utils import timezone
import pytz

tz = pytz.timezone('America/Montreal')
timezone.activate(tz)
```

If you've activated a timezone, all dates that are input are collected in that timezone, all dates displayed are converted to that timezone. 

If you haven't activated a timezone, Django uses the default timezone, defined in `TIME_ZONE` in your `settings.py`.

## Why doesn't this work?

Let's say the user is in Montreal, but they want to create an event in London. They want to create an event that starts at 9pm London time. If the user enters 9pm into the form, the event will not start at 9pm in London, it will start at 9pm in Montreal. So by default, the user would need to perform time conversions in their head; it's not the best UX.

## Ok, so what can we do?

First, we need to store the timezone of the event with the event. There's a nice pip module called [django-timezone-field](https://pypi.org/project/django-timezone-field/) that will provide you with some convenience methods, or you can just store the timezone as a CharField using `pytz.all_timezones` as choices.

We'll use `django-timezone-field` to make things simpler.

```python
from django.db import models
from timezone_field import TimeZoneField

class Event(models.Model):
    starts_at = models.DateTimeField()
    timezone = TimeZoneField()
```

## Creating Events

Creating is pretty simple, luckily. We just need to modify the `.clean` method on the create form:

```python
from django import forms


class CreateEventForm(forms.ModelForm):
    class Meta:
        model = Event
        fields = ['starts_at', 'timezone']

    def clean(self, *args, **kwargs):
        cleaned_data = super().clean(*args, **kwargs)
        timezone = cleaned_data['timezone']
        cleaned_data['starts_at'] = tz.localize(cleaned_data['starts_at'].replace(tzinfo=None))
        self.instance.starts_at = cleaned_data['starts_at']
        return cleaned_data
```

## Editing Events

For editing, we need to create a custom `DateTimeField` for our form because Django's builtin DateTimeField performs timezone conversions to the activated timezone automatically, so we can't use it.

Instead, we want to be able to define the timezone that is used manually.

The following code was adapted from [the code for `django.forms.DateTimeField`](https://github.com/django/django/blob/master/django/forms/fields.py#L446).

```python
from django import forms
from django.utils import formats
from django.utils.translation import ugettext_lazy as _
from django.core.exceptions import ValidationError
import datetime


class DateTimeFormatsIterator:
    def __iter__(self):
        yield from formats.get_format('DATETIME_INPUT_FORMATS')
        yield from formats.get_format('DATE_INPUT_FORMATS')


class FixedTimezoneDateTimeField(forms.Field):
    widget = forms.widgets.DateTimeInput
    input_formats = DateTimeFormatsIterator()
    default_error_messages = {
        'invalid': _('Enter a valid date/time.')
    }

    def __init__(self, *, input_formats=None, **kwargs):
        super().__init__(**kwargs)
        if input_formats is not None:
            self.input_formats = input_formats
    
    def strptime(self, value, format):
        return datetime.datetime.strptime(value, format)
    
    def prepare_value(self, value):
        output = value.astimezone(self.timezone).replace(tzinfo=None)
        return output
    
    def to_python(self, value):
        value = value.strip()
        tz_unaware = None
        for format in self.input_formats:
            try:
                tz_unaware = self.strptime(value, format)
                break
            except (ValueError, TypeError):
                continue
        if tz_unaware is None:
            raise ValidationError(self.error_messages['invalid'], code='invalid')
        return self.timezone.localize(tz_unaware)
```

Now that we have a DateTimeField that will use it's `self.timezone` value to save & display timezones.

```python
class EditEventForm(forms.ModelForm):
    starts_at = FixedTimezoneDateTimeField()
    
    class Meta:
        model = Event
        fields = ['starts_at', 'timezone']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['starts_at'].timezone = self.instance.timezone
```