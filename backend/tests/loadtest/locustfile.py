from __future__ import annotations

from locust import HttpUser, task, between


class AnatomyUser(HttpUser):
    wait_time = between(1, 3)

    def on_start(self) -> None:
        payload = {
            "email": "locust@example.com",
            "password": "StrongPass123",
            "display_name": "Locust",
            "profile_type": "student",
        }
        self.client.post("/v1/auth/register", json=payload)
        login = self.client.post("/v1/auth/login", json={"email": payload["email"], "password": payload["password"]})
        if login.status_code == 200:
            token = login.json()["access_token"]
            self.client.headers.update({"Authorization": f"Bearer {token}"})

    @task(2)
    def dashboard(self) -> None:
        self.client.get("/v1/dashboard/summary")

    @task(1)
    def missions(self) -> None:
        response = self.client.get("/v1/missions/daily")
        if response.ok and response.json():
            mission_id = response.json()[0]["mission"]["id"]
            self.client.post(f"/v1/missions/{mission_id}/progress", json={"increment": 1})
