package com.realty.service;

import com.realty.model.Advertisement;
import com.realty.repo.LikedAdvertisementsRepo;
import com.realty.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LikedAdvertisementsService {

    @Autowired
    private LikedAdvertisementsRepo likedAdvertisementsRepo;
    public boolean isNotLiked(Long userId, Advertisement advertisement){
        if (likedAdvertisementsRepo.findByClientIdAndAdvertisement(userId,advertisement) == null){
            return true;
        }
        return false;
    }

    public boolean isLiked(Long userId, Advertisement advertisement){
        if (likedAdvertisementsRepo.findByClientIdAndAdvertisement(userId,advertisement) == null){
            return false;
        }
        return true;
    }
}
