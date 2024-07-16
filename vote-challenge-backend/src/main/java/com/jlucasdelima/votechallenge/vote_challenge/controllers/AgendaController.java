package com.jlucasdelima.votechallenge.vote_challenge.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.jlucasdelima.votechallenge.vote_challenge.models.DTOs.FinishedAgenda;
import com.jlucasdelima.votechallenge.vote_challenge.models.DTOs.PendingAgenda;
import com.jlucasdelima.votechallenge.vote_challenge.models.DTOs.requests.NewAgendaRequest;
import com.jlucasdelima.votechallenge.vote_challenge.models.DTOs.requests.OpenAgendaRequest;
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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequestMapping("agenda")
@CrossOrigin(origins = "http://localhost:5173")
public class AgendaController {
  @Autowired
  private AgendaService agendaService;

  @PostMapping
  @ResponseStatus(code = HttpStatus.CREATED)
  public void postAgenda(@RequestBody NewAgendaRequest agendaReq) throws ResponseStatusException {
    agendaService.insert(agendaReq);
  }

  @PutMapping("/open")
  public void putMethodName(@RequestBody OpenAgendaRequest openAgendaReq) {
    agendaService.open(openAgendaReq);
  }
  
  @GetMapping("/pending")
  public List<PendingAgenda> getPending(@RequestHeader("Application-User") Long userId) {
    return agendaService.getPending(userId);
  }

  @GetMapping("/finished")
  public List<FinishedAgenda> getFinished() {
    return agendaService.getFinished();
  }
  
}
