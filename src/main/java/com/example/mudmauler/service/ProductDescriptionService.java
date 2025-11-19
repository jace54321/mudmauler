package com.example.mudmauler.service;

import com.example.mudmauler.entity.ProductDescription;
import com.example.mudmauler.repository.ProductDescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductDescriptionService {

    @Autowired
    private ProductDescriptionRepository repository;

    public List<ProductDescription> findAll() {
        return repository.findAll();
    }

    public Optional<ProductDescription> findById(int id) {
        return repository.findById(id);
    }

    public ProductDescription save(ProductDescription d) {
        return repository.save(d);
    }

    public void deleteById(int id) {
        repository.deleteById(id);
    }
}
