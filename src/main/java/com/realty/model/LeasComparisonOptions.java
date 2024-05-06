package com.realty.model;

import com.realty.service.GPTService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeasComparisonOptions {

    private String requestToGPT;


    private List<LeasOption> leasOptions = new ArrayList<>();

    public void addLeasOption(LeasOption leasOption){
        this.leasOptions.add(leasOption);
    }

    public void makeRequest(){
        StringBuilder request = new StringBuilder();
        request.append("Сравни следующие варианты лизинга:");
        for (int i = 0; i < leasOptions.size(); i++) {
            request.append(i+1 + ". ");
            request.append("Стоимость объекта покупки: "+leasOptions.get(i).getCost() + "рублей, ");
            request.append("Срок лизинга: "+leasOptions.get(i).getTerm() + "месяцев, ");
            request.append("Ставка по лизингу: "+leasOptions.get(i).getLeaseRate() + "процентов, ");
            request.append("Авансовый платёж: "+leasOptions.get(i).getAdvance() + "процентов, ");
            request.append("Выкупная стоимость: "+leasOptions.get(i).getRedemption() + "процентов, ");
            request.append("Возмещение стоимости: "+leasOptions.get(i).getCompensation() + "рублей, ");
            request.append("Процентная ставка по лизингу: "+leasOptions.get(i).getResultedLeaseRate() + "процентов, ");
            request.append("Итоговый лизинговый платеж: "+leasOptions.get(i).getResultCost() + "рублей; ");
            if (i!=leasOptions.size()-1){
                request.append(" или стоит выбрать вот этот вариант ");
            }
        }
        requestToGPT = request.toString();
    }

    public void printObj(){
        System.out.println("compensation: " + leasOptions.get(0).getCompensation());
    }

    public String getResponseFromGPT() {
        makeRequest();
        return new GPTService().makeRequest(requestToGPT);
    }
}
