package com.realty.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeasOption {

    private Integer cost;

    private Integer term;

    private Integer leaseRate;

    private Integer advance;

    private Integer redemption;

    private String compensation;

    private String resultedLeaseRate;

    private String resultCost;
}
