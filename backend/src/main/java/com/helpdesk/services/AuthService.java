package com.helpdesk.services;

import com.helpdesk.dto.LoginRequestDTO;
import com.helpdesk.dto.LoginResponseDTO;
import com.helpdesk.dto.UserResponseDTO;
import com.helpdesk.entities.User;
import com.helpdesk.exceptions.InvalidCredentialsException;
import com.helpdesk.repositories.UserRepository;
import com.helpdesk.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO dto) {
        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new InvalidCredentialsException("Email ou senha inválidos"));

        if (!passwordEncoder.matches(dto.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Email ou senha inválidos");
        }

        String token = tokenService.generateToken(user);
        return new LoginResponseDTO(token, UserResponseDTO.from(user));
    }
}
