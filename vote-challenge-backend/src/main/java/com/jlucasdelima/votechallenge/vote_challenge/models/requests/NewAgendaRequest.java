package com.jlucasdelima.votechallenge.vote_challenge.models.requests;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public class NewAgendaRequest {
  public String title;
  public String description;

  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  public LocalDateTime startTimestamp;
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  public LocalDateTime endTimestamp;

  public Long userCreatorId;
}
