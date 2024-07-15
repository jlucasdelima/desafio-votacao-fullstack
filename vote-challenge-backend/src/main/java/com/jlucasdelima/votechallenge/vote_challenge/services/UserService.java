package com.jlucasdelima.votechallenge.vote_challenge.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jlucasdelima.votechallenge.vote_challenge.models.entities.User;
import com.jlucasdelima.votechallenge.vote_challenge.repositories.UserRepository;

@Service
public class UserService {
  @Autowired
  private UserRepository userRepository;

  public List<User> getExistingByCpf(String cpf) {
    return userRepository.findByCpf(cpf);
  }

  public User insert(User user) {
    List<User> existing = getExistingByCpf(user.getCpf());
    if (existing.size() > 0) return existing.getFirst();

    return userRepository.save(user);
  }
}
