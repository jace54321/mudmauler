package com.example.mudmauler.controller;

import com.example.mudmauler.entity.ProductDescription;
import com.example.mudmauler.service.ProductDescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/descriptions")
public class ProductDescriptionController {

    @Autowired
    private ProductDescriptionService service;

    @GetMapping
    public List<ProductDescription> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ProductDescription getById(@PathVariable int id) {
        return service.findById(id).orElse(null);
    }

    @PostMapping
    public ProductDescription create(@RequestBody ProductDescription description) {
        return service.save(description);
    }

    @PutMapping("/{id}")
    public ProductDescription update(@PathVariable int id, @RequestBody ProductDescription updated) {
        Optional<ProductDescription> optional = service.findById(id);
        if (optional.isPresent()) {
            ProductDescription existing = optional.get();
            existing.setProductId(updated.getProductId());
            existing.setDescriptionId(updated.getDescriptionId());
            return service.save(existing);
        } else {
            return null;
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        service.deleteById(id);
    }
}
