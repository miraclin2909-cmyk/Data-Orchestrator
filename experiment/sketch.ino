#include <DHT.h>

#define DHT_PIN 7
#define DHT_TYPE DHT22

#define FAN_PIN 17
#define BUZZER_PIN 16

DHT dht(DHT_PIN, DHT_TYPE);

void setup() {
  Serial.begin(115200);

  dht.begin();

  pinMode(FAN_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  digitalWrite(FAN_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);

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

  // Always start with both OFF
  digitalWrite(FAN_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);

  if (temperature >= 55) {

    digitalWrite(FAN_PIN, HIGH);
    digitalWrite(BUZZER_PIN, HIGH);

    Serial.println("DANGER! Fan ON | Buzzer ON");

  } 
  else if (temperature >= 45) {

    digitalWrite(FAN_PIN, HIGH);

    Serial.println("WARNING! Fan ON | Buzzer OFF");

  } 
  else {

    Serial.println("NORMAL! Fan OFF | Buzzer OFF");

  }

  Serial.println("----------------------------");
}
/*#define BUZZER_PIN 16

void setup() {
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);
}

void loop() {
}*/