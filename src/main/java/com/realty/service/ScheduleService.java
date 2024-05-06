package com.realty.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.realty.model.Schedule;
import com.realty.model.User;

public interface ScheduleService {
	Schedule addSchedule(LocalDate date, LocalTime time, Long id);
	
	void deleteSchedule(Long id);
	
	Schedule addClientToSchedule(User user, Long advertisementId, LocalDate date, LocalTime time);
	
	Schedule showSchedule(Long id);
	
	boolean checkExistSchedule(LocalDate date, LocalTime time, Long id);
	
	boolean checkDate(LocalDate date, LocalTime time);
	
	boolean checkTime(LocalDate date, LocalTime time);
	
	Schedule delClientFromSchedule(Long advId);
	
	List<Schedule> getSchedulesForRealtor(User user);
	
	List<Schedule> getSchedulesForClient(User user);
	
	List<Schedule> findSchedulesForRealtor(String findParam, User user);
	
	List<Schedule> findSchedulesForClient(String findParam, User user);
	
	void saleAdvertisement(Long id);
	
	List<LocalDate> getDate(Long id);
	
	List<LocalDate> replaceDate(Long id, String date);
	
	List<LocalTime> getTime(Long id, String date);
	
	boolean checkSaleAdvertisement(Long id);
}
