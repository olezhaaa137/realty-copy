package com.realty.security;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.realty.model.User;
import com.realty.repo.UserRepository;
import com.realty.security.AuthSuccessHandler.LoginSuccessHandler;

@Configuration
public class SecurityConfig {

	@Autowired
	private LoginSuccessHandler authSuccessHandler;

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	UserDetailsService userDetailsService(UserRepository userRepo) {
		return username -> {
			Optional<User> user = userRepo.findByUsername(username);

			if (!user.isEmpty()) {
				return user.get();
			}

			throw new UsernameNotFoundException("Пользователь не найден!");

		};
	}

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		return http
				.formLogin(login -> login.loginPage("/login").successHandler(authSuccessHandler)
						.failureUrl("/error-login"))
				.authorizeHttpRequests().requestMatchers("/admin", "/admin/**").hasRole("ADMIN")
				.requestMatchers("/client", "/client/**").hasRole("CLIENT").requestMatchers("/realtor", "/realtor/**")
				.hasRole("REALTOR").requestMatchers("/", "/**").permitAll().and()
				.logout(logout -> logout.logoutSuccessUrl("/")).build();
	}
}
