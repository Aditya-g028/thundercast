from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from risk_engine import calculate_risk

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "THUNDERCAST Backend is running!",
        "status": "online"
    }


from risk_engine import calculate_risk


@app.get("/forecast")
def get_forecast():

    weather_inputs = [
        {
            "radar": 30,
            "satellite": 45,
            "lightning": 20,
            "humidity": 65,
            "temperature": 28
        },
        {
            "radar": 35,
            "satellite": 55,
            "lightning": 30,
            "humidity": 70,
            "temperature": 29
        },
        {
            "radar": 43,
            "satellite": 65,
            "lightning": 45,
            "humidity": 75,
            "temperature": 30
        },
        {
            "radar": 50,
            "satellite": 75,
            "lightning": 60,
            "humidity": 80,
            "temperature": 31
        },
        {
            "radar": 45,
            "satellite": 68,
            "lightning": 50,
            "humidity": 78,
            "temperature": 30
        }
    ]

    thunderstorm = []
    lightning = []

    for weather in weather_inputs:

        result = calculate_risk(
            weather["radar"],
            weather["satellite"],
            weather["lightning"],
            weather["humidity"],
            weather["temperature"]
        )

        thunderstorm.append(result["thunderstorm_risk"])
        lightning.append(result["lightning_risk"])

    return {
    "thunderstorm": thunderstorm,
    "lightning": lightning,
    "times": [
        "NOW",
        "15 MIN",
        "30 MIN",
        "45 MIN",
        "60 MIN"
    ],
    "inputs": weather_inputs
    }