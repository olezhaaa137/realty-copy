package com.realty.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.realty.model.User;
import com.realty.service.AdvertisementService;
import com.realty.service.ClientService;
import com.realty.service.RealtorService;
import com.realty.service.UserService;
import com.realty.webConfig.DateFormatter;

@Controller
@RequestMapping("/admin")
public class AdminController {

	@Autowired
	private UserService userService;

	@Autowired
	private RealtorService realtorService;

	@Autowired
	private ClientService clientService;

	@Autowired
	private AdvertisementService advertisementService;

	@GetMapping
	public String admin(Model model, @AuthenticationPrincipal User user) {
		model.addAttribute("admin", user);
		return "admin";
	}

	@PostMapping
	public String admin(Model model, User redUser, @AuthenticationPrincipal User user) {
		if (!userService.checkExistEmailForRedact(redUser, user)) {
			model.addAttribute("errEmail", "Пользователь с данным email уже существует!");
			model.addAttribute("admin", redUser);
			return "admin";
		}
		if (!userService.checkExistUsernameForRedact(redUser, user)) {
			model.addAttribute("errUsername", "Логин уже существует!");
			model.addAttribute("admin", redUser);
			return "admin";
		}
		userService.redactUser(redUser, user);
		return "redirect:/admin";
	}

	@GetMapping("/realtors")
	public String realtors(Model model) {
		model.addAttribute("realtors", realtorService.getRealtors());
		return "realtors";
	}

	@GetMapping("/findRealtors")
	public String findRealtors(Model model, String findParam) {
		model.addAttribute("realtors", realtorService.findRealtors(findParam));
		return "realtors";
	}

	@ModelAttribute
	public User user() {
		return new User();
	}

	@GetMapping("/addRealtor")
	public String addRealtor() {
		return "addRealtor";
	}

	@PostMapping("/addRealtor")
	public String addRealtor(Model model, User realtor) {
		if (!userService.checkExistEmail(realtor.getEmail())) {
			model.addAttribute("errEmail", "Пользователь с данным email уже существует!");
			model.addAttribute("addRealtor", realtor);
			return "addRealtor";
		}
		if (!userService.checkExistUsername(realtor.getUsername())) {
			model.addAttribute("errUsername", "Логин уже существует!");
			model.addAttribute("addRealtor", realtor);
			return "addRealtor";
		}
		realtorService.addRealtor(realtor);
		return "redirect:/admin/realtors";
	}

	@GetMapping("/realtorAccount")
	public String realtorAccount(Model model, Long id) {
		model.addAttribute("user", userService.getUser(id));
		return "realtorAccount";
	}

	@GetMapping("/realtorAccount/disactivate")
	public String disactivateRealtor(Model model, Long id) {
		userService.blockUser(id);
		model.addAttribute("user", userService.getUser(id));
		return "realtorAccount";
	}

	@GetMapping("/realtorAccount/activate")
	public String activateRealtor(Model model, Long id) {
		userService.activateUser(id);
		model.addAttribute("user", userService.getUser(id));
		return "realtorAccount";
	}

	@GetMapping("/realtorAccount/delete")
	public String deleteRealtor(Model model, Long id) {
		userService.deleteUser(id);
		return "redirect:/admin/realtors";
	}

	@GetMapping("/clients")
	public String clients(Model model) {
		model.addAttribute("clients", clientService.getClients());
		return "clients";
	}

	@GetMapping("/findClients")
	public String findClients(Model model, String findParam) {
		model.addAttribute("clients", clientService.findClients(findParam));
		return "clients";
	}

	@GetMapping("/clientAccount")
	public String clientAccount(Model model, Long id) {
		model.addAttribute("user", userService.getUser(id));
		return "clientAccount";
	}

	@GetMapping("/clientAccount/disactivate")
	public String disactivateClient(Model model, Long id) {
		userService.blockUser(id);
		model.addAttribute("user", userService.getUser(id));
		return "clientAccount";
	}

	@GetMapping("/clientAccount/activate")
	public String activateClient(Model model, Long id) {
		userService.activateUser(id);
		model.addAttribute("user", userService.getUser(id));
		return "clientAccount";
	}

	@GetMapping("/clientAccount/delete")
	public String deleteClient(Model model, Long id) {
		userService.deleteUser(id);
		return "redirect:/admin/clients";
	}

	@GetMapping("/advertisements")
	public String advertisements(Model model) {
		model.addAttribute("advertisements", advertisementService.getAdvertisements());
		model.addAttribute("formatter", DateFormatter.getInstance());
		return "admin.advertisements";
	}

	@GetMapping("/getAdvertisement")
	public String getAdvertisement(Model model, Long id) {
		model.addAttribute("advertisement", advertisementService.getAdvertisement(id));
		return "admin.advertisement";
	}

	@GetMapping("/filterAdvertisements")
	public String filterAdvertisement(Model model, String priceFrom, String priceTo) {

		if (!advertisementService.checkPriceInterval(priceFrom, priceTo)) {
			model.addAttribute("err", "Неверный интервал");
			model.addAttribute("advertisements", advertisementService.getAdvertisements());
			model.addAttribute("formatter", DateFormatter.getInstance());
			return "admin.advertisements";
		}
		model.addAttribute("formatter", DateFormatter.getInstance());
		model.addAttribute("advertisements", advertisementService.filterAdvertisementsAdmin(priceFrom, priceTo));
		return "admin.advertisements";
	}

	@GetMapping("/sortAdvertisements")
	public String sortAdvertisement(Model model, String sort) {
		model.addAttribute("formatter", DateFormatter.getInstance());
		model.addAttribute("advertisements", advertisementService.sortAdvertisementsAdmin(sort));
		return "admin.advertisements";
	}

	@GetMapping("/findAdvertisements")
	public String findAdvertisement(Model model, String findParam) {
		model.addAttribute("formatter", DateFormatter.getInstance());
		model.addAttribute("advertisements", advertisementService.findAdvertisementsAdmin(findParam));
		return "admin.advertisements";
	}

	@GetMapping("/confirmAdvertisement")
	public String confirmAdvertisements(Long id) {
		advertisementService.confirmAdvertisement(id);
		return "redirect:/admin/advertisements";
	}

	@GetMapping("/cancelAdvertisement")
	public String cancelAdvertisements(Long id) {
		advertisementService.cancelAdvertisement(id);
		return "redirect:/admin/advertisements";
	}

	@GetMapping("/statistics")
	public String statistics(Model model) {
		model.addAttribute("realtors", advertisementService.getTopRealtor());
		return "statistics";
	}
}
