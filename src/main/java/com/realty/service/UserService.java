package com.realty.service;

import com.realty.model.User;

public interface UserService {
	
	User addClient(User user);
	
	User addRealtor(User user);
	
	User redactUser(User redUser, User user);
	
	User getUser(Long id);

	void deleteUser(Long id);
	
	void blockUser(Long id);
	
	void activateUser(Long id);
	
	boolean checkExistUsername(String username);
	
	boolean checkExistEmail(String email);

	boolean checkExistUsernameForRedact(User redUser, User user);
	
	boolean checkExistEmailForRedact(User redUser, User user);
}
