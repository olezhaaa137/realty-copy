package com.realty.model;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Advertisement implements Serializable{
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotNull
	private String name;
	
	@NotNull
	private String type;
	
	@NotNull
	private Float price;
	
	private Integer year;
	
	private Integer livingArea;
	
	private Integer totalArea;
	
	private Integer floor;
	
	private String renovations;
	
	private String water;
	
	private String gas;
	
	private String light;
	
	@Column(length = Integer.MAX_VALUE)
	private String description;
	
	private String geoposition;
	
	private String status;
	
	private LocalDate createdDate;
	
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	private List<Photo> photos = new ArrayList<Photo>();
	
	@ManyToOne
	private User realtor;
	
	@ManyToOne
	private User client;
	
	public void addPhoto(Photo photo) {
		this.photos.add(photo);
	}
	
	public void removePhoto(Photo photo) {
		this.photos.remove(photo);
	}
}
