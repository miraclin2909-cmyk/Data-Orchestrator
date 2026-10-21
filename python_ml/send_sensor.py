
import json
from urllib.request import Request, urlopen

temperature = float(input("Enter Velxio temperature (°C): "))
humidity = float(input("Enter Velxio humidity (%): "))

data = json.dumps({
    "temperature": temperature,
    "humidity": humidity
}).encode("utf-8")

request = Request(
    "http://127.0.0.1:8000/predict",
    data=data,
    headers={"Content-Type": "application/json"},
    method="POST"
)

with urlopen(request) as response:
    result = json.loads(response.read().decode("utf-8"))

print("\nML Prediction:")
print("Risk:", result["risk"])
print("Fan:", "ON" if result["fan"] else "OFF")
print("LED:", "ON" if result["led"] else "OFF")
