package com.realty.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.realty.model.Photo;

public interface PhotoRepository extends JpaRepository<Photo, Long> {

}
