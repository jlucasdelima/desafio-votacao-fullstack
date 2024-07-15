package com.jlucasdelima.votechallenge.vote_challenge.models.entities.Vote;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Vote {
  @EmbeddedId
  private VotePK id;
  private Boolean approve;
}
