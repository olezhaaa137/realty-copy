package com.realty.data.load;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.realty.model.User;
import com.realty.repo.UserRepository;

@Configuration
public class PrimaryDataLoader implements WebMvcConfigurer {
	@Bean
	ApplicationRunner adminDataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		if (userRepository.findByRole("admin").isEmpty()) {
			return args -> {
				userRepository.save(User.builder().username("admin").password(passwordEncoder.encode("admin"))
						.email("admin@bsuir.com").phone("80331234567").name("Олег").surname("Буйко")
						.lastname("Александрович").role("admin").status(true).build());
			};
		}
		return null;
	}

	@Bean
	ApplicationRunner clientDataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		if (userRepository.findByRole("client").isEmpty()) {
			return args -> {
				userRepository.save(User.builder().username("client").password(passwordEncoder.encode("client"))
						.email("client@bsuir.com").phone("+375291234567").name("Олег").surname("Буйко")
						.lastname("Александрович").role("client").status(true).build());
			};
		}
		return null;
	}
	
	@Bean
	ApplicationRunner realtorDataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		if (userRepository.findByRole("realtor").isEmpty()) {
			return args -> {
				userRepository.save(User.builder().username("realtor").password(passwordEncoder.encode("realtor"))
						.email("realtor@bsuir.com").phone("+375291234567").name("Олег").surname("Буйко")
						.lastname("Александрович").role("realtor").status(true).build());
			};
		}
		return null;
	}
}
