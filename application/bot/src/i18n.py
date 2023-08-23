import json
import os
import glob
from src.injector import injector
import logging
from string import Template
import pytz



#valid timezones can be found here
#https://gist.github.com/heyalexej/8bf688fd67d7199be4a1682b3eec7568 
lang_timezone_map = {
    "no": "Europe/Oslo",
    "en": "Europe/London"
}

supported_format = ["json"]


class Translator:
    def __init__(self, language_folder="./lang", default_locale="en") -> None:
        self.data = {}
        self.locale = default_locale
        self.logger: logging.Logger = injector.get(logging.Logger)
        self.timezone = lang_timezone_map[self.locale]


        for filename in glob.glob(os.path.join(language_folder, '*.json')):
            loc = os.path.splitext(os.path.basename(filename))[0]
            with open(filename, encoding="utf-8", mode="r") as f:
                self.data[loc] = json.load(f)

    def set_locale(self, locale):
        if locale in self.data and locale in lang_timezone_map:
            self.locale = locale
            self.timezone = lang_timezone_map[locale]
        else:
            self.logger.warn(f"Unvalid locale: {locale}, fallback to default locale: {self.locale}")

    def translate(self, key, **kwargs): 
        if key in self.data[self.locale]:
            text = self.data[self.locale][key]
            return Template(text).safe_substitute(**kwargs)
        else:
            self.logger.warn(f"The key '{key}' does not match any text. Defaults text to key")
            return key

    def format_timestamp(self, timestamp):
         return pytz.utc.localize(timestamp.replace(tzinfo=None), is_dst=None).astimezone(self.timezone)
       
       


