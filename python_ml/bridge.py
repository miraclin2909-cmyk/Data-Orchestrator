
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from ml_model import predict_temperature

HOST = "127.0.0.1"
PORT = 8000


def predict(temperature, humidity):
    risk = predict_temperature(
        temperature,
        humidity,
        0.0,
        1,
    )

    critical = risk == "CRITICAL"

    return {
        "risk": risk,
        "fan": critical,
        "led": critical,
    }

class Handler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_POST(self):
        if self.path != "/predict":
            self.send_error(404)
            return

        try:
            length = int(self.headers.get("Content-Length", 0))
            data = json.loads(self.rfile.read(length))

            temperature = float(data["temperature"])
            humidity = float(data["humidity"])

            result = predict(temperature, humidity)
            body = json.dumps(result).encode("utf-8")

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        except (ValueError, KeyError, json.JSONDecodeError):
            self.send_error(400, "Invalid sensor data")
        except FileNotFoundError as error:
            self.send_error(500, str(error))
        except Exception as error:
            print("Prediction error:", error)
            self.send_error(500, "Prediction failed")

    def log_message(self, format, *args):
        print(*args)


if __name__ == "__main__":
    server = HTTPServer((HOST, PORT), Handler)
    print(f"Prediction bridge ready at http://{HOST}:{PORT}")
    print("Waiting for sensor data...")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping bridge...")
        server.server_close()
