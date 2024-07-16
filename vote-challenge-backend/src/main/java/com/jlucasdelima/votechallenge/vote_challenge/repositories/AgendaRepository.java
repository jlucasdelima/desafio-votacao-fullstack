package com.jlucasdelima.votechallenge.vote_challenge.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jlucasdelima.votechallenge.vote_challenge.models.DTOs.FinishedAgenda;
import com.jlucasdelima.votechallenge.vote_challenge.models.DTOs.PendingAgenda;
import com.jlucasdelima.votechallenge.vote_challenge.models.entities.Agenda;

import java.time.LocalDateTime;
import java.util.List;


public interface AgendaRepository extends JpaRepository<Agenda, Long> {
  @Query(
    "SELECT new com.jlucasdelima.votechallenge.vote_challenge.models.DTOs.PendingAgenda(a, MAX(u.id) IS NOT NULL) FROM Agenda a " +
    "LEFT JOIN Vote v ON v.id.agenda.id = a.id " + 
    "LEFT JOIN User u ON u.id = v.id.user.id and u.id = :userId " +
    "WHERE a.endTimestamp IS NULL or a.endTimestamp >= :limit GROUP BY a.id"
  )
  List<PendingAgenda> findPending(@Param("limit") LocalDateTime limit, @Param("userId") Long userId);

  @Query("SELECT a.title as title, a.startTimestamp as startTimestamp, " +
         "a.description as description, a.endTimestamp as endTimestamp, " +
         "COUNT(v.id.agenda.id) AS totalVotes, " + 
         "COALESCE(SUM(CASE WHEN v.approve = true THEN 1 ELSE 0 END) / CAST(COUNT(v.id) AS float), 0) AS approvalRatio " +
         "FROM Agenda a LEFT JOIN Vote v ON v.id.agenda.id = a.id WHERE a.endTimestamp < :limit GROUP BY a.id")
  List<FinishedAgenda> findFinished(@Param("limit") LocalDateTime limit);
}
