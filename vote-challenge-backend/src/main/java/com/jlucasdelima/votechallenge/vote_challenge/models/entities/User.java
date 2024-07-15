package com.jlucasdelima.votechallenge.vote_challenge.models.entities;

import java.util.List;

import com.jlucasdelima.votechallenge.vote_challenge.models.entities.Vote.Vote;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "SysUser")
public class User {
  @Id
  @GeneratedValue(strategy=GenerationType.AUTO)
  @Getter
  private long id;
  
  @Column(unique = true)
  @Getter
  @Setter
  private String cpf;
  
  @OneToMany(mappedBy = "userCreator")
  @Getter 
  private List<Agenda> agendas;

  @OneToMany(mappedBy = "id.user")
  @Getter
  private List<Vote> votes;
}
