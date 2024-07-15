package com.jlucasdelima.votechallenge.vote_challenge.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jlucasdelima.votechallenge.vote_challenge.models.entities.User;
import com.jlucasdelima.votechallenge.vote_challenge.models.requests.LogInRequest;
import com.jlucasdelima.votechallenge.vote_challenge.models.responses.LogInResponse;
import com.jlucasdelima.votechallenge.vote_challenge.services.UserService;


@RestController
@RequestMapping("user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
  @Autowired
  private UserService userService;

  @PostMapping("/")
  public LogInResponse postUser(@RequestBody LogInRequest logInReq) {
    User user = new User();
    user.setCpf(logInReq.cpf);
  
    User inserted = userService.insert(user);
    return new LogInResponse(inserted);
  }
}
