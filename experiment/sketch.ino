
#include <DHT.h>

#define DHT_PIN 7
#define DHT_TYPE DHT22

#define FAN_PIN 17
#define LED_PIN 16

DHT dht(DHT_PIN, DHT_TYPE);

void setup() {
  Serial.begin(115200);

  dht.begin();

  pinMode(FAN_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);

  digitalWrite(FAN_PIN, LOW);
  digitalWrite(LED_PIN, LOW);

  delay(1000);
  Serial.println("System ready!");
}

void loop() {
  delay(2000);

  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("DHT22 read error!");
    return;
  }

  Serial.print("Temperature: ");
  Serial.print(temperature, 1);
  Serial.print(" C   Humidity: ");
  Serial.print(humidity, 1);
  Serial.println(" %");

  Serial.println("----------------------------");
}
