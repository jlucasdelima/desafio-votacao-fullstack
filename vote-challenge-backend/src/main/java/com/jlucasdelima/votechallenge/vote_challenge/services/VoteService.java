package com.jlucasdelima.votechallenge.vote_challenge.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.jlucasdelima.votechallenge.vote_challenge.models.entities.Agenda;
import com.jlucasdelima.votechallenge.vote_challenge.models.entities.User;
import com.jlucasdelima.votechallenge.vote_challenge.models.entities.Vote.Vote;
import com.jlucasdelima.votechallenge.vote_challenge.models.entities.Vote.VotePK;
import com.jlucasdelima.votechallenge.vote_challenge.models.requests.NewVoteRequest;
import com.jlucasdelima.votechallenge.vote_challenge.repositories.AgendaRepository;
import com.jlucasdelima.votechallenge.vote_challenge.repositories.UserRepository;
import com.jlucasdelima.votechallenge.vote_challenge.repositories.VoteRepository;

@Service
public class VoteService {
  @Autowired
  private VoteRepository voteRepository;
  @Autowired
  private AgendaRepository agendaRepository;
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private AgendaService agendaService;

  public void insert(NewVoteRequest voteReq) throws ResponseStatusException {
    User votingUser = userRepository.findById(voteReq.userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied"));
    Agenda votingAgenda = agendaRepository.findById(voteReq.agendaId).orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied"));

    if (!agendaService.isActive(votingAgenda))
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Voting closed");

    Vote vote = new Vote();
    vote.setId(new VotePK(votingUser, votingAgenda));
    vote.setApprove(voteReq.approve);
    voteRepository.save(vote);
  }
}
