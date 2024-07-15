package com.jlucasdelima.votechallenge.vote_challenge.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jlucasdelima.votechallenge.vote_challenge.models.entities.Agenda;

import java.time.LocalDateTime;
import java.util.List;


public interface AgendaRepository extends JpaRepository<Agenda, Long> {
  public interface OpenAgendaProjection {
    public Long getId();
    public String getTitle();
    public String getDescription();

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm:ss")
    public LocalDateTime getEndTimestamp();
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm:ss")
    public LocalDateTime getStartTimestamp();
    public default Boolean getActive() {
      LocalDateTime now = LocalDateTime.now();
      return getStartTimestamp().isBefore(now) && getEndTimestamp().isAfter(now);
    }
  }

  public interface FinishedAgendaProjection {
    public String getTitle();
    public String getDescription();

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm:ss")
    public LocalDateTime getEndTimestamp();
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm:ss")
    public LocalDateTime getStartTimestamp();
    public Long getTotalVotes();
    public double getApprovalRatio();
  }

  List<OpenAgendaProjection> findByEndTimestampGreaterThanEqual(LocalDateTime from);

  @Query("SELECT a.title as title, a.startTimestamp as startTimestamp, " +
         "a.description as description, a.endTimestamp as endTimestamp, " +
         "COUNT(v.id.agenda.id) AS totalVotes, " + 
         "COALESCE(SUM(CASE WHEN v.approve = true THEN 1 ELSE 0 END) / CAST(COUNT(v.id) AS float), 0) AS approvalRatio " +
         "FROM Agenda a LEFT JOIN Vote v ON v.id.agenda.id = a.id WHERE a.endTimestamp < :limit GROUP BY a.id")
  List<FinishedAgendaProjection> findFinished(@Param("limit") LocalDateTime limit);
}
