package com.realty.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.realty.model.Advertisement;
import com.realty.model.User;
import com.realty.repo.AdvertisementRepository;
import com.realty.repo.SchduleRepository;
import com.realty.repo.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private SchduleRepository schduleRepository;
	
	@Autowired
	private AdvertisementRepository advertisementRepository;

	@Override
	public User addClient(User user) {
		user.setStatus(true);
		user.setRole("client");
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
	}

	@Override
	public User addRealtor(User user) {
		user.setStatus(true);
		user.setRole("realtor");
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(user);
	}

	@Override
	public User redactUser(User redUser, User user) {
		user.setEmail(redUser.getEmail());
		user.setPhone(redUser.getPhone());
		user.setName(redUser.getName());
		user.setSurname(redUser.getSurname());
		user.setLastname(redUser.getLastname());
		user.setUsername(redUser.getUsername());
		user.setPassword(passwordEncoder.encode(redUser.getPassword()));
		return userRepository.save(user);
	}

	@Override
	public void deleteUser(Long id) {
		User user = userRepository.findById(id).get();
		if(user.getRole().equals("client")) {
			for (Advertisement advertisement : advertisementRepository.findByClientId(id)) {
				schduleRepository.deleteByAdvertisementId(advertisement.getId());
			}
			schduleRepository.deleteByClientId(id);
			advertisementRepository.deleteByClientId(id);
		}
		if(user.getRole().equals("realtor")) {
			for (Advertisement advertisement : advertisementRepository.findByRealtorId(id)) {
				schduleRepository.deleteByAdvertisementId(advertisement.getId());
			}
			advertisementRepository.deleteByRealtorId(id);
		}
		userRepository.deleteById(id);
	}

	@Override
	public boolean checkExistUsername(String username) {
		if (userRepository.findByUsername(username).isEmpty())
			return true;
		return false;
	}

	@Override
	public boolean checkExistEmail(String email) {
		if (userRepository.findByEmail(email).isEmpty())
			return true;
		return false;
	}

	@Override
	public boolean checkExistUsernameForRedact(User redUser, User user) {
		if (userRepository.findByUsername(redUser.getUsername()).isPresent()
				&& !redUser.getUsername().equals(user.getUsername()))
			return false;
		return true;
	}

	@Override
	public boolean checkExistEmailForRedact(User redUser, User user) {
		if (userRepository.findByEmail(redUser.getEmail()).isPresent() && !redUser.getEmail().equals(user.getEmail()))
			return false;
		return true;
	}

	@Override
	public void blockUser(Long id) {
		userRepository.findById(id).ifPresentOrElse(u -> {
			u.setStatus(false);
			userRepository.save(u);
		}, () -> new IllegalArgumentException("Пользователь с id " + id + " не найден!!!"));
	}

	@Override
	public void activateUser(Long id) {
		userRepository.findById(id).ifPresentOrElse(u -> {
			u.setStatus(true);
			userRepository.save(u);
		}, () -> new IllegalArgumentException("Пользователь с id " + id + " не найден!!!"));
	}

	@Override
	public User getUser(Long id) {
		return userRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Пользователь с id " + id + " не найден!!!"));
	}

}
