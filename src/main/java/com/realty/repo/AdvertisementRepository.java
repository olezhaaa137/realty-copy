package com.realty.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.realty.model.Advertisement;

import jakarta.transaction.Transactional;

public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {
	List<Advertisement> findByRealtorId(Long id);

	List<Advertisement> findByClientId(Long id);

	List<Advertisement> findByStatus(String status);

	Optional<Advertisement> findByName(String name);

	@Query(value = "select * from advertisement where name like ?1", nativeQuery = true)
	List<Advertisement> findAdvertisements(String findParam);

	@Query(value = "select * from advertisement where name like ?1 and realtor_id = ?2", nativeQuery = true)
	List<Advertisement> findAdvertisements(String findParam, Long id);

	List<Advertisement> findByRealtorIdAndPriceBetween(Long id, Float priceFrom, Float priceTo);

	List<Advertisement> findByPriceBetween(Float priceFrom, Float priceTo);

	@Query(value = "select user.username from user\n" + "inner join advertisement on advertisement.realtor_id=user.id\n"
			+ "where advertisement.status like 'Продано'\n" + "group by realtor_id\n"
			+ "order by count(realtor_id) desc", nativeQuery = true)
	List<String> getTopRealtor();

	@Transactional
	@Modifying
	void deleteByClientId(Long id);
	
	@Transactional
	@Modifying
	void deleteByRealtorId(Long id);
}
