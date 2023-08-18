import json
import os
import glob
from src.injector import injector
import logging
from string import Template



supported_format = ["json"]

class Translator:
    def __init__(self, language_folder="./lang", default_locale="en") -> None:
        self.data= {}
        self.locale = default_locale
        self.logger = injector.get(logging.Logger)


        for filename in glob.glob(os.path.join(language_folder, '*.json')):
            loc = os.path.splitext(os.path.basename(filename))[0]
            with open(filename, encoding="utf-8", mode="r") as f:
                self.data[loc] = json.load(f)

    def set_locale(self, locale):
        if locale in self.data:
            self.locale = locale
        else:
            self.logger.warn(f"Unvalid locale: {locale}, fallback to default locale: {self.locale}")

    def translate(self, key, **kwargs): 
        if key in self.data[self.locale]:
            text = self.data[self.locale][key]
            return Template(text).safe_substitute(**kwargs)
        else:
            self.logger.warn(f"The key '{key}' does not match any text. Defaults text to key")
            return key


