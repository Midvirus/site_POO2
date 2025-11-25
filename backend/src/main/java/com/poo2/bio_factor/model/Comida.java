public class Comida {

	private String nome;

    private int calorias;
    private int carbs;
    private int gords;
    private int proteinas;
    private int quant;

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setCalorias(int calorias) {
        this.calorias = calorias;
    }

    public void setCarbs(int carbs) {
        this.carbs = carbs;
    }

    public void setGords(int gords) {
        this.gords = gords;
    }

    public void setProteinas(int proteinas) {
        this.proteinas = proteinas;
    }

    public void setQuant(int quant) {
        this.quant = quant;
    }

    public String getNome() {
        return nome;
    }

    public int getCalorias() {
        return calorias;
    }

    public int getCarbs() {
        return carbs;
    }

    public int getGords() {
        return gords;
    }

    public int getProteinas() {
        return proteinas;
    }

    public int getQuant() {
        return quant;
    }
}
