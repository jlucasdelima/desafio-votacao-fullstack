package com.jlucasdelima.votechallenge.vote_challenge.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jlucasdelima.votechallenge.vote_challenge.models.entities.Vote.Vote;
import com.jlucasdelima.votechallenge.vote_challenge.models.entities.Vote.VotePK;

public interface VoteRepository extends JpaRepository<Vote, VotePK> {
}
