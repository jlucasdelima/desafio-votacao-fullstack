package com.jlucasdelima.votechallenge.vote_challenge.services;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.jlucasdelima.votechallenge.vote_challenge.models.DTOs.FinishedAgenda;
import com.jlucasdelima.votechallenge.vote_challenge.models.DTOs.PendingAgenda;
import com.jlucasdelima.votechallenge.vote_challenge.models.DTOs.requests.NewAgendaRequest;
import com.jlucasdelima.votechallenge.vote_challenge.models.DTOs.requests.OpenAgendaRequest;
import com.jlucasdelima.votechallenge.vote_challenge.models.entities.Agenda;
import com.jlucasdelima.votechallenge.vote_challenge.models.entities.User;
import com.jlucasdelima.votechallenge.vote_challenge.repositories.AgendaRepository;
import com.jlucasdelima.votechallenge.vote_challenge.repositories.UserRepository;

@Service
public class AgendaService {
  @Autowired
  private AgendaRepository agendaRepository;
  @Autowired
  private UserRepository userRepository;

  public List<PendingAgenda> getPending(Long userId) {
    return agendaRepository.findPending(LocalDateTime.now(), userId);
  }

  public List<FinishedAgenda> getFinished() {
    return agendaRepository.findFinished(LocalDateTime.now());
  }

  public void open(OpenAgendaRequest openAgendaReq) throws ResponseStatusException {
    Agenda agenda = agendaRepository.findById(openAgendaReq.agendaId)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado"));
  
    if (this.isOpen(agenda) || this.isFinished(agenda))
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível abrir a sessão");
    
    agenda.setStartTimestamp(LocalDateTime.now());
    agenda.setEndTimestamp(LocalDateTime.now().plus(openAgendaReq.sessionDuration, ChronoUnit.MINUTES));
    
    agendaRepository.save(agenda);
  }

  public void insert(NewAgendaRequest agendaReq) throws ResponseStatusException {
    User userCreator = userRepository.findById(agendaReq.userCreatorId)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado"));
    Agenda newAgenda = new Agenda(agendaReq.title, agendaReq.description, userCreator);
    agendaRepository.save(newAgenda);
  }

  public Boolean isOpen(Agenda agenda) {
    try {
      LocalDateTime now = LocalDateTime.now();
      return (agenda.getStartTimestamp().isBefore(now) || agenda.getStartTimestamp().isEqual(now)) && agenda.getEndTimestamp().isAfter(now);
    } catch (Exception e) {
      return false;
    }
  }

  public Boolean isFinished(Agenda agenda) {
    try {
      LocalDateTime now = LocalDateTime.now();
      return agenda.getEndTimestamp().isBefore(now);
    } catch (Exception e) {
      return false;
    }
  }
}
