package com.jlucasdelima.votechallenge.vote_challenge.models.entities;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jlucasdelima.votechallenge.vote_challenge.models.entities.Vote.Vote;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
public class Agenda {
  @Id
  @GeneratedValue(strategy=GenerationType.AUTO)
  @Getter
  private long id;

  @Getter
  @Setter
  private String title;

  @Getter
  @Setter
  private String description;

  @Getter
  @Setter
  @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
  private LocalDateTime startTimestamp;

  @Getter
  @Setter
  @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss")
  private LocalDateTime endTimestamp;
  
  @ManyToOne
  @Getter
  @Setter
  private User userCreator;

  @OneToMany(mappedBy = "id.agenda")
  @Getter
  private List<Vote> votes;

  public Agenda() {}

  public Agenda(String title, String description, User userCreator) {
    this.title = title;
    this.description = description;
    this.userCreator = userCreator;
  }
}