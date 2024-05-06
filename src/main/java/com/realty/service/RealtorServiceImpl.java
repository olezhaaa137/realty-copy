package com.realty.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.realty.model.User;
import com.realty.repo.UserRepository;

@Service
public class RealtorServiceImpl implements RealtorService {
	
	@Autowired
	private UserRepository userRepository; 
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public List<User> getRealtors() {
		return userRepository.getRealtors();
	}

	@Override
	public List<User> findRealtors(String findParam) {
		return userRepository.findRealtors(findParam+"%");
	}

	@Override
	public User addRealtor(User user) {
		user.setStatus(true);
		user.setRole("realtor");
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
	}

}
