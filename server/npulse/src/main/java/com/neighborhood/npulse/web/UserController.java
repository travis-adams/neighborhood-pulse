package com.neighborhood.npulse.web;

import com.neighborhood.npulse.user.AppUser;
import com.neighborhood.npulse.user.AppUserRepo;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    private AppUserRepo appUserRepo;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserController(AppUserRepo appUserRepo, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.appUserRepo = appUserRepo;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @PostMapping("/sign-up")
    public void signUp(@RequestBody AppUser user){
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        appUserRepo.save(user);
    }
}
