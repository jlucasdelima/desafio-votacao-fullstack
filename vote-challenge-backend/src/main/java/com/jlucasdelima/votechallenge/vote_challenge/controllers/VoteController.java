package com.jlucasdelima.votechallenge.vote_challenge.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.jlucasdelima.votechallenge.vote_challenge.models.DTOs.requests.NewVoteRequest;
import com.jlucasdelima.votechallenge.vote_challenge.services.VoteService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("vote")
@CrossOrigin(origins = "http://localhost:5173")
public class VoteController {
  @Autowired
  private VoteService voteService;

  @PostMapping
  @ResponseStatus(code = HttpStatus.CREATED)
  public void postVote(@RequestBody NewVoteRequest voteReq) throws ResponseStatusException {
    voteService.insert(voteReq);
  }
  
}
