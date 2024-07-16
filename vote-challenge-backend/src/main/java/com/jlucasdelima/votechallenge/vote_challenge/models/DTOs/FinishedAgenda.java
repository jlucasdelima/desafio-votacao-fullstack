package com.jlucasdelima.votechallenge.vote_challenge.models.DTOs;

public interface FinishedAgenda {
  public String getTitle();
  public String getDescription();
  public Long getTotalVotes();
  public double getApprovalRatio();
}