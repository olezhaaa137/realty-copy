package com.realty.security;

import java.io.IOException;
import java.util.Set;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class AuthSuccessHandler {

	@Component
	public class LoginSuccessHandler implements AuthenticationSuccessHandler {
		@Override
		public void onAuthenticationSuccess(HttpServletRequest httpServletRequest,
				HttpServletResponse httpServletResponse, Authentication authentication)
				throws IOException, ServletException {
			Set<String> roles = AuthorityUtils.authorityListToSet(authentication.getAuthorities());
			if (roles.contains("ROLE_ADMIN")) {
				httpServletResponse.sendRedirect("/admin");
			}
			if (roles.contains("ROLE_CLIENT")) {
				httpServletResponse.sendRedirect("/client");
			}
			if (roles.contains("ROLE_REALTOR")) {
				httpServletResponse.sendRedirect("/realtor");
			}
		}
	}
}
