package com.jlucasdelima.votechallenge.vote_challenge.models.entities.Vote;

import java.io.Serializable;

import com.jlucasdelima.votechallenge.vote_challenge.models.entities.Agenda;
import com.jlucasdelima.votechallenge.vote_challenge.models.entities.User;

import jakarta.persistence.Embeddable;
import jakarta.persistence.ManyToOne;
import lombok.Getter;

@Embeddable
@Getter
public class VotePK implements Serializable {
  @ManyToOne
  private User user;
  @ManyToOne
  private Agenda agenda;

  public VotePK() {}

  public VotePK(User user, Agenda agenda) {
    this.user = user;
    this.agenda = agenda;
  }
}