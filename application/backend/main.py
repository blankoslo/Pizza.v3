from app.application import create_app

config = {
    "base": "app.config.Base",
    "test": "app.config.Test",
    "production": "app.config.Production"
}

app = create_app(config)

if __name__ == "__main__":
    app.run()
