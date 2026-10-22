package in.terratech.vegmap;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/listings")
public class ListingController {
    private final ListingRepository repository;

    public ListingController(ListingRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<VegetableListing> all() {
        return repository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VegetableListing create(@Valid @RequestBody VegetableListing listing) {
        listing.setId(null);
        return repository.save(listing);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Listing not found");
        }
        repository.deleteById(id);
    }
}
