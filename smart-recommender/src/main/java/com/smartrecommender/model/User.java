package com.smartrecommender.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id") // Nome exato na sua imagem
    private Long id;

    private String username;
    private String password;
    private String email;
    private String name;

    @Column(name = "segment_tag")
    private String segmentTag;

    private String roles;
}