package com.jlucasdelima.votechallenge.vote_challenge.models.DTOs;

import com.jlucasdelima.votechallenge.vote_challenge.models.entities.User;

public class UserLoggedIn {
  public Long id;
  public String cpf;

  public UserLoggedIn(User user) {
    this.id = user.getId();
    this.cpf = user.getCpf();
  }
}
