package com.realty.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.realty.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	List<User> findByRole(String role);

	Optional<User> findByUsername(String username);

	Optional<User> findByEmail(String email);
	
	@Query(value = "select * from user "
			+ "where role like 'realtor'", nativeQuery = true)
	List<User> getRealtors();
	
	@Query(value = "select * from user "
			+ "where role like 'client'", nativeQuery = true)
	List<User> getClients();

	@Query(value = "select * from user "
			+ "where role like 'realtor' and (name like ?1 or surname like ?1 or lastname like ?1 or username like ?1 or email like ?1)", nativeQuery = true)
	List<User> findRealtors(String findParam);
	
	@Query(value = "select * from user "
			+ "where role like 'client' and (name like ?1 or surname like ?1 or lastname like ?1 or username like ?1 or email like ?1)", nativeQuery = true)
	List<User> findClients(String findParam);
}
