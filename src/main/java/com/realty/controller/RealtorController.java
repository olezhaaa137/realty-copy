package com.realty.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import com.realty.model.Advertisement;
import com.realty.model.User;
import com.realty.service.AdvertisementService;
import com.realty.service.ScheduleService;
import com.realty.service.UserService;
import com.realty.webConfig.DateFormatter;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/realtor")
public class RealtorController {
	@Autowired
	private UserService userService;

	@Autowired
	private AdvertisementService advertisementService;

	@Autowired
	private ScheduleService scheduleService;

	@GetMapping
	public String realtor(Model model, @AuthenticationPrincipal User user) {
		model.addAttribute("realtor", user);
		return "realtor";
	}

	@PostMapping
	public String realtor(Model model, User redUser, @AuthenticationPrincipal User user) {
		if (!userService.checkExistEmailForRedact(redUser, user)) {
			model.addAttribute("errEmail", "Пользователь с данным email уже существует!");
			model.addAttribute("realtor", redUser);
			return "realtor";
		}
		if (!userService.checkExistUsernameForRedact(redUser, user)) {
			model.addAttribute("errUsername", "Логин уже существует!");
			model.addAttribute("realtor", redUser);
			return "realtor";
		}
		userService.redactUser(redUser, user);
		return "redirect:/realtor";
	}

	@GetMapping("/advertisements")
	public String advertisements(Model model) {
		model.addAttribute("advertisements", advertisementService.getActiveAdvertisements());
		model.addAttribute("formatter", DateFormatter.getInstance());
		return "advertisements";
	}

	@GetMapping("/delAccount")
	public String delAccount(HttpServletRequest req, @AuthenticationPrincipal User user) throws ServletException {
		req.logout();
		userService.deleteUser(user.getId());
		return "redirect:/login";
	}

	@GetMapping("/myAdvertisements")
	public String myAdvertisements(Model model, @AuthenticationPrincipal User user) {
		model.addAttribute("advertisements", advertisementService.getAdvertisementsForRealtor(user.getId()));
		model.addAttribute("my", "my");
		model.addAttribute("formatter", DateFormatter.getInstance());
		return "advertisements";
	}

	@ModelAttribute
	public Advertisement advertisement() {
		return new Advertisement();
	}

	@GetMapping("/addAdvertisement")
	public String addAdvertisement(Model model) {
		return "addAdvertisement";
	}

	@PostMapping("/addAdvertisement")
	public String addAdvertisement(Model model, Advertisement advertisement, MultipartFile[] photo,
			@AuthenticationPrincipal User user) throws InterruptedException, IOException {
		advertisementService.addAdvertisement(advertisement, photo, user);
		Thread.sleep(2000);
		return "redirect:/realtor/advertisements";
	}

	@GetMapping("/getAdvertisement")
	public String getAdvertisement(Model model, Long id) {
		model.addAttribute("advertisement", advertisementService.getAdvertisement(id));
		return "advertisement";
	}

	@GetMapping("/filterAdvertisements")
	public String filterAdvertisement(Model model, String priceFrom, String priceTo) {

		if (!advertisementService.checkPriceInterval(priceFrom, priceTo)) {
			model.addAttribute("err", "Неверный интервал");
			model.addAttribute("advertisements", advertisementService.getActiveAdvertisements());
			model.addAttribute("formatter", DateFormatter.getInstance());
			return "advertisements";
		}
		model.addAttribute("formatter", DateFormatter.getInstance());
		model.addAttribute("advertisements", advertisementService.filterAdvertisements(priceFrom, priceTo));
		return "advertisements";
	}

	@GetMapping("/sortAdvertisements")
	public String sortAdvertisement(Model model, String sort) {
		model.addAttribute("formatter", DateFormatter.getInstance());
		model.addAttribute("advertisements", advertisementService.sortAdvertisements(sort));
		return "advertisements";
	}

	@GetMapping("/findAdvertisements")
	public String findAdvertisement(Model model, String findParam) {
		model.addAttribute("formatter", DateFormatter.getInstance());
		model.addAttribute("advertisements", advertisementService.findAdvertisements(findParam));
		return "advertisements";
	}

	@GetMapping("/getAdvertisementMy")
	public String getAdvertisementMy(Model model, Long id) {
		model.addAttribute("my", "my");
		model.addAttribute("advertisement", advertisementService.getAdvertisement(id));
		return "advertisement";
	}

