def calculate_risk(
    radar_reflectivity,
    satellite_activity,
    lightning_density,
    humidity,
    temperature
):
    # Normalize inputs to 0–100
    radar_score = min(radar_reflectivity / 60 * 100, 100)
    satellite_score = min(satellite_activity, 100)
    lightning_score = min(lightning_density, 100)
    humidity_score = min(max((humidity - 50) * 2, 0), 100)
    temperature_score = min(max((temperature - 20) * 4, 0), 100)

    # Weighted risk calculation
    thunderstorm_risk = (
        radar_score * 0.35
        + satellite_score * 0.25
        + lightning_score * 0.20
        + humidity_score * 0.10
        + temperature_score * 0.10
    )

    lightning_risk = (
        lightning_score * 0.50
        + radar_score * 0.25
        + satellite_score * 0.15
        + humidity_score * 0.10
    )

    return {
        "thunderstorm_risk": round(thunderstorm_risk),
        "lightning_risk": round(lightning_risk)
    }