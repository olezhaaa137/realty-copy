package com.realty.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.realty.model.Schedule;
import com.realty.model.User;
import com.realty.repo.AdvertisementRepository;
import com.realty.repo.SchduleRepository;

@Service
public class ScheduleServiceImpl implements ScheduleService {

	@Autowired
	private SchduleRepository schduleRepository;

	@Autowired
	private AdvertisementRepository advertisementRepository;

	@Override
	public Schedule addSchedule(LocalDate date, LocalTime time, Long id) {
		return schduleRepository.save(Schedule.builder().date(date).time(time).status("Свободно")
				.advertisement(advertisementRepository.findById(id).get()).build());
	}

	@Override
	public void deleteSchedule(Long id) {
		schduleRepository.deleteById(id);
	}

	@Override
	public boolean checkExistSchedule(LocalDate date, LocalTime time, Long id) {
		if (schduleRepository.findByDateAndTimeAndAdvertisementId(date, time, id).isEmpty())
			return true;
		return false;
	}

	@Override
	public Schedule delClientFromSchedule(Long advId) {
		Schedule schedule = schduleRepository.findById(advId)
				.orElseThrow(() -> new IllegalArgumentException("Объявление с id " + advId + " не найдено!"));
		schedule.setClient(null);
		schedule.setStatus("Свободно");
		return schduleRepository.save(schedule);
	}

	@Override
	public List<Schedule> getSchedulesForRealtor(User user) {
		return schduleRepository.findAll().stream()
				.filter(s -> s.getAdvertisement().getRealtor().getId().equals(user.getId())).toList();
	}

	@Override
	public List<Schedule> getSchedulesForClient(User user) {
		return schduleRepository.findAll().stream().filter(s -> s.getClient() != null)
				.filter(s -> s.getClient().getId().equals(user.getId())).toList();
	}

	@Override
	public List<Schedule> findSchedulesForRealtor(String findParam, User user) {
		return schduleRepository.findSchedulesForRealtor(findParam + "%", user.getId());
	}

	@Override
	public List<Schedule> findSchedulesForClient(String findParam, User user) {
		return schduleRepository.findSchedulesForClient(findParam + "%", user.getId());
	}

	@Override
	public boolean checkDate(LocalDate date, LocalTime time) {
		if (date.isBefore(LocalDate.now()) && !date.equals(LocalDate.now()))
			return false;
		return true;
	}

	@Override
	public boolean checkTime(LocalDate date, LocalTime time) {
		if (time.isBefore(LocalTime.now().plusHours(1)) && date.equals(LocalDate.now()))
			return false;
		return true;
	}

	@Override
	public Schedule showSchedule(Long id) {
		return schduleRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Расписание с id " + id + " не было найдено!"));
	}

	@Override
	public void saleAdvertisement(Long id) {
		schduleRepository.findById(id).ifPresentOrElse(s -> {
			s.setStatus("Продано");
			schduleRepository.save(s);
		}, () -> new IllegalArgumentException("Расписание с id " + id + " не было найдено!"));
		advertisementRepository.findById(schduleRepository.findById(id).get().getAdvertisement().getId())
				.ifPresentOrElse(a -> {
					a.setStatus("Продано");
					a.setClient(schduleRepository.findById(id).get().getClient());
					advertisementRepository.save(a);
				}, () -> new IllegalArgumentException("Объявление с id "
						+ schduleRepository.findById(id).get().getAdvertisement().getId() + " не было найдено!"));
		schduleRepository.deleteByAdvertisementIdAndStatus(schduleRepository.findById(id).get().getAdvertisement().getId(), "Свободно");
	}

	@Override
	public List<LocalDate> getDate(Long id) {
		return schduleRepository.findDate(id).stream().map(s -> LocalDate.parse(s)).toList();
	}

	@Override
	public List<LocalTime> getTime(Long id, String date) {
		return schduleRepository.findByAdvertisementIdAndDateAndStatus(id, LocalDate.parse(date), "Свободно").stream()
				.map(s -> s.getTime()).toList();
	}

	@Override
	public List<LocalDate> replaceDate(Long id, String date) {
		List<LocalDate> dates = schduleRepository.findDate(id).stream().map(s -> LocalDate.parse(s))
				.collect(Collectors.toList());
		dates.remove(LocalDate.parse(date));
		dates.add(0, LocalDate.parse(date));
		return dates;
	}

	@Override
	public Schedule addClientToSchedule(User user, Long advertisementId, LocalDate date, LocalTime time) {
		Schedule schedule = schduleRepository.findByDateAndTimeAndAdvertisementId(date, time, advertisementId)
				.orElseThrow(() -> new IllegalArgumentException("Объявление не найдено!"));
		schedule.setClient(user);
		schedule.setStatus("Забронировано");
		return schduleRepository.save(schedule);
	}

	@Override
	public boolean checkSaleAdvertisement(Long id) {
		if(advertisementRepository.findById(schduleRepository.findById(id).get().getAdvertisement().getId()).get().getStatus().equals("Продано"))
			return false;
		return true;
	}

}
