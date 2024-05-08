package com.realty.repo;

import com.realty.model.Advertisement;
import com.realty.model.LikedAdvertisements;
import com.realty.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikedAdvertisementsRepo extends JpaRepository<LikedAdvertisements, Long> {
    LikedAdvertisements findByClientIdAndAdvertisement(Long Id, Advertisement advertisement);
    LikedAdvertisements findByAdvertisementAndClient(Advertisement advertisement, User client);
}
