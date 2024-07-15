package com.jlucasdelima.votechallenge.vote_challenge.models.responses;

import com.jlucasdelima.votechallenge.vote_challenge.models.entities.User;

public class LogInResponse {
  public Long id;
  public String cpf;

  public LogInResponse(User user) {
    this.id = user.getId();
    this.cpf = user.getCpf();
  }
}
