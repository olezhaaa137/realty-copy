package com.realty.repo;

import com.realty.model.Advertisement;
import com.realty.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepo extends JpaRepository<Comment, Long> {
    List<Comment> findByAdvertisement(Advertisement advertisement);
}
