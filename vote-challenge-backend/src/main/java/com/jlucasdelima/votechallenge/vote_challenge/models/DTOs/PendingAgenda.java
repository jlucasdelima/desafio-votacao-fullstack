package com.jlucasdelima.votechallenge.vote_challenge.models.DTOs;

import java.time.LocalDateTime;

import com.jlucasdelima.votechallenge.vote_challenge.models.entities.Agenda;

import lombok.Setter;

public class PendingAgenda {
  @Setter
  private Agenda agenda;

  @Setter
  private boolean isVoted;

  public PendingAgenda(Agenda agenda, boolean isVoted) {
    this.agenda = agenda;
    this.isVoted = isVoted;
  }
  public Long getId() { return agenda.getId();  };
  public String getTitle() { return agenda.getTitle(); };
  public String getDescription() { return agenda.getDescription(); }
  public Boolean getIsVoted() { return isVoted; }

  public Boolean getIsOpen() {
    if (agenda.getEndTimestamp() == null) return false;

    try {
      LocalDateTime now = LocalDateTime.now();
      return agenda.getStartTimestamp().isBefore(now) && agenda.getEndTimestamp().isAfter(now);
    } catch (Exception e) {
      return false;
    }
  }
}