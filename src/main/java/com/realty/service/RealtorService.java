package com.realty.service;

import java.util.List;

import com.realty.model.User;

public interface RealtorService {
	List<User> getRealtors();
	
	List<User> findRealtors(String findParam);
	
	User addRealtor(User user);
}
