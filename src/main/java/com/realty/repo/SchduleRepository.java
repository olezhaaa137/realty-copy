package com.realty.repo;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.realty.model.Schedule;

import jakarta.transaction.Transactional;

public interface SchduleRepository extends JpaRepository<Schedule, Long> {
	Optional<Schedule> findByDateAndTimeAndAdvertisementId(LocalDate date, LocalTime time, Long id);
	
	List<Schedule> findByAdvertisementIdAndDateAndStatus(Long id, LocalDate date, String status);
	
	@Query(value = "select date from schedule where status like 'Свободно' and advertisement_id = ?1 group by date", nativeQuery = true)
	List<String> findDate(Long id);
	
	@Query(value="select schedule.id, schedule.date, schedule.time, schedule.advertisement_id, schedule.client_id, schedule.status from schedule\n"
			+ "inner join advertisement on schedule.advertisement_id=advertisement.id\n"
			+ "where advertisement.name like ?1 or schedule.date like ?1 and advertisement.realtor_id = ?2", nativeQuery = true)
	List<Schedule> findSchedulesForRealtor(String findParam, Long id);
	
	@Query(value="select schedule.id, schedule.date, schedule.time, schedule.advertisement_id, schedule.client_id, schedule.status from schedule\n"
			+ "inner join advertisement on schedule.advertisement_id=advertisement.id\n"
			+ "where advertisement.name like ?1 or schedule.date like ?1 and schedule.client_id = ?2", nativeQuery = true)
	List<Schedule> findSchedulesForClient(String findParam, Long id);
	
	@Transactional
	@Modifying
	void deleteByAdvertisementIdAndStatus(Long id, String status);
	
	@Transactional
	@Modifying
	void deleteByClientId(Long id);

	
	@Transactional
	@Modifying
	void deleteByAdvertisementId(Long id);
}
