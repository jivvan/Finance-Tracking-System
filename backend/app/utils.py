import pandas as pd
from functools import wraps
from flask import g, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models import User
from statsmodels.tsa.arima.model import ARIMA
from datetime import datetime


def jwt_required_user_exists(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        # Verify JWT
        verify_jwt_in_request()
        user_id = get_jwt_identity()

        # Check if the user exists in the database
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User does not exist'}), 404

        # Store the user in `g` so it's available in the request context
        g.current_user = user
        return fn(*args, **kwargs)

    return wrapper


def arima_predict(expenses: list, time_period=30):
    df = pd.DataFrame(expenses)
    df['date'] = pd.to_datetime(df['date'])
    df.set_index('date', inplace=True)
    df.sort_index(inplace=True)

    # Create a continuous date range
    date_range = pd.date_range(
        start=df.index.min(), end=df.index.max(), freq='D')

    # Reindex the DataFrame to include all dates
    df_reindexed = df.reindex(date_range)

    # Forward fill the missing values (you can use other methods like interpolation)
    df_reindexed['amount'] = df_reindexed['amount'].interpolate(
        method='linear').fillna(0)

    # Now df_reindexed has continuous dates with filled values
    daily_expenses = df_reindexed['amount']

    # Make the series stationary by differencing
    differenced_expenses = daily_expenses.diff().dropna()

    p, q = 1, 1

    # Fit ARIMA model
    model = ARIMA(differenced_expenses, order=(p, 0, q))
    model_fit = model.fit()
    forecast_diff = model_fit.forecast(time_period)

    # Get the last known value of the original series
    last_known_value = daily_expenses.iloc[-1]

    # Create a Series for the last known value with the correct index
    last_known_series = pd.Series([last_known_value], index=[
                                  daily_expenses.index[-1]])

    # Create a Series for the forecasted differences with the correct index
    forecast_index = pd.date_range(
        start=daily_expenses.index[-1] + pd.Timedelta(days=1), periods=time_period, freq='D')
    forecast_diff_series = pd.Series(
        forecast_diff.values, index=forecast_index)

    # Combine the last known value and the forecasted differences
    combined_series = pd.concat([last_known_series, forecast_diff_series])

    # Reverse the differencing to get the actual expense predictions
    forecast_actual = combined_series.cumsum()

    # Convert the index to formatted date strings
    forecast_actual.index = forecast_actual.index.strftime('%Y-%m-%d')

    # Convert the Series to a dictionary with formatted date strings as keys
    forecast_dict = forecast_actual.to_dict()

    return forecast_dict
