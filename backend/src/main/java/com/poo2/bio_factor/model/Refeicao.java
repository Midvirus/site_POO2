import java.time.LocalDateTime;
import java.util.ArrayList;

public class Refeicao {

	private int totalCalorias;
	private int totalCarbs;
	private int totalGords;
    private int totalProteinas;
    private String tipo;
    private LocalDateTime dataHora;
    private ArrayList<Comida> comidas;

    public int getTotalCalorias() {
        return totalCalorias;
    }

    public void setTotalCalorias(int totalCalorias) {
        this.totalCalorias = totalCalorias;
    }

    public int getTotalCarbs() {
        return totalCarbs;
    }

    public void setTotalCarbs(int totalCarbs) {
        this.totalCarbs = totalCarbs;
    }

    public int getTotalGords() {
        return totalGords;
    }

    public void setTotalGords(int totalGords) {
        this.totalGords = totalGords;
    }

    public int getTotalProteinas() {
        return totalProteinas;
    }

    public void setTotalProteinas(int totalProteinas) {
        this.totalProteinas = totalProteinas;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public ArrayList<Comida> getComidas() {
        return comidas;
    }

    public void setComidas(ArrayList<Comida> comidas) {
        this.comidas = comidas;
    }


}
