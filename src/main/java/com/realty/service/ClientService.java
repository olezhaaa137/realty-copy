package com.realty.service;

import java.util.List;

import com.realty.model.User;

public interface ClientService {
	List<User> getClients();
	
	List<User> findClients(String findParam);
}
