package com.realty.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.realty.model.User;
import com.realty.repo.UserRepository;

@Service
public class ClientServiceImpl implements ClientService {

	@Autowired
	private UserRepository userRepository;
	
	@Override
	public List<User> getClients() {
		return userRepository.getClients();
	}

	@Override
	public List<User> findClients(String findParam) {
		return userRepository.findClients(findParam+"%");
	}

}
