package com.realty.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.time.LocalDate;
import java.time.LocalTime;

import com.realty.model.Advertisement;
import com.realty.model.LeasComparisonOptions;
import com.realty.model.LeasOption;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.realty.model.User;
import com.realty.service.AdvertisementService;
import com.realty.service.ScheduleService;
import com.realty.service.UserService;
import com.realty.webConfig.DateFormatter;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/client")
@SessionAttributes("leasComparisonOptions")
public class ClientController {

	@Autowired
	private UserService userService;

	@Autowired
	private AdvertisementService advertisementService;

	@Autowired
	private ScheduleService scheduleService;

	@ModelAttribute(name="leasComparisonOptions")
	public LeasComparisonOptions comparison(){
		return new LeasComparisonOptions();
	}

	@ModelAttribute(name="leasOption")
	public LeasOption leasOption() {
		return new LeasOption();
	}

	@PostMapping("/addLeasOption")
	public String addAdvertisement(Model model, LeasOption leasOption,
								   @ModelAttribute LeasComparisonOptions leasComparisonOptions) {
		leasComparisonOptions.addLeasOption(leasOption);
		System.out.println(leasOption.toString());
		leasComparisonOptions.printObj();
		return "redirect:/client/leasingComparison";
	}

	@GetMapping("/leasingComparison")
	public String leasComparison(){
		return "client.leasingComparison";
	}

	@PostMapping("/compareLeaseOptions")
	public String addAdvertisement(@ModelAttribute LeasComparisonOptions leasComparisonOptions, Model model) {
		String response = leasComparisonOptions.getResponseFromGPT();
		System.out.println("Ответ от гпт: " + response);
		model.addAttribute("aiRequest", leasComparisonOptions.getRequestToGPT());
		model.addAttribute("aiResponse", response);
		return "client.leasingComparison";
	}

	@GetMapping
	public String client(Model model, @AuthenticationPrincipal User user) {
		model.addAttribute("client", user);
		return "client";
	}

	@PostMapping
	public String realtor(Model model, User redUser, @AuthenticationPrincipal User user) {
		if (!userService.checkExistEmailForRedact(redUser, user)) {
			model.addAttribute("errEmail", "Пользователь с данным email уже существует!");
			model.addAttribute("client", redUser);
			return "client";
		}
		if (!userService.checkExistUsernameForRedact(redUser, user)) {
			model.addAttribute("errUsername", "Логин уже существует!");
			model.addAttribute("client", redUser);
			return "client";
		}
		userService.redactUser(redUser, user);
		return "redirect:/client";
	}

	@GetMapping("/leasingCalc")
	public String leasingCalc(Model mode) {
		return "client.leasingCalc";
	}

	@GetMapping("/advertisements")
	public String advertisements(Model model) {
		model.addAttribute("advertisements", advertisementService.getActiveAdvertisements());
		model.addAttribute("formatter", DateFormatter.getInstance());
		return "client.advertisements";
	}

	@GetMapping("/delAccount")
	public String delAccount(HttpServletRequest req, @AuthenticationPrincipal User user) throws ServletException {
		req.logout();
		userService.deleteUser(user.getId());
		return "redirect:/login";
	}

	@GetMapping("/getAdvertisement")
	public String getAdvertisement(Model model, Long id) {
		model.addAttribute("advertisement", advertisementService.getAdvertisement(id));
		return "client.advertisement";
	}

	@GetMapping("/filterAdvertisements")
	public String filterAdvertisement(Model model, String priceFrom, String priceTo) {

		if (!advertisementService.checkPriceInterval(priceFrom, priceTo)) {
			model.addAttribute("err", "Неверный интервал");
			model.addAttribute("advertisements", advertisementService.getActiveAdvertisements());
			model.addAttribute("formatter", DateFormatter.getInstance());
			return "client.advertisements";
		}
		model.addAttribute("formatter", DateFormatter.getInstance());
		model.addAttribute("advertisements", advertisementService.filterAdvertisements(priceFrom, priceTo));
		return "client.advertisements";
	}

	@GetMapping("/sortAdvertisements")
	public String sortAdvertisement(Model model, String sort) {
		model.addAttribute("formatter", DateFormatter.getInstance());
		model.addAttribute("advertisements", advertisementService.sortAdvertisements(sort));
		return "client.advertisements";
	}

	@GetMapping("/findAdvertisements")
	public String findAdvertisement(Model model, String findParam) {
		model.addAttribute("formatter", DateFormatter.getInstance());
		model.addAttribute("advertisements", advertisementService.findAdvertisements(findParam));
		return "client.advertisements";
	}

	@GetMapping("/addSchedule")
	public String addSchedule(Model model, Long id) {
		model.addAttribute("look", "look");
		model.addAttribute("dates", scheduleService.getDate(id));
		if(scheduleService.getDate(id).size()>0) {
			model.addAttribute("times", scheduleService.getTime(id, scheduleService.getDate(id).get(0).toString()));
		}
		model.addAttribute("advertisement", advertisementService.getAdvertisement(id));
		return "client.advertisement";
	}

	@GetMapping("/getTime")
	public String getTime(Model model, Long id, String date) {
		model.addAttribute("look", "look");
		model.addAttribute("dates", scheduleService.replaceDate(id, date));
		model.addAttribute("times", scheduleService.getTime(id, date));
		model.addAttribute("advertisement", advertisementService.getAdvertisement(id));
		return "client.advertisement";
	}

	@PostMapping("/addSchedule")
	public String addSchedule(Model model, @AuthenticationPrincipal User user, Long id, LocalDate date,
			LocalTime time) {
		scheduleService.addClientToSchedule(user, id, date, time);
		return "redirect:/client/schedule";
	}
	
	@GetMapping("/schedule")
	public String schedules(Model model, @AuthenticationPrincipal User user) {
		model.addAttribute("formatter", DateFormatter.getInstance());
		model.addAttribute("schedules", scheduleService.getSchedulesForClient(user));
		return "client.schedules";
	}

	@GetMapping("/findSchedules")
	public String schedules(Model model, @AuthenticationPrincipal User user, String findParam) {
		model.addAttribute("schedules", scheduleService.findSchedulesForClient(findParam, user));
		return "client.schedules";
	}

	@GetMapping("/deleteClientFromSchedule")
	public String deleteClientFromSchedule(Model model, Long id) {
		scheduleService.delClientFromSchedule(id);
		return "redirect:/client/schedule";
	}
	
	@GetMapping("/showSchedule")
	public String showSchedule(Model model, Long id) {
		model.addAttribute("check", scheduleService.checkSaleAdvertisement(id));
		model.addAttribute("schedule",scheduleService.showSchedule(id));
		return "client.scheduleShow";
	}

}
