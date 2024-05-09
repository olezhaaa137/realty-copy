package com.realty.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Geoposition {
    @Id
    Long id;
    String street;
    Integer house_num;
    Integer floor;
    Integer flat_num;

    @ManyToOne
    Advertisement advertisement;

}
