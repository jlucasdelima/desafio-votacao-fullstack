package com.jlucasdelima.votechallenge.vote_challenge;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.web.server.ResponseStatusException;

import com.jlucasdelima.votechallenge.vote_challenge.models.DTOs.requests.NewAgendaRequest;
import com.jlucasdelima.votechallenge.vote_challenge.models.DTOs.requests.OpenAgendaRequest;
import com.jlucasdelima.votechallenge.vote_challenge.models.entities.Agenda;
import com.jlucasdelima.votechallenge.vote_challenge.models.entities.User;
import com.jlucasdelima.votechallenge.vote_challenge.repositories.AgendaRepository;
import com.jlucasdelima.votechallenge.vote_challenge.repositories.UserRepository;
import com.jlucasdelima.votechallenge.vote_challenge.services.AgendaService;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class AgendaServiceTests {
  
  @Mock
  private AgendaRepository agendaRepository;
  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private AgendaService agendaService;

  @Test
  public void isOpen_CurrentTimeBetweenStartEnd_True() {
    Agenda agenda = new Agenda("teste", "description", null);

    agenda.setStartTimestamp(LocalDateTime.now().minus(1, ChronoUnit.MINUTES));
    agenda.setEndTimestamp(LocalDateTime.now().plus(1, ChronoUnit.MINUTES));

    assertTrue(agendaService.isOpen(agenda));
  }

  @Test
  public void isOpen_CurrentTimeBeforeStartEnd_False() {
    Agenda agenda = new Agenda("teste", "description", null);

    agenda.setStartTimestamp(LocalDateTime.now().plus(1, ChronoUnit.MINUTES));
    agenda.setEndTimestamp(LocalDateTime.now().plus(2, ChronoUnit.MINUTES));

    assertFalse(agendaService.isOpen(agenda));
  }

  @Test
  public void isOpen_StartEndNull_False() {
    Agenda agenda = new Agenda("teste", "description", null);

    assertFalse(agendaService.isOpen(agenda));
  }

  @Test
  public void isOpen_StartAfterEnd_False() {
    Agenda agenda = new Agenda("teste", "description", null);

    agenda.setStartTimestamp(LocalDateTime.now().plus(1, ChronoUnit.MINUTES));
    agenda.setEndTimestamp(LocalDateTime.now().minus(1, ChronoUnit.MINUTES));

    assertFalse(agendaService.isOpen(agenda));
  }

  @Test
  public void isFinished_CurrentTimeAfterEnd_True() {
    Agenda agenda = new Agenda("teste", "description", null);

    agenda.setStartTimestamp(LocalDateTime.now().minus(2, ChronoUnit.MINUTES));
    agenda.setEndTimestamp(LocalDateTime.now().minus(1, ChronoUnit.MINUTES));

    assertTrue(agendaService.isFinished(agenda));
  }

  @Test
  public void isFinished_CurrentTimeBeforeStart_False() {
    Agenda agenda = new Agenda("teste", "description", null);

    agenda.setStartTimestamp(LocalDateTime.now().plus(1, ChronoUnit.MINUTES));
    agenda.setEndTimestamp(LocalDateTime.now().plus(2, ChronoUnit.MINUTES));

    assertFalse(agendaService.isFinished(agenda));
  }

  @Test
  public void isFinished_AgendaOpen_False() {
    Agenda agenda = new Agenda("teste", "description", null);

    agenda.setStartTimestamp(LocalDateTime.now().minus(1, ChronoUnit.MINUTES));
    agenda.setEndTimestamp(LocalDateTime.now().plus(2, ChronoUnit.MINUTES));

    assertFalse(agendaService.isFinished(agenda));
  }

  @Test
  public void open_PendingAgenda_Success() {
    Agenda agenda = new Agenda("teste", "description", null);

    Mockito.when(agendaRepository.findById(Long.valueOf(0))).thenReturn(Optional.of(agenda));
    Mockito.when(agendaRepository.save(agenda)).thenReturn(agenda);
    
    OpenAgendaRequest openAgendaReq = new OpenAgendaRequest();
    openAgendaReq.agendaId = Long.valueOf(0);
    openAgendaReq.sessionDuration = Long.valueOf(1);
    assertDoesNotThrow(() -> agendaService.open(openAgendaReq));
  }

  @Test
  public void open_UnexistentAgenda_ThrowsResponseStatusException() {
    Mockito.when(agendaRepository.findById(Long.valueOf(0))).thenReturn(Optional.empty());
    
    OpenAgendaRequest openAgendaReq = new OpenAgendaRequest();
    openAgendaReq.agendaId = Long.valueOf(0);
    openAgendaReq.sessionDuration = Long.valueOf(1);
    assertThrows(ResponseStatusException.class, () -> agendaService.open(openAgendaReq));
  }

  @Test
  public void open_FinishedAgenda_ThrowsResponseStatusException() {
    Agenda agenda = new Agenda("test", "description", null);
    agenda.setStartTimestamp(LocalDateTime.now().minus(2, ChronoUnit.MINUTES));
    agenda.setEndTimestamp(LocalDateTime.now().minus(1, ChronoUnit.MINUTES));

    Mockito.when(agendaRepository.findById(Long.valueOf(0))).thenReturn(Optional.of(agenda));
    
    OpenAgendaRequest openAgendaReq = new OpenAgendaRequest();
    openAgendaReq.agendaId = Long.valueOf(0);
    openAgendaReq.sessionDuration = Long.valueOf(1);
    assertThrows(ResponseStatusException.class, () -> agendaService.open(openAgendaReq));
  }

  @Test
  public void insert_Success() {
    User user = new User();
    user.setCpf("test");

    Mockito.when(userRepository.findById(Long.valueOf(0))).thenReturn(Optional.of(user));
    when(agendaRepository.save(any(Agenda.class))).thenAnswer(i -> i.getArguments()[0]);
    
    NewAgendaRequest newAgendaReq = new NewAgendaRequest();
    newAgendaReq.title = "";
    newAgendaReq.description = "";
    newAgendaReq.userCreatorId = Long.valueOf(0);
    assertDoesNotThrow(() -> agendaService.insert(newAgendaReq));
  }
}
