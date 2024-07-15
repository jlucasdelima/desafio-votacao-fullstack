package com.jlucasdelima.votechallenge.vote_challenge.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.jlucasdelima.votechallenge.vote_challenge.models.requests.NewAgendaRequest;
import com.jlucasdelima.votechallenge.vote_challenge.repositories.AgendaRepository.FinishedAgendaProjection;
import com.jlucasdelima.votechallenge.vote_challenge.repositories.AgendaRepository.OpenAgendaProjection;
import com.jlucasdelima.votechallenge.vote_challenge.services.AgendaService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("agenda")
@CrossOrigin(origins = "http://localhost:5173")
public class AgendaController {
  @Autowired
  private AgendaService agendaService;

  @PostMapping("/")
  @ResponseStatus(code = HttpStatus.CREATED)
  public void postAgenda(@RequestBody NewAgendaRequest agendaReq) throws ResponseStatusException {
    agendaService.insert(agendaReq);
  }
  
  @GetMapping("/open")
  public List<OpenAgendaProjection> getOpen() {
    return agendaService.getOpen();
  }

  @GetMapping("/finished")
  public List<FinishedAgendaProjection> getFinished() {
    return agendaService.getFinished();
  }
  
}
