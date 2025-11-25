package com.poo2.bio_factor.repository;

import com.poo2.bio_factor.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Define a custom method to find a user by their unique username
    Optional<User> findByUsername(String username);
}