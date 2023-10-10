let Config = {
    PERSIST_SECRET_KEY: "ReactNativeBoilerPlate",
    ENVIRONMENT: "DEVELOPMENT",
    ENVIRONMENTS: {
        LOCAL: {
            API_URL: "https://3133-209-150-150-42.ngrok.io/api", // Your backend API url goes here.
        },
        DEVELOPMENT: {
            API_URL: "https://www.whitetail.tk/api",
        },
        PRODUCTION: {
            API_URL: "https://www.whitetail.tk/api",
        }
    }
};

Config.env = () => {
    return Config.ENVIRONMENTS[Config.ENVIRONMENT];
};

export default Config;
