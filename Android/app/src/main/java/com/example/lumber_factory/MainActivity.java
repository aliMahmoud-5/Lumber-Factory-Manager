package com.example.lumber_factory;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainActivity extends AppCompatActivity {
    EditText idField, passwordField;
    Button loginButton;
    String IP = "192.168.1.12";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        idField = findViewById(R.id.id);
        passwordField = findViewById(R.id.password);
        loginButton = findViewById(R.id.loginButton);

        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String username = idField.getText().toString().trim();
                String password = passwordField.getText().toString().trim();
                authenticateUser(username, password);
            }
        });
    }

    private void authenticateUser(String id, String password) {
        new Thread(() -> {
            try {
                URL url = new URL("http://" + IP + ":3080/api/auth/signin");
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setDoOutput(true);

                JSONObject credentials = new JSONObject();
                credentials.put("id", id);
                credentials.put("password", password);

                OutputStreamWriter writer = new OutputStreamWriter(conn.getOutputStream());
                writer.write(credentials.toString());
                writer.flush();
                writer.close();

                int responseCode = conn.getResponseCode();
                Log.e("LoginError", "Server Response Code: " + responseCode);

                if (responseCode == 200) {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder responseStr = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        responseStr.append(line);
                    }
                    reader.close();

                    JSONObject response = new JSONObject(responseStr.toString());
                    String department = response.getString("department");

                    runOnUiThread(() -> {
                        if (department.equals("cut")) {
                            Intent intent = new Intent(MainActivity.this, CutViewActivity.class);
                            startActivity(intent);
                        } else if (department.equals("veneer")) {
                            Intent intent = new Intent(MainActivity.this, VeneerViewActivity.class);
                            startActivity(intent);
                        }
                    });
                } else {
                    runOnUiThread(() ->
                            Toast.makeText(MainActivity.this, "Invalid credentials. Server Response: " + responseCode, Toast.LENGTH_SHORT).show()
                    );
                }
            } catch (Exception e) {
                Log.e("LoginError", "Error: " + e.getMessage(), e);
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "Error occurred: " + e.getMessage(), Toast.LENGTH_SHORT).show());
            }
        }).start();
    }
}
