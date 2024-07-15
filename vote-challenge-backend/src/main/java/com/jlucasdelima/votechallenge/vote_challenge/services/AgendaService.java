package com.jlucasdelima.votechallenge.vote_challenge.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.jlucasdelima.votechallenge.vote_challenge.models.entities.Agenda;
import com.jlucasdelima.votechallenge.vote_challenge.models.entities.User;
import com.jlucasdelima.votechallenge.vote_challenge.models.requests.NewAgendaRequest;
import com.jlucasdelima.votechallenge.vote_challenge.repositories.AgendaRepository;
import com.jlucasdelima.votechallenge.vote_challenge.repositories.AgendaRepository.FinishedAgendaProjection;
import com.jlucasdelima.votechallenge.vote_challenge.repositories.AgendaRepository.OpenAgendaProjection;
import com.jlucasdelima.votechallenge.vote_challenge.repositories.UserRepository;

@Service
public class AgendaService {
  @Autowired
  private AgendaRepository agendaRepository;
  @Autowired
  private UserRepository userRepository;

  public List<OpenAgendaProjection> getOpen() {
    return agendaRepository.findByEndTimestampGreaterThanEqual(LocalDateTime.now());
  }

  public List<FinishedAgendaProjection> getFinished() {
    return agendaRepository.findFinished(LocalDateTime.now());
  }

  public void insert(NewAgendaRequest agendaReq) throws ResponseStatusException {
    if (agendaReq.startTimestamp.isAfter(agendaReq.endTimestamp))
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid dates");

    User userCreator = userRepository.findById(agendaReq.userCreatorId).orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied"));
    Agenda newAgenda = new Agenda(agendaReq.title, agendaReq.description, agendaReq.startTimestamp, agendaReq.endTimestamp, userCreator);
    agendaRepository.save(newAgenda);
  }

  public Boolean isActive(Agenda agenda) {
    LocalDateTime now = LocalDateTime.now();
    return !(agenda.getStartTimestamp().isAfter(now) || agenda.getEndTimestamp().isBefore(now));
  }
}
