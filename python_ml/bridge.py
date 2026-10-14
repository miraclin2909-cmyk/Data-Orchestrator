
import json
from http.server import BaseHTTPRequestHandler, HTTPServer

HOST = "127.0.0.1"
PORT = 8000


def predict(temperature, humidity):
    """
    Temporary prediction logic.
    We will replace this with your teammate's ML model.
    """
    if temperature >= 55:
        risk = "DANGER"
    elif temperature >= 45:
        risk = "WARNING"
    else:
        risk = "NORMAL"

    return {
        "risk": risk,
        "fan": temperature >= 45,
        "led": temperature >= 55
    }


class Handler(BaseHTTPRequestHandler):

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
            self.send_header(
                "Content-Type", "application/json"
            )
            self.send_header(
                "Content-Length", str(len(body))
            )
            self.end_headers()
            self.wfile.write(body)

        except (ValueError, KeyError, json.JSONDecodeError):
            self.send_error(400, "Invalid sensor data")

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
