import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller
from pmdarima import auto_arima

def check_stationarity(series, cutoff=0.05):
    result = adfuller(series)
    return result[1] < cutoff  # Returns True if the series is stationary

def fit_arima_and_forecast(series, steps=5):
    # Ensure series is stationary or differenced

    # Use auto_arima to determine the best order
    model = auto_arima(series, seasonal=False, trace=True, error_action='ignore', suppress_warnings=True)
    print(f"Optimal ARIMA order: {model.order}")

    # Fit the ARIMA model
    model_fit = model.fit(series)

    # Forecast future values
    forecast = model_fit.predict(n_periods=steps)
    return forecast

def predict(aggregated_dict, steps=10):
    df = pd.DataFrame(aggregated_dict)
    print(df)

    # Forecast for CO2, CH4, and temperature change for the next steps years
    co2_forecast = fit_arima_and_forecast(df['CO2'], steps=steps)
    ch4_forecast = fit_arima_and_forecast(df['CH4'], steps=steps)
    temp_change_forecast = fit_arima_and_forecast(df['temperature_increase_percentage'], steps=steps)

    # Prepare future years as a Pandas Series
    last_year = df.index[-1]
    future_years =np.arange(last_year + 1, last_year + 1 + steps)

    # Prepare the forecast DataFrame
    forecast_df = pd.DataFrame({
        'Year': future_years,
        'CO2_Forecast': co2_forecast,
        'CH4_Forecast': ch4_forecast,
        'Temperature_Change_Forecast': temp_change_forecast
    })

    return forecast_df

