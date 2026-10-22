package in.terratech.vegmap;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class VegetableListing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 80)
    private String vegetable;

    @NotNull
    @DecimalMin(value = "0.01")
    private Double pricePerKg;

    @NotNull
    @DecimalMin(value = "0.01")
    private Double quantityKg;

    @NotBlank
    @Size(max = 100)
    private String sellerName;

    private boolean available = true;

    public VegetableListing() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getVegetable() { return vegetable; }
    public void setVegetable(String vegetable) { this.vegetable = vegetable; }
    public Double getPricePerKg() { return pricePerKg; }
    public void setPricePerKg(Double pricePerKg) { this.pricePerKg = pricePerKg; }
    public Double getQuantityKg() { return quantityKg; }
    public void setQuantityKg(Double quantityKg) { this.quantityKg = quantityKg; }
    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}
