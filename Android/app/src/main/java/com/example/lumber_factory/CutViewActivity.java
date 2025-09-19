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

public class CutViewActivity extends AppCompatActivity {
    LinearLayout orderDetails;
    LinearLayout cutListContainer;
    TextView noOrdersMsg;

    Button startButton, endButton, exitButton, refreshButton;
    Chronometer timer;
    JSONObject order;
    JSONArray cuts;
    JSONArray veneers;
    List<CheckBox> cutCheckboxes = new ArrayList<>();
    static String id ;
    String IP = "192.168.1.12";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cut_view);

        orderDetails = findViewById(R.id.orderDetailsLayout);
        cutListContainer = findViewById(R.id.cutListContainer);
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

            updateStartCut();
        });

        endButton.setOnClickListener(v -> {
            if (allCheckboxesChecked()) {
                timer.stop();
                timer.setBase(SystemClock.elapsedRealtime());
                completeOrder();
                startButton.setVisibility(View.VISIBLE);
                endButton.setVisibility(View.GONE);
            } else {
                Toast.makeText(this, "Complete all cuts first", Toast.LENGTH_SHORT).show();
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
                URL url = new URL("http://"+ IP + ":3080/api/order/cut-queue");
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
                        JSONArray cuts = orderData.getJSONArray(1);
                        String Name = orderData.getString(4);
                        String est = orderData.getString(2);
                        id = order.getString("id");
                        Log.d("OrderData","OrderData:" + order);
                        Log.d("CutData","CutData:" + order);





                        if (order != null && cuts != null && cuts.length() > 0) {

                            runOnUiThread(()-> orderDetails.setVisibility(View.VISIBLE));
                            runOnUiThread(() -> noOrdersMsg.setVisibility(View.GONE));
                            JSONObject finalOrder = order;
                            JSONArray finalCuts = cuts;
                            String finalName = Name;
                            String finalEst = est;
                            runOnUiThread(() -> populateOrderDetails(finalOrder, finalCuts, finalName, finalEst));


                        } else if(cuts.length() ==0) {
                            Log.d("veneeeeeer","veneers are empty");
                            for(int i=0; ( i< jsonResponse.length());i++){
                                if(cuts.length() == 0){
                                    Log.d("veneeeeeer","veneers for loop");

                                    orderData = jsonResponse.getJSONArray(i);
                                    order = orderData.getJSONObject(0);
                                    cuts = orderData.getJSONArray(1);
                                    Name = orderData.getString(4);
                                    est = orderData.getString(2);


                                }else {
                                    break;
                                }

                            }
                            runOnUiThread(()-> orderDetails.setVisibility(View.VISIBLE));
                            runOnUiThread(() -> noOrdersMsg.setVisibility(View.GONE));
                            JSONObject finalOrder1 = order;
                            JSONArray finalCuts1 = cuts;
                            String finalName1 = Name;
                            String finalEst1 = est;
                            runOnUiThread(() -> populateOrderDetails(finalOrder1, finalCuts1, finalName1, finalEst1));




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
        cutListContainer.removeAllViews();
        orderDetails.setVisibility(View.GONE);
        cutCheckboxes.clear();
    }


    @SuppressLint({"SetTextI18n", "ResourceAsColor"})
    private void populateOrderDetails(JSONObject order, JSONArray cuts, String Name, String est) {
        Log.d("order","order:::" + order);
        Log.d("cuts","cuts:::" + cuts);

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

        cutListContainer.removeAllViews();
        cutCheckboxes.clear();

        endButton.setEnabled(false);

        for (int i = 0; i < cuts.length(); i++) {
            try {
                JSONObject cut = cuts.getJSONObject(i);
                CheckBox cutCheckbox = new CheckBox(this);
                cutCheckbox.setText("Cut: " + cut.getInt("width") + "x" + cut.getInt("height"));
                cutCheckbox.setGravity(Gravity.CENTER);
                cutCheckbox.setTextSize(50f);
                GradientDrawable drawable = new GradientDrawable();
                drawable.setColor(getResources().getColor(R.color.purple));
                drawable.setCornerRadius(60f);
                cutCheckbox.setBackground(drawable);

                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT
                );
                params.setMargins(0, 16, 0, 16);
                cutCheckbox.setLayoutParams(params);


                cutCheckbox.setOnCheckedChangeListener((buttonView, isChecked) -> {

                    if (isChecked) {
                        endButton.setEnabled(allCheckboxesChecked());
                        drawable.setColor(getResources().getColor(R.color.black));
                        cutCheckbox.setTextColor(getResources().getColor(R.color.white));
                    }else{
                        drawable.setColor(getResources().getColor(R.color.purple));
                        cutCheckbox.setTextColor(getResources().getColor(R.color.black));
                    }
                });

                cutListContainer.addView(cutCheckbox);
                cutCheckboxes.add(cutCheckbox);

            } catch (JSONException e) {
                throw new RuntimeException(e);
            }
        }
    }




    private void updateStartCut() {
        new Thread(() -> {
            try {
                URL url = new URL("http://"+ IP + ":3080/api/order/start-cut/" + id);

                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                connection.setConnectTimeout(5000);
                connection.setReadTimeout(5000);
                connection.connect();

                int responseCode = connection.getResponseCode();

                if (responseCode == 200) {
                    Log.i("API_SUCCESS", "Order start_cut updated");
                } else {
                    Log.e("API_ERROR", "Failed to update start_cut");
                }

                connection.disconnect();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private boolean allCheckboxesChecked() {
        for (CheckBox checkbox : cutCheckboxes) {
            if (!checkbox.isChecked()) {
                return false;
            }
        }
        return true;
    }

    private void completeOrder() {
        new Thread(() -> {
            try {

                URL url = new URL("http://"+ IP +":3080/api/order/cut-end/" + id);
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
                    cutListContainer.removeAllViews();
                    cutCheckboxes.clear();
                    loadOrderDetails();
                });
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
}
