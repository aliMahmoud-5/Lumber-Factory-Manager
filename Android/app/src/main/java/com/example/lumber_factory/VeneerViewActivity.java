package com.example.lumber_factory;

import android.annotation.SuppressLint;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.Bundle;
import android.os.SystemClock;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.Chronometer;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.CheckBox;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.OutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class VeneerViewActivity extends AppCompatActivity {
    LinearLayout orderDetails;
    LinearLayout veneerListContainer;
    TextView noOrdersMsg;

    Button startButton, endButton, exitButton, refreshButton;
    Chronometer timer;
    JSONObject order;
    JSONArray veneers;
    List<CheckBox> veneerCheckboxes = new ArrayList<>();
    static String id ;
    String IP = "192.168.1.12";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_veneer_view);

        orderDetails = findViewById(R.id.orderDetailsLayout);
        veneerListContainer = findViewById(R.id.veneerListContainer);
        startButton = findViewById(R.id.startButton);
        endButton = findViewById(R.id.endButton);
        timer = findViewById(R.id.timer);
        noOrdersMsg = findViewById(R.id.noOrdersMsg);
        exitButton = findViewById(R.id.exitButton);
        refreshButton = findViewById(R.id.refreshButton);


        loadOrderDetails();

        startButton.setOnClickListener(v -> {
            timer.setBase(SystemClock.elapsedRealtime());
            timer.start();
            startButton.setVisibility(View.GONE);
            endButton.setVisibility(View.VISIBLE);

            updateStartVeneer();
        });

        endButton.setOnClickListener(v -> {
            if (allCheckboxesChecked()) {
                timer.stop();
                timer.setBase(SystemClock.elapsedRealtime());
                completeOrder();
                startButton.setVisibility(View.VISIBLE);
                endButton.setVisibility(View.GONE);
            } else {
                Toast.makeText(this, "Complete all veneers first", Toast.LENGTH_SHORT).show();
            }
        });


        exitButton.setOnClickListener(v -> finish());
        refreshButton.setOnClickListener(v -> {
            recreate();
        });
    }

    private void loadOrderDetails() {
        new Thread(() -> {


            try {
                URL url = new URL("http://"+ IP + ":3080/api/order/veneer-queue");
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                connection.setConnectTimeout(5000);
                connection.setReadTimeout(5000);
                connection.connect();

                int responseCode = connection.getResponseCode();
                Log.d("API_REQUEST", "Response Code: " + responseCode);

                if (responseCode == 200) {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                    StringBuilder response = new StringBuilder();
                    String line;

                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }

                    reader.close();
                    Log.d("API_RESPONSE", "Response: " + response.toString());

                    JSONArray jsonResponse = new JSONArray(response.toString());

                    Log.d("API_RESPONSE", "Responseeeeee: " );

                    if (jsonResponse.length() > 0) {

                        JSONArray orderData = jsonResponse.getJSONArray(0);
                        JSONObject order = orderData.getJSONObject(0);
                        JSONArray veneers = orderData.getJSONArray(1);
                        String Name = orderData.getString(4);
                        String est = orderData.getString(2);
                        id = order.getString("id");
                        Log.d("OrderData","OrderData:" + order);
                        Log.d("VeneerData","VeneerData:" + veneers);





                        if (order != null && veneers != null && veneers.length() > 0) {

                            runOnUiThread(()-> orderDetails.setVisibility(View.VISIBLE));
                            runOnUiThread(() -> noOrdersMsg.setVisibility(View.GONE));
                            JSONObject finalOrder = order;
                            JSONArray finalVeneers = veneers;
                            String finalName = Name;
                            String finalEst = est;
                            runOnUiThread(() -> populateOrderDetails(finalOrder, finalVeneers, finalName, finalEst));


                        } else if(veneers.length() ==0) {
                            Log.d("veneeeeeer","veneers are empty");
                            for(int i=0; ( i< jsonResponse.length());i++){
                                if(veneers.length() == 0){
                                    Log.d("veneeeeeer","veneers for loop");

                                    orderData = jsonResponse.getJSONArray(i);
                                    order = orderData.getJSONObject(0);
                                    veneers = orderData.getJSONArray(1);
                                    Name = orderData.getString(4);
                                    est = orderData.getString(2);


                                }else {
                                    break;
                                }

                            }
                                runOnUiThread(()-> orderDetails.setVisibility(View.VISIBLE));
                                runOnUiThread(() -> noOrdersMsg.setVisibility(View.GONE));
                                JSONObject finalOrder1 = order;
                                JSONArray finalVeneers1 = veneers;
                                String finalName1 = Name;
                                String finalEst1 = est;
                                runOnUiThread(() -> populateOrderDetails(finalOrder1, finalVeneers1, finalName1, finalEst1));




                        }else{
                            Log.e("API_ERROR", "Order or veneers data is invalid");

                        }
                    }else{
                        runOnUiThread(() -> showNoOrdersMessage());

                        Log.d("Message_Success","no orders found");

                    }

                }

                connection.disconnect();
            } catch (Exception e) {
                Log.e("API_ERROR", "Error during API request: " + e.getMessage());
                e.printStackTrace();


            }
        }).start();
    }

    private void showNoOrdersMessage() {

        noOrdersMsg.setVisibility(View.VISIBLE);
        veneerListContainer.removeAllViews();
        orderDetails.setVisibility(View.GONE);
        veneerCheckboxes.clear();
    }


    @SuppressLint({"SetTextI18n", "ResourceAsColor"})
    private void populateOrderDetails(JSONObject order, JSONArray veneers, String Name, String est) {

        try {
            String orderDate = order.getString("order_date");
            String estimatedDeliveryDate = order.getString("estimated_delivery_date");
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        TextView orderIdText = findViewById(R.id.orderId);
        TextView customerNameText = findViewById(R.id.customerName);
        TextView estimatedTimeText = findViewById(R.id.estimatedTime);

        try {
            orderIdText.setText("Order ID: " + order.getString("id"));
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }

        customerNameText.setText("Customer: " + Name);
        estimatedTimeText.setText("Estimated Time: " + est + " minutes");

        veneerListContainer.removeAllViews();
        veneerCheckboxes.clear();

        endButton.setEnabled(false);

        for (int i = 0; i < veneers.length(); i++) {
            try {
                JSONObject veneer = veneers.getJSONObject(i);
                CheckBox veneerCheckbox = new CheckBox(this);
                veneerCheckbox.setText("Cut: " + veneer.getInt("width") + "x" + veneer.getInt("height"));
                veneerCheckbox.setGravity(Gravity.CENTER);
                veneerCheckbox.setTextSize(50f);
                GradientDrawable drawable = new GradientDrawable();
                drawable.setColor(getResources().getColor(R.color.purple));
                drawable.setCornerRadius(60f);
                veneerCheckbox.setBackground(drawable);

                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                );
                params.setMargins(0, 16, 0, 16);
                veneerCheckbox.setLayoutParams(params);


                veneerCheckbox.setOnCheckedChangeListener((buttonView, isChecked) -> {

                    if (isChecked) {
                        endButton.setEnabled(allCheckboxesChecked());
                        drawable.setColor(getResources().getColor(R.color.black));
                        veneerCheckbox.setTextColor(getResources().getColor(R.color.white));
                    }else{
                        drawable.setColor(getResources().getColor(R.color.purple));
                        veneerCheckbox.setTextColor(getResources().getColor(R.color.black));
                    }
                });

                veneerListContainer.addView(veneerCheckbox);
                veneerCheckboxes.add(veneerCheckbox);

            } catch (JSONException e) {
                throw new RuntimeException(e);
            }
        }
    }




    private void updateStartVeneer() {
        new Thread(() -> {
            try {
                URL url = new URL("http://"+ IP + ":3080/api/order/start-veneer/" + id);

                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                connection.setConnectTimeout(5000);
                connection.setReadTimeout(5000);
                connection.connect();

                int responseCode = connection.getResponseCode();

                if (responseCode == 200) {
                    Log.i("API_SUCCESS", "Order start_veneer updated");
                } else {
                    Log.e("API_ERROR", "Failed to update start_veneer");
                }

                connection.disconnect();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private boolean allCheckboxesChecked() {
        for (CheckBox checkbox : veneerCheckboxes) {
            if (!checkbox.isChecked()) {
                return false;
            }
        }
        return true;
    }

    private void completeOrder() {
        new Thread(() -> {
            try {

                URL url = new URL("http://"+ IP +":3080/api/order/veneer-end/" + id);
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                connection.setConnectTimeout(5000);
                connection.setReadTimeout(5000);
                connection.connect();

                int responseCode = connection.getResponseCode();

                if (responseCode == 200) {
                    Log.i("API_SUCCESS", "Order real_date updated");
                } else {
                    Log.e("API_ERROR", "Failed to update real_date");
                }

                connection.disconnect();


                runOnUiThread(() -> {
                    veneerListContainer.removeAllViews();
                    veneerCheckboxes.clear();
                    loadOrderDetails();
                });
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
}
