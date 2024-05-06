package com.realty.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.realty.model.Advertisement;
import com.realty.model.User;

public interface AdvertisementService {
	List<Advertisement> getAdvertisements();
	
	List<Advertisement> getActiveAdvertisements();
	
	List<Advertisement> getAdvertisementsForRealtor(Long id);
	
	Advertisement getAdvertisement(Long id);
	
	Advertisement addAdvertisement(Advertisement advertisement, MultipartFile[] photo, User user) throws IOException;
	
	void deleteAdvertisement(Long id);
	
	Advertisement redactAdvertisement(Long id, String price);
	
	List<Advertisement> findAdvertisements(String findParam);
	
	List<Advertisement> filterAdvertisements(String priceFrom, String priceTo);
	
	List<Advertisement> sortAdvertisements(String sort);
	
	List<Advertisement> findAdvertisementsAdmin(String findParam);
	
	List<Advertisement> filterAdvertisementsAdmin(String priceFrom, String priceTo);
	
	List<Advertisement> sortAdvertisementsAdmin(String sort);
	
	List<Advertisement> findAdvertisementsMy(String findParam, User user);
	
	List<Advertisement> filterAdvertisementsMy(String priceFrom, String priceTo, User user);
	
	List<Advertisement> sortAdvertisementsMy(String sort, User user);
	
	List<User> getTopRealtor();
	
	void confirmAdvertisement(Long id);
	
	void cancelAdvertisement(Long id);
	
	boolean checkPriceInterval(String priceFrom, String priceTo);
}
