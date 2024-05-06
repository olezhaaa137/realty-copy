package com.realty.model;

import java.util.ArrayList;
import java.util.List;

public class LeasComparisonOptions {

    private String requestToGPT;

    private List<LeasOption> leasOptions = new ArrayList<>();

    public void addLeasOption(LeasOption leasOption){
        this.leasOptions.add(leasOption);
        makeRequest();
    }

    public void makeRequest(){
        for (int i = 0; i < leasOptions.size(); i++) {
            requestToGPT = "Сравни следующие варианты лизинга: ...";
        }
    }

    public void printObj(){
        System.out.println("compensation: " + leasOptions.get(0).getCompensation());
    }
}
