package com.jlucasdelima.votechallenge.vote_challenge.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jlucasdelima.votechallenge.vote_challenge.models.entities.User;

import java.util.List;


public interface UserRepository extends JpaRepository<User, Long> {
  List<User> findByCpf(String cpf); 
}