	@GetMapping("/filterAdvertisementsMy")
	public String filterAdvertisementsMy(Model model, String priceFrom, String priceTo,
			@AuthenticationPrincipal User user) {

		if (!advertisementService.checkPriceInterval(priceFrom, priceTo)) {
			model.addAttribute("err", "Неверный интервал");
			model.addAttribute("advertisements", advertisementService.getActiveAdvertisements());
			model.addAttribute("my", "my");
			model.addAttribute("formatter", DateFormatter.getInstance());
			return "advertisements";
		}
		model.addAttribute("my", "my");
		model.addAttribute("formatter", DateFormatter.getInstance());
		model.addAttribute("advertisements", advertisementService.filterAdvertisementsMy(priceFrom, priceTo, user));
		return "advertisements";
	}

	@GetMapping("/sortAdvertisementsMy")
	public String sortAdvertisementsMy(Model model, String sort, @AuthenticationPrincipal User user) {
		model.addAttribute("formatter", DateFormatter.getInstance());
		model.addAttribute("my", "my");
		model.addAttribute("advertisements", advertisementService.sortAdvertisementsMy(sort, user));
		return "advertisements";
	}

	@GetMapping("/findAdvertisementsMy")
	public String findAdvertisementsMy(Model model, String findParam, @AuthenticationPrincipal User user) {
		model.addAttribute("formatter", DateFormatter.getInstance());
		model.addAttribute("my", "my");
		model.addAttribute("advertisements", advertisementService.findAdvertisementsMy(findParam, user));
		return "advertisements";
	}

	@GetMapping("/redPrice")
	public String redPrice(Model model, Long id) {
		model.addAttribute("red", "red");
		model.addAttribute("advertisement", advertisementService.getAdvertisement(id));
		return "advertisement";
	}

	@PostMapping("/redPrice")
	public String redPrice(Model model, Long id, String price) {
		advertisementService.redactAdvertisement(id, price);
		return "redirect:/realtor/getAdvertisementMy?id=" + id;
	}

	@GetMapping("/schedule")
	public String schedules(Model model, @AuthenticationPrincipal User user) {
		model.addAttribute("formatter", DateFormatter.getInstance());
		model.addAttribute("schedules", scheduleService.getSchedulesForRealtor(user));
		return "schedules";
	}

	@GetMapping("/findSchedules")
	public String schedules(Model model, @AuthenticationPrincipal User user, String findParam) {
		model.addAttribute("schedules", scheduleService.findSchedulesForRealtor(findParam, user));
		return "schedules";
	}

	@GetMapping("/deleteSchedule")
	public String deleteSchedule(Model model, Long id) {
		scheduleService.deleteSchedule(id);
		return "redirect:/realtor/schedule";
	}

	@GetMapping("/deleteClientFromSchedule")
	public String deleteClientFromSchedule(Model model, Long id) {
		scheduleService.delClientFromSchedule(id);
		return "redirect:/realtor/schedule";
	}

	@GetMapping("/addSchedule")
	public String addSchedule(Model model, @AuthenticationPrincipal User user) {
		model.addAttribute("advertisements", advertisementService.getAdvertisementsForRealtor(user.getId()));
		model.addAttribute("my", "my");
		model.addAttribute("formatter", DateFormatter.getInstance());
		return "advertisements";
	}
	
	@PostMapping("/addSchedule")
	public String addSchedule(Model model, LocalDate date, LocalTime time, Long id) {
		if(!scheduleService.checkDate(date, time)) {
			model.addAttribute("err","Неверно указана дата!");
			model.addAttribute("my", "my");
			model.addAttribute("advertisement", advertisementService.getAdvertisement(id));
			return "advertisement";
		}
		if(!scheduleService.checkTime(date, time)) {
			model.addAttribute("err","Неверно указано время!");
			model.addAttribute("my", "my");
			model.addAttribute("advertisement", advertisementService.getAdvertisement(id));
			return "advertisement";
		}
		if(!scheduleService.checkExistSchedule(date, time, id)) {
			model.addAttribute("err","Расписание уже существует!");
			model.addAttribute("my", "my");
			model.addAttribute("advertisement", advertisementService.getAdvertisement(id));
			return "advertisement";
		}
		scheduleService.addSchedule(date, time, id);
		return "redirect:/realtor/schedule";
	}
	
	@GetMapping("/showSchedule")
	public String showSchedule(Model model, Long id) {
		model.addAttribute("check", scheduleService.checkSaleAdvertisement(id));
		model.addAttribute("schedule",scheduleService.showSchedule(id));
		return "scheduleShow";
	}
	
	@GetMapping("/saleAdvertisement")
	public String saleAdvertisement(Long id) {
		scheduleService.saleAdvertisement(id);
		return "redirect:/realtor/myAdvertisements";
	}
}
