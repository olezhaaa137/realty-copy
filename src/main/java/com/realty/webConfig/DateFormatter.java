package com.realty.webConfig;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public final class DateFormatter {

	private static DateFormatter instanceDateFormatter;

	private DateFormatter() {
	}

	public static DateFormatter getInstance() {
		if (instanceDateFormatter == null) {
			instanceDateFormatter = new DateFormatter();
		}
		return instanceDateFormatter;
	}

	public String format(LocalDate date) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
		return date.format(formatter);
	}
}
